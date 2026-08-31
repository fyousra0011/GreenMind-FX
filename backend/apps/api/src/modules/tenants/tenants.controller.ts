import { Controller, Get, Param } from '@nestjs/common';
import { TenantsService } from './tenants.service';

@Controller('tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Get()
  findAll() {
    return this.tenantsService.findAll();
  }

  @Get(':tenantId')
  findOne(@Param('tenantId') tenantId: string) {
    return this.tenantsService.findOne(tenantId);
  }
}
