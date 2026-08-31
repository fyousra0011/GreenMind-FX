import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  async validateUser(email: string, password: string) {
    return {
      userId: 'user-1',
      email,
      tenantId: 'tenant-1',
      siteId: 'site-1',
      roles: ['admin'],
      password,
    };
  }

  async getCurrentScope(request: { tenantId?: string; siteId?: string }) {
    return {
      tenantId: request.tenantId ?? 'tenant-1',
      siteId: request.siteId ?? 'site-1',
    };
  }
}
