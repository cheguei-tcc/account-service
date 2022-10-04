import {
  EditUserDto,
  GenericUserDto,
  PostUserDto,
  UserInfoDto,
} from '../dtos/user.dto';

export abstract class UserRepository {
  abstract getAll(cnpj: string): Promise<GenericUserDto[]>;
  abstract getPasswordHash(cpf: string): Promise<string>;
  abstract create(user: PostUserDto): Promise<void>;
  abstract edit(cpf: string, user: EditUserDto): Promise<void>;
  abstract delete(cpf: string): Promise<boolean>;
  abstract getUserInfo(email: string): Promise<UserInfoDto>;
  abstract getParentChildren(parentCpf: string): Promise<
    {
      parent: GenericUserDto;
      child: GenericUserDto;
      classroom: { name: string; period: string; description: string };
    }[]
  >;
  abstract insertParentChildren(
    schoolCnpj: string,
    insertData: {
      parent: GenericUserDto;
      defaultPassword: string;
      children: {
        name: string;
        cpf: string;
        classroom: { name: string; period: string; description: string };
      }[];
    },
  ): Promise<void>;
}
