import { Injectable } from '@nestjs/common';
import { UserRepository } from '../abstractions/user';
import {
  createParentAndChildrenDto,
  EditUserDto,
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
  
  async listResponsiblesWithChildren(): Promise<any> {
    // TODO QUERY WITH ARRAY, LIST ALL PARENTS ROLES AND RESPECTIVE STUDENTS ?
  };

  async createParentAndChildren(
    schoolId: number,
    data: createParentAndChildrenDto,
  ): Promise<any> {
    data.defaultPassword = await this.encrypter.encrypt(
      process.env.DEFAULT_USER_PASSWORD || data.defaultPassword,
    );
    return await this.userRepository.insertParentChildren(schoolId, data);
  }
  async editUser(id: number, editUser: EditUserDto): Promise<void> {
    return await this.userRepository.edit(id, editUser);
  }

  async deleteUser(id: number): Promise<boolean> {
    return await this.userRepository.delete(id);
  }

  async listUsers(schoolId: number): Promise<GenericUserDto[]> {
    return this.userRepository.getAll(schoolId);
  }

  async addUser(postUser: PostUserDto): Promise<void> {
    postUser.password = await this.encrypter.encrypt(postUser.password);
    return this.userRepository.create(postUser);
  }

  async getUserInfo(email: string): Promise<UserInfoDto> {
    const userInfo = await this.userRepository.getUserInfo(email);
    if (!userInfo) throw new BaseError('User does not found', 404);
    const { passwordHash: _, ...user } = userInfo;
    return user as UserInfoDto;
  }

  async getParentChildren(parentId: number) {
    const repoData = await this.userRepository.getParentChildren(parentId);
    if (!repoData) throw new BaseError('User does not found', 404);
    const { parent } = repoData.find((data) => data.parent.id == parentId);
    const children = repoData.map((data) => ({
      id: data.child.id,
      gender: data.child.gender,
      name: data.child.name,
      cpf: data.child.cpf,
      classroom: data.classroom,
    }));
    return { ...parent, children };
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
