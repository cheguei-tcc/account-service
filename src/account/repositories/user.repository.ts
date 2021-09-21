import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { GenericUserDto, PostUserDto } from '../dtos/user.dto';
import { BaseError } from '../../common/errors/base';
import { UserRepository } from '../abstractions/user';

@Injectable()
export class UserRepositoryKnexImpl extends UserRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {
    super();
  }

  async getAll(): Promise<GenericUserDto[]> {
    return this.knex('user').select(['name', 'cpf']);
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
