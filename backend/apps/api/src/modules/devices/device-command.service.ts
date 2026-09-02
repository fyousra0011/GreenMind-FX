import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { DataSource } from 'typeorm';
import { MqttConnectionService } from '../../common/retry/mqtt-connection.service';
import { retryWithExponentialBackoff } from '../../common/retry/retry.util';
import { DeviceCommandAction, DeviceCommandDto } from './dto/device-command.dto';

export type DeviceCommandContext = {
  tenantId: string;
  siteId: string;
  userId: string;
  email: string;
};

@Injectable()
export class DeviceCommandService {
  private readonly logger = new Logger(DeviceCommandService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly mqttConnectionService: MqttConnectionService,
  ) {}

  async publishCommand(
    dto: DeviceCommandDto,
    context: DeviceCommandContext,
  ) {
    const rows = await this.dataSource.query(
      `SELECT id, tenant_id AS "tenantId", site_id AS "siteId", name, type, status
       FROM devices
       WHERE id = $1
       LIMIT 1;`,
      [dto.deviceId],
    );
    const device = rows[0];

    if (!device) {
      throw new NotFoundException(`Device ${dto.deviceId} was not found.`);
    }

    if (device.tenantId !== context.tenantId || device.siteId !== context.siteId) {
      throw new ForbiddenException(
        'Device does not belong to the caller tenant/site scope.',
      );
    }

    const topic = `tenants/${context.tenantId}/sites/${context.siteId}/devices/${device.id}/commands`;
    const payload = {
      deviceId: device.id,
      action: dto.action,
      durationSeconds: dto.durationSeconds ?? null,
      requestedBy: context.userId,
      requestedAt: new Date().toISOString(),
    };

    try {
      await this.mqttConnectionService.publish(topic, payload);

      this.logger.log(
        `Command ${dto.action} dispatched to ${device.id} on topic ${topic} for tenant ${context.tenantId} / site ${context.siteId}`,
      );

      return {
        success: true,
        deviceId: device.id,
        topic,
        action: dto.action,
        durationSeconds: dto.durationSeconds ?? null,
        tenantId: context.tenantId,
        siteId: context.siteId,
        sentAt: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(
        `Command ${dto.action} failed for device ${device.id}: ${String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw error;
    }
  }

  async validateAction(action: DeviceCommandAction): Promise<boolean> {
    return Object.values(DeviceCommandAction).includes(action);
  }
}
