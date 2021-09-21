import { GenericUserDto, PostUserDto } from '../dtos/user.dto';

export abstract class UserRepository {
  abstract getAll(): Promise<GenericUserDto[]>;
  abstract getPasswordHash(cpf: string): Promise<string>;
  abstract create(user: PostUserDto): Promise<void>;
}
