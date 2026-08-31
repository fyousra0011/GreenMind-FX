import { Controller, Get, Param, Req } from '@nestjs/common';
import { SitesService } from './sites.service';

@Controller('tenants/:tenantId/sites')
export class SitesController {
  constructor(private readonly sitesService: SitesService) {}

  @Get()
  findByTenant(@Param('tenantId') tenantId: string) {
    return this.sitesService.findByTenant(tenantId);
  }

  @Get(':siteId')
  findOne(@Param('tenantId') tenantId: string, @Param('siteId') siteId: string) {
    return this.sitesService.findOne(tenantId, siteId);
  }
}
