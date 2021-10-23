import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role, Roles } from '../../auth/roles.decorator';
import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { PostSchoolDto, SchoolDto } from '../dtos/school.dto';
import { GenericUserDto } from '../dtos/user.dto';
import { SchoolService } from '../services/school.service';

@ApiTags('Account')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('school')
@ApiBearerAuth('accessToken')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}

  @Get()
  @Roles(Role.Sudo)
  async listSchools(): Promise<SchoolDto[]> {
    return await this.schoolService.listSchools();
  }

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @Roles(Role.Sudo)
  async createSchool(@Body() body: PostSchoolDto): Promise<void> {
    await this.schoolService.addSchool(body);
  }

  @ApiQuery({ name: 'cnpj', description: 'cnpjSchool to list students' })
  @Get('/student')
  @Roles(Role.Admin, Role.Sudo, Role.Monitor)
  async listStudents(@Query('cnpj') cnpj: string): Promise<GenericUserDto[]> {
    return await this.schoolService.listStudents(cnpj);
  }

  @Get('/classroom')
  @Roles(Role.Admin, Role.Sudo)
  async listClassrooms(@Query('cnpj') cnpj: string): Promise<ClassroomDto[]> {
    return await this.schoolService.listClassrooms(cnpj);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/classroom')
  @Roles(Role.Admin, Role.Sudo)
  async createClassroom(@Body() body: PostClassroomDto): Promise<void> {
    await this.schoolService.addClassroom(body);
  }
}
