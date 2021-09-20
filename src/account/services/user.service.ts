import { Injectable } from '@nestjs/common';
import { UserRepository } from '../abstractions/user';
import { GenericUserDto, PostUserDto } from '../dtos/user.dto';
import { Encrypter } from '../../common/abstractions/encrypter';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async listUsers(): Promise<GenericUserDto[]> {
    return this.userRepository.getAll();
  }

  async addUser(postUser: PostUserDto): Promise<void> {
    postUser.password = await this.encrypter.encrypt(postUser.password);
    return this.userRepository.create(postUser);
  }
}
