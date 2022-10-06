import { Injectable } from '@nestjs/common';
import { BaseError } from '../../common/errors/base';
import { SchoolRepository } from '../abstractions/school';
import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { EditSchoolDto, PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto, ResponsibleBySchoolDto } from '../dtos/user.dto';

@Injectable()
export class SchoolService {
  constructor(private readonly schoolRepository: SchoolRepository) {}

  async listResponsibles(schoolId: number): Promise<ResponsibleBySchoolDto[]> {
    const repoData = await this.schoolRepository.getAllResponsibles(schoolId);
    if (!repoData) throw new BaseError('schoolId does not found', 404);
    
    const responsibles :ResponsibleBySchoolDto[] = []
    
    for (const data of repoData) {
      const responsible = responsibles.find(r => r.id === data.parent.id);
      if (!responsible) {
        responsibles.push({
          ...data.parent,
          children: [{ ...data.child, classroom: data.classroom}]
        })
        continue
      }
      responsible.children.push({...data.child, classroom: data.classroom });
    }
    
    return responsibles
  }
  async listSchools(): Promise<SchoolDto[]> {
    return this.schoolRepository.getAll();
  }

  async getSchool(id?: number): Promise<SchoolDto> {
    return this.schoolRepository.getSchool(id);
  }

  async listStudents(schoolId: number): Promise<GenericUserDto[]> {
    return this.schoolRepository.getAllStudents(schoolId);
  }

  async listClassrooms(schoolId: number): Promise<ClassroomDto[]> {
    return this.schoolRepository.getAllClassrooms(schoolId);
  }

  async addSchool(postSchool: PostSchoolDto): Promise<void> {
    await this.schoolRepository.create(postSchool);
  }

  async editSchool(id: number, editSchool: EditSchoolDto): Promise<void> {
    await this.schoolRepository.edit(id, editSchool);
  }

  async deleteSchool(id: number): Promise<boolean> {
    return this.schoolRepository.delete(id);
  }

  async addClassroom(classroom: PostClassroomDto): Promise<void> {
    await this.schoolRepository.createClassroom(classroom);
  }

  async editClassroom(
    classroom: ClassroomDto,
    schoolId: number,
    name: string,
    period: string,
  ): Promise<void> {
    await this.schoolRepository.editClassroom(classroom, schoolId, name, period);
  }

  async deleteClassroom(
    schoolId: number,
    name: string,
    period: string,
  ): Promise<boolean> {
    return await this.schoolRepository.deleteClassroom(schoolId, name, period);
  }
}
