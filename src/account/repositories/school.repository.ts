import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { EditSchoolDto, PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { SchoolRepository } from '../abstractions/school';
import { GenericUserDto } from '../dtos/user.dto';
import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';

@Injectable()
export class SchoolRepositoryKnexImpl extends SchoolRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {
    super();
  }

  async editClassroom(
    classroomEditDto: ClassroomDto,
    cnpj: string,
    name: string,
    period: string,
  ): Promise<void> {
    await this.knex('classroom')
      .update(classroomEditDto)
      .where({
        school_id: this.knex('school').select('id').where({ cnpj }),
        name,
        period,
      });
  }

  async deleteClassroom(
    cnpj: string,
    name: string,
    period: string,
  ): Promise<boolean> {
    const deleted = await this.knex('classroom')
      .delete()
      .where({
        school_id: this.knex('school').select('id').where({ cnpj }),
        name,
        period,
      });
    return deleted > 0;
  }

  async getAll(): Promise<SchoolDto[]> {
    return this.knex('school').select([
      'name',
      'cnpj',
      'address',
      'created_at as createdAt',
    ]);
  }

  async getSchool(cnpj: string): Promise<SchoolDto> {
    return this.knex('school')
      .select(['name', 'cnpj', 'address'])
      .where({ cnpj })
      .first();
  }

  async create(school: PostSchoolDto): Promise<void> {
    await this.knex('school').insert(school);
  }

  async edit(cnpj: string, school: EditSchoolDto): Promise<void> {
    await this.knex('school').update(school).where({ cnpj });
  }

  async delete(cnpj: string): Promise<boolean> {
    const deleted = await this.knex('school').delete().where({ cnpj });
    return deleted > 0;
  }

  async getAllStudents(cnpj: string): Promise<GenericUserDto[]> {
    return this.knex('user_role as ur')
      .select(['u.cpf', 'u.name'])
      .innerJoin('user as u', 'u.id', 'ur.user_id')
      .innerJoin('role as r', 'r.id', 'ur.role_id')
      .innerJoin('school as s', 's.id', 'u.school_id')
      .where('s.cnpj', '=', cnpj)
      .andWhere('r.name', '=', 'student');
  }

  async getAllClassrooms(cnpj: string): Promise<ClassroomDto[]> {
    return this.knex('classroom as c')
      .select(['c.name', 'c.period', 'c.description'])
      .innerJoin('school as s', 's.id', 'c.school_id')
      .where('s.cnpj', '=', cnpj);
  }

  async createClassroom(classroom: PostClassroomDto): Promise<void> {
    const { relatedSchoolCNPJ, ...classroomData } = classroom;
    await this.knex('classroom').insert({
      ...classroomData,
      school_id: this.knex('school')
        .select('id')
        .where({ cnpj: relatedSchoolCNPJ }),
    });
  }
}
