import { Controller, Get, Param } from '@nestjs/common';
import { DevicesService } from './devices.service';

@Controller('tenants/:tenantId/sites/:siteId/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Get()
  findBySite(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.devicesService.findBySite(tenantId, siteId);
  }

  @Get(':deviceId')
  findOne(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
    @Param('deviceId') deviceId: string,
  ) {
    return this.devicesService.findOne(tenantId, siteId, deviceId);
  }
}
