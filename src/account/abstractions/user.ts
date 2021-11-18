import { GenericUserDto, PostUserDto, UserInfoDto } from '../dtos/user.dto';

export abstract class UserRepository {
  abstract getAll(cnpj: string): Promise<GenericUserDto[]>;
  abstract getPasswordHash(cpf: string): Promise<string>;
  abstract create(user: PostUserDto): Promise<void>;
  abstract getUserInfo(cpf: string): Promise<UserInfoDto>;
}
