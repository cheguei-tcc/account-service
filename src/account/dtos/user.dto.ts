import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import { ClassroomDto } from './clasroom.dto';

export type ResponsibleUpsertDto = {
  responsible: {
    id: number;
    name: string;
    gender: string;
    students: {
      name: string;
      classroom: string;
      period: string;
      gender: string;
    }[];
  };
};

export type GenericUserDto = {
  id: number;
  name: string;
  cpf: string;
  email: string;
  roles: string[];
  phoneNumber?: string;
  gender?: string;
  classroom?: string;
  period?: string;
};

export enum UserRole {
  Admin = 'admin',
  Monitor = 'monitor',
  Student = 'student',
  Parent = 'parent',
}

export interface ResponsibleBySchoolDto {
  id: number;
  name: string;
  cpf: string;
  email: string;
  phoneNumber?: string;
  gender?: string;
  roles: string[];
  children: {
    name: string;
    cpf?: string;
    email?: string;
    classroom?: ClassroomDto;
    gender?: string;
  }[];
}

export interface UserInfoDto {
  id: number;
  name: string;
  cpf: string;
  email: string;
  passwordHash: string;
  phone_number?: string;
  roles: string[];
  school?: {
    id: number;
    name: string;
    cnpj: string;
    latitude?: string;
    longitude?: string;
  };
  parent?: {
    name: string;
    cpf: string;
  };
}

export interface UserLoginResponseDto {
  accessToken: string;
}

export interface createParentAndChildrenDto {
  parent: GenericUserDto;
  defaultPassword: string;
  children: {
    name: string;
    cpf: string;
    gender?: string;
    classroom: { name: string; period: string; description: string };
  }[];
}

export class PostUserDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'expected user CPF format 123.456.789-10',
  })
  cpf?: string;

  @ApiProperty()
  @IsString()
  password?: string;

  @ApiProperty({
    enum: UserRole,
    description: 'role to be assigned to the user',
  })
  @IsEnum(UserRole)
  role: string;

  gender: string;

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

//export class EditUserDto extends PickType(PostUserDto, ['name'] as const) {}

export class EditUserDto {
  @ApiProperty()
  @IsString()
  name?: string;

  @ApiProperty()
  @IsString()
  @Matches(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/, {
    message: 'expected user CPF format 123.456.789-10',
  })
  cpf?: string;
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
