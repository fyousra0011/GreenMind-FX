import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TENANT_SCOPE_KEY } from './tenant-scope.decorator';

@Injectable()
export class TenantGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<boolean>(TENANT_SCOPE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!required) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const tenantId = request.params?.tenantId;
    const siteId = request.params?.siteId;

    if (!tenantId || !siteId) {
      throw new ForbiddenException('Tenant and site scope are required');
    }

    return true;
  }
}
