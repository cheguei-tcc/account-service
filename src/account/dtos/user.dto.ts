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

export interface UserInfoDto {
  name: string;
  cpf: string;
  passwordHash: string;
  roles: string[];
  school?: {
    name: string;
    cnpj: string;
  };
  parent?: {
    name: string;
    cpf: string;
  };
}

export interface UserLoginResponseDto {
  accessToken: string;
}

export class PostUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'expected user CPF format 123.456.789-10',
  })
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
  @Matches(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/, {
    message: 'expected school CNPJ format: 12.456.789/1234-10',
  })
  relatedSchoolCNPJ: string;

  @ApiPropertyOptional({ description: 'surrogate key of the parent user' })
  @IsString()
  @IsOptional()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'expected parent CPF format 123.456.789-10',
  })
  relatedParentCPF?: string;
}

export class UserLoginDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  password: string;
}
