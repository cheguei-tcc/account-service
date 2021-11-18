import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import {
  GenericUserDto,
  PostUserDto,
  UserLoginDto,
  UserLoginResponseDto,
} from '../dtos/user.dto';
import { UserService } from '../services/user.service';

@ApiTags('Account')
@Controller('user')
export class UserController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiQuery({
    name: 'cnpj',
    description: 'cnpjSchool to list students',
    required: false,
  })
  @Get()
  async listUsers(@Query('cnpj') cnpj?: string): Promise<GenericUserDto[]> {
    return await this.userService.listUsers(cnpj);
  }

  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
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

  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @Body() _: UserLoginDto,
    @Request() req,
  ): Promise<UserLoginResponseDto> {
    try {
      return await this.authService.login(req.user);
    } catch (e) {
      if (e.code) {
        throw new HttpException(e.message, e.code);
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
