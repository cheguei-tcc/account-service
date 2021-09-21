import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, Matches } from 'class-validator';

export class ClassroomDto {
  name: string;
  period?: string;
  description?: string;
}

export enum ClassroomPeriod {
  Matutino = 'matutino',
  Vespertino = 'vespertino',
}

export class PostClassroomDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, {
    message: 'expected school CNPJ format: 12.456.789/1234-10',
  })
  relatedSchoolCNPJ: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiPropertyOptional({
    enum: ClassroomPeriod,
    description: 'period to be assigned to this classroom',
  })
  @IsEnum(ClassroomPeriod)
  period?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;
}
