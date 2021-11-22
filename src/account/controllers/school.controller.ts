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

  @ApiParam({ name: 'cnpj' })
  @ApiParam({ name: 'name' })
  @ApiParam({ name: 'period' })
  @Put('/classroom/:cnpj/:name/:period')
  @Roles(Role.Sudo, Role.Admin)
  async editClassroom(
    @Body() body: ClassroomDto,
    @Param() params,
  ): Promise<void> {
    await this.schoolService.editClassroom(
      body,
      params.cnpj,
      params.name,
      params.period,
    );
  }

  @ApiParam({ name: 'cnpj' })
  @ApiParam({ name: 'name' })
  @ApiParam({ name: 'period' })
  @Delete('/classroom/:cnpj/:name/:period')
  @Roles(Role.Sudo, Role.Admin)
  async deleteClassroom(
    @Body() body: ClassroomDto,
    @Param() params,
  ): Promise<void> {
    await this.schoolService.deleteClassroom(
      params.cnpj,
      params.name,
      params.period,
    );
  }

  @ApiParam({ name: 'cnpj' })
  @Put(':cnpj')
  @Roles(Role.Sudo)
  async editSchool(
    @Body() body: EditSchoolDto,
    @Param() params,
  ): Promise<void> {
    await this.schoolService.editSchool(params.cnpj, body);
  }

  @Roles(Role.Sudo, Role.Admin)
  @Get(':cnpj')
  @ApiParam({ name: 'cnpj' })
  async getSchool(@Param() params, @Res() res: Response) {
    const school = await this.schoolService.getSchool(params.cnpj);
    return school
      ? res.status(HttpStatus.OK).json(school)
      : res.status(HttpStatus.NOT_FOUND).json();
  }

  @Roles(Role.Sudo)
  @Delete(':cnpj')
  @ApiParam({ name: 'cnpj' })
  async deleteSchool(@Param() params, @Res() res: Response) {
    const deleted = await this.schoolService.deleteSchool(params.cnpj);
    return deleted
      ? res.status(HttpStatus.NO_CONTENT).json()
      : res.status(HttpStatus.NOT_FOUND).json();
  }
}
