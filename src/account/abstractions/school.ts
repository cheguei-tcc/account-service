import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { EditSchoolDto, PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto, ResponsibleBySchoolDto, ResponsibleUpsertDto } from '../dtos/user.dto';

export abstract class SchoolRepository {
  abstract getAll(): Promise<SchoolDto[]>;
  abstract getAllResponsibles(schoolId: number): Promise<
  {
    parent: GenericUserDto;
    child: GenericUserDto;
    classroom: { name: string; period: string; description: string };
  }[]
>;
  abstract create(school: PostSchoolDto): Promise<void>;
  abstract edit(id: number, school: EditSchoolDto): Promise<void>;
  abstract delete(id: number): Promise<boolean>;
  abstract getSchool(id?: number): Promise<SchoolDto>;
  // students stuff
  abstract getAllStudents(schoolId: number): Promise<GenericUserDto[]>;
  abstract getAllMonitors(schoolId: number): Promise<GenericUserDto[]>;
  // classroom stuff
  abstract getAllClassrooms(schoolId: number): Promise<ClassroomDto[]>;
  abstract createClassroom(classroom: PostClassroomDto): Promise<void>;
  abstract getResponsibleWithStudents(schoolId: number): Promise<ResponsibleUpsertDto[]>;
  abstract editClassroom(
    classroomEditDto: ClassroomDto,
    schoolId: number,
    name: string,
    period: string,
  ): Promise<void>;
  abstract deleteClassroom(
    schoolId: number,
    name: string,
    period: string,
  ): Promise<boolean>;
}
