import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AuthService } from '../../auth/auth.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../../auth/guards/local-auth.guard';
import { Role, Roles } from '../../auth/roles.decorator';
import {
  createParentAndChildrenDto,
  EditUserDto,
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
  @Post('/bulk')
  async createParentAndChildren(
    @Body() body: createParentAndChildrenDto,
    @Request() req,
  ): Promise<void> {
    const cnpj = req.user.school.cnpj;
    await this.userService.createParentAndChildren(cnpj, body);
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

  @Roles(Role.Sudo, Role.Admin)
  @Get('/parent/:cpf/children')
  @ApiParam({ name: 'cpf' })
  async getParentChildren(@Param() params) {
    return await this.userService.getParentChildren(params.cpf);
  }

  @ApiBearerAuth('accessToken')
  @UseGuards(JwtAuthGuard)
  @ApiParam({ name: 'cpf' })
  @Put(':cpf')
  async editUser(@Body() body: EditUserDto, @Param() params): Promise<void> {
    try {
      await this.userService.editUser(params.cpf, body);
    } catch (e) {
      if (e.code) {
        throw new HttpException(e.message, e.code);
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }

  @Roles(Role.Admin, Role.Sudo)
  @Delete(':cpf')
  @ApiParam({ name: 'cpf' })
  async deleteUser(@Param() params, @Res() res: Response) {
    const deleted = await this.userService.deleteUser(params.cpf);
    return deleted
      ? res.status(HttpStatus.NO_CONTENT).json()
      : res.status(HttpStatus.NOT_FOUND).json();
  }

  @Roles(Role.Sudo, Role.Admin)
  @Get(':cpf')
  @ApiParam({ name: 'cpf' })
  async getUser(@Param() params) {
    try {
      return await this.userService.getUserInfo(params.cpf);
    } catch (e) {
      if (e.code) {
        throw new HttpException(e.message, e.code);
      } else {
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
      }
    }
  }
}
