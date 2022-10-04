import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import {
  createParentAndChildrenDto,
  EditUserDto,
  GenericUserDto,
  PostUserDto,
} from '../dtos/user.dto';
import { BaseError } from '../../common/errors/base';
import { UserRepository } from '../abstractions/user';
import { UserInfoDto } from '../dtos/user.dto';

@Injectable()
export class UserRepositoryKnexImpl extends UserRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {
    super();
  }

  insertParentChildren(
    schoolCnpj: string,
    insertData: createParentAndChildrenDto,
  ): Promise<void> {
    return this.knex.transaction(async (trx) => {
      const schoolId = trx('school').select('id').where({ cnpj: schoolCnpj });

      const { parent, defaultPassword, children } = insertData;

      const [parentId] = await trx('user')
        .insert({
          cpf: parent.cpf,
          name: parent.name,
          password: defaultPassword,
          school_id: schoolId,
        })
        .returning('id');

      await trx('user_role').insert({
        user_id: parentId,
        role_id: trx('role').select('id').where('name', '=', 'parent'),
      });

      for (const child of children) {
        const [childId] = await trx('user')
          .insert({
            cpf: child.cpf,
            name: child.name,
            parent_id: parentId,
            password: defaultPassword,
            school_id: schoolId,
          })
          .returning('id');

        const classroomId = trx('classroom')
          .select('id')
          .where({
            school_id: schoolId,
            name: child.classroom.name,
            period: child.classroom.period,
          })
          .returning('id');

        await trx('student_classroom').insert({
          user_id: childId,
          classroom_id: classroomId,
        });

        await trx('user_role').insert({
          user_id: childId,
          role_id: trx('role').select('id').where('name', '=', 'student'),
        });
      }
    });
  }

  async getParentChildren(parentCpf: string): Promise<
    {
      parent: GenericUserDto;
      child: GenericUserDto;
      classroom: { name: string; period: string; description: string };
    }[]
  > {
    const parentSelectData = this.knex.raw(
      `json_build_object('name', u.name, 'cpf', u.cpf) as parent`,
    );
    const childSelectData = this.knex.raw(
      `json_build_object('name', u2.name, 'cpf', u2.cpf) as child`,
    );
    const classroomSelectData = this.knex.raw(
      `json_build_object('name', c.name, 'period', c.period, 'description', c.description) as classroom`,
    );

    return await this.knex(`user as u`)
      .select<
        {
          parent: GenericUserDto;
          child: GenericUserDto;
          classroom: { name: string; period: string; description: string };
        }[]
      >([parentSelectData, childSelectData, classroomSelectData])
      .innerJoin(`user as u2`, 'u2.parent_id', 'u.id')
      .innerJoin('student_classroom as sc', 'sc.user_id', 'u2.id')
      .innerJoin('classroom as c', 'c.id', 'sc.classroom_id')
      .where('u.cpf', '=', parentCpf);
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
        json_build_object('name', s.name, 'cnpj', s.cnpj, 'latitude', s.latitude, 'longitude', s.longitude) 
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
      'u.email',
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

  async getUserInfo(email: string): Promise<UserInfoDto> {
    return this.userInfoCommonQuery().where('u.email', '=', email).first();
  }

  async getPasswordHash(cpf: string): Promise<string> {
    const { password } = await this.knex('user')
      .select(['password'])
      .where({ cpf })
      .first();
    return password;
  }

  async edit(cpf: string, user: EditUserDto): Promise<void> {
    await this.knex('user').update(user).where({ cpf });
  }

  async delete(cpf: string): Promise<boolean> {
    const deleted = await this.knex('user').delete().where({ cpf });
    return deleted > 0;
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
