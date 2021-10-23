import { SetMetadata } from '@nestjs/common';

export enum Role {
  Sudo = 'super',
  Admin = 'admin',
  Monitor = 'monitor',
  Student = 'student',
  Parent = 'parent',
}

export const ROLES_KEY = 'roles';

export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
