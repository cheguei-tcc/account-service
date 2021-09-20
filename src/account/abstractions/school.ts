import { PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto } from '../dtos/user.dto';

export abstract class SchoolRepository {
  abstract getAll(): Promise<SchoolDto[]>;
  abstract create(school: PostSchoolDto): Promise<void>;
  abstract getAllStudents(cnpj: string): Promise<GenericUserDto[]>;
}
