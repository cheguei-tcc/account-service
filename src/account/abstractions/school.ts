import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto } from '../dtos/user.dto';

export abstract class SchoolRepository {
  abstract getAll(): Promise<SchoolDto[]>;
  abstract create(school: PostSchoolDto): Promise<void>;
  // students stuff
  abstract getAllStudents(cnpj: string): Promise<GenericUserDto[]>;
  // classroom stuff
  abstract getAllClassrooms(cnpj: string): Promise<ClassroomDto[]>;
  abstract createClassroom(classroom: PostClassroomDto): Promise<void>;
}
