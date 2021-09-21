import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GenericUserDto, PostUserDto, UserLoginDto } from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Account')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async listUsers(): Promise<GenericUserDto[]> {
    return await this.userService.listUsers();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async createUser(@Body() body: PostUserDto): Promise<void> {
    try {
      await this.userService.addUser(body);
    } catch (e) {
      if (e.code) {
        throw new HttpException(e.message, e.code);
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Post('login')
  async login(@Body() body: UserLoginDto): Promise<string> {
    try {
      return await this.userService.login(body);
    } catch (e) {
      if (e.code) {
        throw new HttpException(e.message, e.code);
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
