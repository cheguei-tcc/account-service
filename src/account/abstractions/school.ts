import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { EditSchoolDto, PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto } from '../dtos/user.dto';

export abstract class SchoolRepository {
  abstract getAll(): Promise<SchoolDto[]>;
  abstract create(school: PostSchoolDto): Promise<void>;
  abstract edit(cnpj: string, school: EditSchoolDto): Promise<void>;
  abstract delete(cnpj: string): Promise<boolean>;
  abstract getSchool(cnpj: string): Promise<SchoolDto>;
  // students stuff
  abstract getAllStudents(cnpj: string): Promise<GenericUserDto[]>;
  // classroom stuff
  abstract getAllClassrooms(cnpj: string): Promise<ClassroomDto[]>;
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
