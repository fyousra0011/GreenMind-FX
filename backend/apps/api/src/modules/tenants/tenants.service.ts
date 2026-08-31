import { Injectable } from '@nestjs/common';

@Injectable()
export class TenantsService {
  async findAll() {
    return [
      { id: 'tenant-1', name: 'GreenMind Demo Tenant', status: 'active' },
    ];
  }

  async findOne(tenantId: string) {
    return {
      id: tenantId,
      name: 'GreenMind Demo Tenant',
      status: 'active',
    };
  }
}
