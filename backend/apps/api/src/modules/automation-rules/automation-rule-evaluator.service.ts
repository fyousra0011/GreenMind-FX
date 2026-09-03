import { Injectable, Logger } from '@nestjs/common';
import { MqttConnectionService } from '../../common/retry/mqtt-connection.service';

export type AutomationRule = {
  id: string;
  tenantId: string;
  siteId: string;
  name: string;
  enabled: boolean;
  trigger: string;
  action: string;
};

export type TelemetryReading = {
  tenantId: string;
  siteId: string;
  deviceId: string;
  timestamp: string;
  temperature?: number;
  humidity?: number;
  soilMoisture?: number;
  ph?: number;
};

@Injectable()
export class AutomationRuleEvaluatorService {
  private readonly logger = new Logger(AutomationRuleEvaluatorService.name);

  constructor(
    private readonly mqttConnectionService: MqttConnectionService,
  ) {}

  async evaluate(reading: TelemetryReading, rule: AutomationRule): Promise<boolean> {
    if (!rule.enabled) {
      return false;
    }

    const shouldTrigger = this.matches(reading, rule.trigger);
    if (!shouldTrigger) {
      return false;
    }

    await this.mqttConnectionService.publish(
      `tenants/${reading.tenantId}/sites/${reading.siteId}/devices/${reading.deviceId}/automation`,
      {
        ruleId: rule.id,
        ruleName: rule.name,
        action: rule.action,
        sourceTelemetry: reading,
        triggeredAt: new Date().toISOString(),
      },
    );

    this.logger.log(`Triggered rule ${rule.id} for reading ${reading.timestamp}`);
    return true;
  }

  private matches(reading: TelemetryReading, trigger: string): boolean {
    const normalized = trigger.replace(/\s+/g, ' ').trim();

    if (trigger === 'always') {
      return true;
    }

    if (normalized.includes('soil_moisture <')) {
      const rawValue = normalized.split('<')[1]?.trim();
      const value = Number(rawValue);

      if (!rawValue || Number.isNaN(value)) {
        this.logger.warn(
          `Malformed automation trigger for soil moisture: "${trigger}". This rule is unsupported and will not fire.`,
        );
        return false;
      }

      return Number(reading.soilMoisture ?? Number.NaN) < value;
    }

    if (normalized.includes('temperature >')) {
      const rawValue = normalized.split('>')[1]?.trim();
      const value = Number(rawValue);

      if (!rawValue || Number.isNaN(value)) {
        this.logger.warn(
          `Malformed automation trigger for temperature: "${trigger}". This rule is unsupported and will not fire.`,
        );
        return false;
      }

      return Number(reading.temperature ?? Number.NaN) > value;
    }

    this.logger.warn(
      `Unsupported automation trigger pattern: "${trigger}". Supported patterns: "always", "soil_moisture < N", "temperature > N".`,
    );
    return false;
  }
}
