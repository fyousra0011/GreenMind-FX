import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class SitesService {
  private readonly sites = [
    {
      id: 'site-1',
      tenantId: 'tenant-1',
      name: 'Rooftop Lab',
      status: 'active',
      region: 'Kuala Lumpur',
    },
    {
      id: 'site-2',
      tenantId: 'tenant-1',
      name: 'Indoor Nursery',
      status: 'active',
      region: 'Selangor',
    },
  ];

  async findByTenant(tenantId: string) {
    return this.sites.filter((site) => site.tenantId === tenantId);
  }

  async findOne(tenantId: string, siteId: string) {
    const site = this.sites.find(
      (entry) => entry.tenantId === tenantId && entry.id === siteId,
    );

    if (!site) {
      throw new NotFoundException('Site not found in current tenant scope');
    }

    return site;
  }
}
