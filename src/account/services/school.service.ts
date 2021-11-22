import { Injectable } from '@nestjs/common';
import { SchoolRepository } from '../abstractions/school';
import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { EditSchoolDto, PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto } from '../dtos/user.dto';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepository: SchoolRepository) {}

  async listSchools(): Promise<SchoolDto[]> {
    return this.schoolRepository.getAll();
  }

  async getSchool(cnpj: string): Promise<SchoolDto> {
    return this.schoolRepository.getSchool(cnpj);
  }

  async listStudents(cnpj: string): Promise<GenericUserDto[]> {
    return this.schoolRepository.getAllStudents(cnpj);
  }

  async listClassrooms(cnpj: string): Promise<ClassroomDto[]> {
    return this.schoolRepository.getAllClassrooms(cnpj);
  }

  async addSchool(postSchool: PostSchoolDto): Promise<void> {
    await this.schoolRepository.create(postSchool);
  }

  async editSchool(cnpj: string, editSchool: EditSchoolDto): Promise<void> {
    await this.schoolRepository.edit(cnpj, editSchool);
  }

  async deleteSchool(cnpj: string): Promise<boolean> {
    return this.schoolRepository.delete(cnpj);
  }

  async addClassroom(classroom: PostClassroomDto): Promise<void> {
    await this.schoolRepository.createClassroom(classroom);
  }

  async editClassroom(
    classroom: ClassroomDto,
    cnpj: string,
    name: string,
    period: string,
  ): Promise<void> {
    await this.schoolRepository.editClassroom(classroom, cnpj, name, period);
  }

  async deleteClassroom(
    cnpj: string,
    name: string,
    period: string,
  ): Promise<boolean> {
    return await this.schoolRepository.deleteClassroom(cnpj, name, period);
  }
}
