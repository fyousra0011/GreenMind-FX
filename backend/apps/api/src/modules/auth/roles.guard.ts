import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export type UserRole = 'owner' | 'admin' | 'technician' | 'viewer';

export const Roles = (...roles: UserRole[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.roles || !Array.isArray(user.roles)) {
      throw new ForbiddenException('User roles are missing');
    }

    const hasRequiredRole = requiredRoles.some((role) => user.roles.includes(role));

    if (!hasRequiredRole) {
      throw new ForbiddenException('You do not have permission to access this resource');
    }

    return true;
  }
}
