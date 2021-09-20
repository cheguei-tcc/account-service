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
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, {
    message: 'expected school CNPJ format: 12.456.789/1234-10',
  })
  cnpj: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  address?: string;
}
