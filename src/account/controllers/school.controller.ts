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
import { GenericUserDto, ResponsibleBySchoolDto } from '../dtos/user.dto';
import { SchoolService } from '../services/school.service';

@ApiTags('Account')
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
@Controller('school')
@ApiBearerAuth('accessToken')
export class SchoolController {
  constructor(private readonly schoolService: SchoolService) {}
  @ApiParam({ name: 'schoolId' })
  @Get('/:schoolId/responsibles')
  @Roles(Role.Sudo, Role.Admin)
  async listResponsibles(
    @Param() params,
  ): Promise<ResponsibleBySchoolDto[]> {
    return await this.schoolService.listResponsibles(Number(params.schoolId));
  }

  @Get()
  @Roles(Role.Sudo, Role.Admin)
  @ApiQuery({
    name: 'cnpj',
    description: 'cnpjSchool to list students',
    required: false,
  })
  async listSchools(
    @Query('id') id: string,
    @Res() res: Response,
  ): Promise<SchoolDto[] | any> {
    if (id) {
      const school = await this.schoolService.getSchool(Number(id));
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

  @ApiQuery({ name: 'schoolId', description: 'schoolId to list students' })
  @Get('/student')
  @Roles(Role.Admin, Role.Sudo, Role.Monitor)
  async listStudents(@Query('schoolId') schoolId: string): Promise<GenericUserDto[]> {
    return await this.schoolService.listStudents(Number(schoolId));
  }
  
  @ApiQuery({ name: 'schoolId', description: 'schoolId to list students' })
  @Get('/monitor')
  @Roles(Role.Admin, Role.Sudo, Role.Monitor)
  async listMonitors(@Query('schoolId') schoolId: string): Promise<GenericUserDto[]> {
    return await this.schoolService.listMonitors(Number(schoolId));
  }
  
  @Get('/classroom')
  @Roles(Role.Admin, Role.Sudo, Role.Monitor)
  @ApiQuery({ name: 'schoolId', description: 'schoolId to list classrooms' })
  async listClassrooms(@Query('schoolId') schoolId: string): Promise<ClassroomDto[]> {
    return await this.schoolService.listClassrooms(Number(schoolId));
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/classroom')
  @Roles(Role.Admin, Role.Sudo)
  async createClassroom(@Body() body: PostClassroomDto): Promise<void> {
    await this.schoolService.addClassroom(body);
  }

  @Put()
  @ApiQuery({
    name: 'id',
    description: 'cnpjSchool to list students',
    required: true,
  })
  @Roles(Role.Sudo)
  async editSchool(
    @Body() body: EditSchoolDto,
    @Query('id') id: string,
  ): Promise<void> {
    await this.schoolService.editSchool(Number(id), body);
  }

  @Roles(Role.Sudo)
  @Delete()
  @ApiQuery({
    name: 'id',
    description: 'cnpjSchool to list students',
    required: true,
  })
  async deleteSchool(@Query('id') id: string, @Res() res: Response) {
    const deleted = await this.schoolService.deleteSchool(Number(id));
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

    @Query('schoolId') schoolId: string,
  ): Promise<void> {
    await this.schoolService.editClassroom(
      body,
      Number(schoolId),
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
    @Query('schoolId') schoolId: string,
    @Param() params,
  ): Promise<void> {
    await this.schoolService.deleteClassroom(Number(schoolId), params.name, params.period);
  }

  
  @Roles(Role.Sudo, Role.Admin)
  @Get('/:schoolId/sync/responsibles')
  @ApiParam({ name: 'schoolId' })
  async syncResponsibleData(@Param() params) {
    await this.schoolService.syncResponsibles(Number(params.schoolId));
  }
}
