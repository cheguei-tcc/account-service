import { GenericUserDto, PostUserDto } from '../dtos/user.dto';

export abstract class UserRepository {
  abstract getAll(): Promise<GenericUserDto[]>;
  abstract create(user: PostUserDto): Promise<void>;
}
