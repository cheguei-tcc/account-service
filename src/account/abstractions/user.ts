import {
  EditUserDto,
  GenericUserDto,
  PostUserDto,
  UserInfoDto,
} from '../dtos/user.dto';

export abstract class UserRepository {
  abstract getAll(schoolId: number): Promise<GenericUserDto[]>;
  abstract getPasswordHash(cpf: string): Promise<string>;
  abstract create(user: PostUserDto): Promise<void>;
  abstract edit(id: number, user: EditUserDto): Promise<void>;
  abstract delete(id: number): Promise<boolean>;
  abstract getUserInfo(email: string): Promise<UserInfoDto>;
  abstract getParentChildren(parentId: number): Promise<
    {
      parent: GenericUserDto;
      child: GenericUserDto;
      classroom: { name: string; period: string; description: string };
    }[]
  >;
  abstract insertParentChildren(
    schoolId: number,
    insertData: {
      parent: GenericUserDto;
      defaultPassword: string;
      children: {
        name: string;
        cpf: string;
        gender?: string;
        classroom: { name: string; period: string; description: string };
      }[];
    },
  ): Promise<void>;
}
