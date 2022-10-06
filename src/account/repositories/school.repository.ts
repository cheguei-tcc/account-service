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
    schoolId: number,
    name: string,
    period: string,
  ): Promise<void> {
    await this.knex('classroom')
      .update(classroomEditDto)
      .where({
        school_id: schoolId,
        name,
        period,
      });
  }

  async deleteClassroom(
    schoolId: number,
    name: string,
    period: string,
  ): Promise<boolean> {
    const deleted = await this.knex('classroom')
      .delete()
      .where({
        school_id: schoolId,
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

  async getSchool(id?: number): Promise<SchoolDto> {
    return this.knex('school')
      .select(['name', 'cnpj', 'address'])
      .where({ id })
      .first();
  }

  async create(school: PostSchoolDto): Promise<void> {
    await this.knex('school').insert(school);
  }

  async edit(id: number, school: EditSchoolDto): Promise<void> {
    await this.knex('school').update(school).where({ id });
  }

  async delete(id: number): Promise<boolean> {
    const deleted = await this.knex('school').delete().where({ id });
    return deleted > 0;
  }

  async getAllStudents(schoolId: number): Promise<GenericUserDto[]> {
    return this.knex('user_role as ur')
      .select(['u.cpf', 'u.name'])
      .innerJoin('user as u', 'u.id', 'ur.user_id')
      .innerJoin('role as r', 'r.id', 'ur.role_id')
      .innerJoin('school as s', 's.id', 'u.school_id')
      .where('s.id', '=', schoolId)
      .andWhere('r.name', '=', 'student');
  }

  async getAllClassrooms(schoolId: number): Promise<ClassroomDto[]> {
    return this.knex('classroom as c')
      .select(['c.name', 'c.period', 'c.description'])
      .innerJoin('school as s', 's.id', 'c.school_id')
      .where('s.id', '=', schoolId);
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
