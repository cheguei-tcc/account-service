import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export type GenericUserDto = {
  name: string;
  cpf: string;
};

export enum UserRole {
  Admin = 'admin',
  Monitor = 'monitor',
  Student = 'student',
  Parent = 'parent',
}

export class PostUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty({
    enum: UserRole,
    description: 'role to be assigned to the user',
  })
  @IsEnum(UserRole)
  role: string;

  @ApiProperty({ description: 'CNPJ school this user is related to' })
  @IsString()
  @IsNotEmpty()
  relatedSchoolCNPJ: string;

  @ApiPropertyOptional({ description: 'surrogate key of the parent user' })
  @IsString()
  @IsOptional()
  relatedParentCPF?: string;
}
