import { Injectable } from '@nestjs/common';
import { SchoolRepository } from '../abstractions/school';
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

  async addSchool(postSchool: PostSchoolDto): Promise<void> {
    return this.schoolRepository.create(postSchool);
  }
}
