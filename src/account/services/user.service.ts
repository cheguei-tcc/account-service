import { Injectable } from '@nestjs/common';
import { UserRepository } from '../abstractions/user';
import {
  GenericUserDto,
  PostUserDto,
  UserInfoDto,
  UserLoginDto,
} from '../dtos/user.dto';
import { Encrypter } from '../../common/abstractions/encrypter';
import { BaseError } from '../../common/errors/base';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly encrypter: Encrypter,
  ) {}

  async listUsers(cnpj: string): Promise<GenericUserDto[]> {
    return this.userRepository.getAll(cnpj);
  }

  async addUser(postUser: PostUserDto): Promise<void> {
    postUser.password = await this.encrypter.encrypt(postUser.password);
    return this.userRepository.create(postUser);
  }

  async login({ username, password }: UserLoginDto): Promise<UserInfoDto> {
    const userInfo = await this.userRepository.getUserInfo(username);
    if (!userInfo) throw new BaseError('User does not found', 404);
    const isCorrect = await this.encrypter.compare(
      password,
      userInfo.passwordHash,
    );
    if (isCorrect) {
      return userInfo;
    }
    throw new BaseError('Wrong Credentials', 401);
  }
}
