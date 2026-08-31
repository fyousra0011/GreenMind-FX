import { Injectable } from '@nestjs/common';

@Injectable()
export class TelemetryService {
  async listBySite(tenantId: string, siteId: string) {
    return [
      {
        tenantId,
        siteId,
        deviceId: 'device-1',
        timestamp: new Date().toISOString(),
        temperature: 24.3,
        humidity: 72.1,
        soilMoisture: 63.4,
        ph: 6.4,
      },
      {
        tenantId,
        siteId,
        deviceId: 'device-2',
        timestamp: new Date(Date.now() - 60000).toISOString(),
        temperature: 23.8,
        humidity: 71.5,
        soilMoisture: 66.1,
        ph: 6.3,
      },
    ];
  }

  async getLatest(tenantId: string, siteId: string, deviceId: string) {
    return {
      tenantId,
      siteId,
      deviceId,
      timestamp: new Date().toISOString(),
      temperature: 24.3,
      humidity: 72.1,
      soilMoisture: 63.4,
      ph: 6.4,
    };
  }
}
