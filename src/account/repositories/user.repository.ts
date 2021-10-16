import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { GenericUserDto, PostUserDto } from '../dtos/user.dto';
import { BaseError } from '../../common/errors/base';
import { UserRepository } from '../abstractions/user';
import { UserInfoDto } from '../dtos/user.dto';

@Injectable()
export class UserRepositoryKnexImpl extends UserRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {
    super();
  }

  async getAll(): Promise<GenericUserDto[]> {
    return this.knex('user').select(['name', 'cpf']);
  }

  async getUserInfo(cpf: string): Promise<UserInfoDto> {
    const schoolInfoSelectData = this.knex.raw(
      `
      case when u.school_id is not null then
        json_build_object('name', s.name, 'cnpj', s.cnpj) 
      end as school
      `,
    );

    const parentInfoSelectData = this.knex.raw(
      `
      case when u.parent_id is not null then 
        json_build_object('name', u2."name", 'cpf', u2.cpf )
      end as parent
      `,
    );

    return this.knex('user as u')
      .select<UserInfoDto>([
        'u.name',
        'u.cpf',
        'u.password as passwordHash',
        schoolInfoSelectData,
        parentInfoSelectData,
      ])
      .leftJoin('school as s', 's.id', 'u.school_id')
      .leftJoin('user as u2', 'u2.id', 'u.parent_id')
      .where('u.cpf', '=', cpf)
      .first();
  }

  async getPasswordHash(cpf: string): Promise<string> {
    const { password } = await this.knex('user')
      .select(['password'])
      .where({ cpf })
      .first();
    return password;
  }

  async create(user: PostUserDto): Promise<void> {
    return this.knex.transaction(async (trx) => {
      const [schooldId] = await trx('school')
        .select('id')
        .where({ cnpj: user.relatedSchoolCNPJ });

      if (!schooldId) {
        throw new BaseError(
          `School CNPJ ${user.relatedSchoolCNPJ} must exist`,
          400,
        );
      }

      const [userId] = await trx('user')
        .insert({
          cpf: user.cpf,
          name: user.name,
          password: user.password,
          ...(user.relatedParentCPF && {
            parent_id: trx('user')
              .select('id')
              .where({ cpf: user.relatedParentCPF }),
          }),
        })
        .returning('id');

      await trx('user_role').insert({
        user_id: userId,
        role_id: trx('role').select('id').where('name', user.role),
      });
    });
  }
}
