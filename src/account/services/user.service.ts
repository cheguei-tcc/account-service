import { Injectable } from '@nestjs/common';
import { UserRepository } from '../abstractions/user';
import { GenericUserDto, PostUserDto, UserLoginDto } from '../dtos/user.dto';
import { Encrypter } from '../../common/abstractions/encrypter';
import { BaseError } from '../../common/errors/base';

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

  async login({ cpf, password }: UserLoginDto): Promise<string> {
    const hash = await this.userRepository.getPasswordHash(cpf);
    const isCorrect = await this.encrypter.compare(password, hash);
    if (isCorrect) {
      return 'fake-jwt-token';
    }
    throw new BaseError('Wrong Credentials', 401);
  }
}
