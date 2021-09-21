import { Injectable } from '@nestjs/common';
import { SchoolRepository } from '../abstractions/school';
import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto } from '../dtos/user.dto';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepository: SchoolRepository) {}

  async listSchools(): Promise<SchoolDto[]> {
    return this.schoolRepository.getAll();
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

  async addClassroom(classroom: PostClassroomDto): Promise<void> {
    await this.schoolRepository.createClassroom(classroom);
  }
}
