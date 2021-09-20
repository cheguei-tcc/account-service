import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class SchoolDto {
  name: string;
  cnpj: string;
  createdAt: Date;
  address?: string;
  classrooms?: string[];
}

export class PostSchoolDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cnpj: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;
}
