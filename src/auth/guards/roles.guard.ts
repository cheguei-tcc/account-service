import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role, ROLES_KEY } from '../roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const cnpjQueryParam = request.query?.cnpj;
    if (
      !user.roles.includes('super') &&
      cnpjQueryParam &&
      user.school.cnpj !== cnpjQueryParam
    ) {
      return false;
    }

    return requiredRoles.some((role) => user.roles?.includes(role));
  }
}
