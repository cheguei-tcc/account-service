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

  async getAll(cnpj: string): Promise<GenericUserDto[] | UserInfoDto[]> {
    return cnpj
      ? this.getUsersInfo(cnpj)
      : this.knex('user').select(['name', 'cpf']);
  }
  private userInfoCommonQuery(omitPasswordHash = false) {
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

    const selectFields = [
      'u.name',
      'u.cpf',
      schoolInfoSelectData,
      parentInfoSelectData,
      this.knex.raw(`
      array(select r.name from user_role ur inner join role r on r.id = ur.role_id where ur.user_id = u.id) as roles`),
    ];

    if (!omitPasswordHash) selectFields.push('u.password as passwordHash');

    return this.knex('user as u')
      .select<UserInfoDto>(selectFields)
      .leftJoin('school as s', 's.id', 'u.school_id')
      .leftJoin('user as u2', 'u2.id', 'u.parent_id');
  }

  private async getUsersInfo(cnpj: string): Promise<any> {
    // omit password hash as true value
    return this.userInfoCommonQuery(true).where('s.cnpj', '=', cnpj);
  }

  async getUserInfo(cpf: string): Promise<UserInfoDto> {
    return this.userInfoCommonQuery().where('u.cpf', '=', cpf).first();
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
      const [schoolId] = await trx('school')
        .select('id')
        .where({ cnpj: user.relatedSchoolCNPJ });

      if (!schoolId) {
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
          school_id: schoolId.id,
        })
        .returning('id');

      await trx('user_role').insert({
        user_id: userId,
        role_id: trx('role').select('id').where('name', user.role),
      });
    });
  }
}
