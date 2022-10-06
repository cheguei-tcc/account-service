import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { EditSchoolDto, PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto } from '../dtos/user.dto';

export abstract class SchoolRepository {
  abstract getAll(): Promise<SchoolDto[]>;
  abstract create(school: PostSchoolDto): Promise<void>;
  abstract edit(id: number, school: EditSchoolDto): Promise<void>;
  abstract delete(id: number): Promise<boolean>;
  abstract getSchool(id?: number): Promise<SchoolDto>;
  // students stuff
  abstract getAllStudents(schoolId: number): Promise<GenericUserDto[]>;
  // classroom stuff
  abstract getAllClassrooms(schoolId: number): Promise<ClassroomDto[]>;
  abstract createClassroom(classroom: PostClassroomDto): Promise<void>;
  abstract editClassroom(
    classroomEditDto: ClassroomDto,
    cnpj: string,
    name: string,
    period: string,
  ): Promise<void>;
  abstract deleteClassroom(
    cnpj: string,
    name: string,
    period: string,
  ): Promise<boolean>;
}
