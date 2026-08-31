import { Controller, Get, Param } from '@nestjs/common';
import { TelemetryService } from './telemetry.service';

@Controller('tenants/:tenantId/sites/:siteId/telemetry')
export class TelemetryController {
  constructor(private readonly telemetryService: TelemetryService) {}

  @Get()
  listBySite(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.telemetryService.listBySite(tenantId, siteId);
  }

  @Get('devices/:deviceId/latest')
  getLatest(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
    @Param('deviceId') deviceId: string,
  ) {
    return this.telemetryService.getLatest(tenantId, siteId, deviceId);
  }
}
