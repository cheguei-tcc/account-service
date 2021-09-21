import { Injectable } from '@nestjs/common';
import { InjectKnex, Knex } from 'nestjs-knex';
import { PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { SchoolRepository } from '../abstractions/school';
import { GenericUserDto } from '../dtos/user.dto';
import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';

@Injectable()
export class SchoolRepositoryKnexImpl extends SchoolRepository {
  constructor(@InjectKnex() private readonly knex: Knex) {
    super();
  }

  async getAll(): Promise<SchoolDto[]> {
    return this.knex('school').select([
      'name',
      'cnpj',
      'address',
      'created_at as createdAt',
    ]);
  }

  async create(school: PostSchoolDto): Promise<void> {
    await this.knex('school').insert(school);
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
