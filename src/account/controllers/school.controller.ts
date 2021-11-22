import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Role, Roles } from '../../auth/roles.decorator';
import { ClassroomDto, PostClassroomDto } from '../dtos/clasroom.dto';
import { EditSchoolDto, PostSchoolDto, SchoolDto } from '../dtos/school.dto';
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
  @Roles(Role.Sudo, Role.Admin)
  @ApiQuery({
    name: 'cnpj',
    description: 'cnpjSchool to list students',
    required: false,
  })
  async listSchools(
    @Query('cnpj') cnpj: string,
    @Res() res: Response,
  ): Promise<SchoolDto[] | any> {
    if (cnpj) {
      const school = await this.schoolService.getSchool(cnpj);
      return school
        ? res.status(HttpStatus.OK).json(school)
        : res.status(HttpStatus.NOT_FOUND).json();
    }
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
  @ApiQuery({ name: 'cnpj', description: 'cnpjSchool to list classrooms' })
  async listClassrooms(@Query('cnpj') cnpj: string): Promise<ClassroomDto[]> {
    return await this.schoolService.listClassrooms(cnpj);
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/classroom')
  @Roles(Role.Admin, Role.Sudo)
  async createClassroom(@Body() body: PostClassroomDto): Promise<void> {
    await this.schoolService.addClassroom(body);
  }

  @Put()
  @ApiQuery({
    name: 'cnpj',
    description: 'cnpjSchool to list students',
    required: true,
  })
  @Roles(Role.Sudo)
  async editSchool(
    @Body() body: EditSchoolDto,
    @Query('cnpj') cnpj: string,
  ): Promise<void> {
    await this.schoolService.editSchool(cnpj, body);
  }

  @Roles(Role.Sudo)
  @Delete()
  @ApiQuery({
    name: 'cnpj',
    description: 'cnpjSchool to list students',
    required: true,
  })
  async deleteSchool(@Query('cnpj') cnpj: string, @Res() res: Response) {
    const deleted = await this.schoolService.deleteSchool(cnpj);
    return deleted
      ? res.status(HttpStatus.NO_CONTENT).json()
      : res.status(HttpStatus.NOT_FOUND).json();
  }

  @ApiQuery({
    name: 'cnpj',
    description: 'cnpjSchool to list students',
    required: true,
  })
  @ApiParam({ name: 'name' })
  @ApiParam({ name: 'period' })
  @Put('/classroom/:name/:period')
  @Roles(Role.Sudo, Role.Admin)
  async editClassroom(
    @Body() body: ClassroomDto,
    @Param() params,

    @Query('cnpj') cnpj: string,
  ): Promise<void> {
    await this.schoolService.editClassroom(
      body,
      cnpj,
      params.name,
      params.period,
    );
  }

  @ApiQuery({
    name: 'cnpj',
    description: 'cnpjSchool to list students',
    required: true,
  })
  @ApiParam({ name: 'name' })
  @ApiParam({ name: 'period' })
  @Delete('/classroom/:name/:period')
  @Roles(Role.Sudo, Role.Admin)
  async deleteClassroom(
    @Query('cnpj') cnpj: string,
    @Param() params,
  ): Promise<void> {
    await this.schoolService.deleteClassroom(cnpj, params.name, params.period);
  }
}
