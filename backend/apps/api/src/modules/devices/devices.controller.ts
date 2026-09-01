import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { CreateDeviceDto } from './dto/create-device.dto';
import { DevicesService } from './devices.service';

@Controller('tenants/:tenantId/sites/:siteId/devices')
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @Post()
  create(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
    @Body() dto: CreateDeviceDto,
  ) {
    return this.devicesService.create(tenantId, siteId, dto);
  }

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
