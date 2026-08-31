import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class DevicesService {
  private readonly devices = [
    {
      id: 'device-1',
      tenantId: 'tenant-1',
      siteId: 'site-1',
      name: 'ESP32 Controller A',
      type: 'controller',
      status: 'online',
      battery: 96,
    },
    {
      id: 'device-2',
      tenantId: 'tenant-1',
      siteId: 'site-1',
      name: 'Temp Sensor Row 1',
      type: 'sensor',
      status: 'online',
      battery: 88,
    },
    {
      id: 'device-3',
      tenantId: 'tenant-2',
      siteId: 'site-9',
      name: 'Other Tenant Device',
      type: 'sensor',
      status: 'offline',
      battery: 0,
    },
  ];

  async findBySite(tenantId: string, siteId: string) {
    return this.devices.filter(
      (device) => device.tenantId === tenantId && device.siteId === siteId,
    );
  }

  async findOne(tenantId: string, siteId: string, deviceId: string) {
    const device = this.devices.find(
      (entry) =>
        entry.tenantId === tenantId &&
        entry.siteId === siteId &&
        entry.id === deviceId,
    );

    if (!device) {
      throw new NotFoundException(
        'Device not found within the current tenant and site scope',
      );
    }

    return device;
  }
}
