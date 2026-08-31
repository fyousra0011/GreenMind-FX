import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class AutomationRulesService {
  private readonly rules = [
    {
      id: 'rule-1',
      tenantId: 'tenant-1',
      siteId: 'site-1',
      name: 'Moisture Check',
      enabled: true,
      trigger: 'soil_moisture < 40',
      action: 'start_irrigation',
    },
    {
      id: 'rule-2',
      tenantId: 'tenant-1',
      siteId: 'site-1',
      name: 'High Heat Protection',
      enabled: true,
      trigger: 'temperature > 30',
      action: 'start_cooling_fan',
    },
    {
      id: 'rule-3',
      tenantId: 'tenant-2',
      siteId: 'site-9',
      name: 'Other Tenant Rule',
      enabled: true,
      trigger: 'always',
      action: 'noop',
    },
  ];

  async findBySite(tenantId: string, siteId: string) {
    return this.rules.filter(
      (rule) => rule.tenantId === tenantId && rule.siteId === siteId,
    );
  }

  async findOne(tenantId: string, siteId: string, ruleId: string) {
    const rule = this.rules.find(
      (entry) =>
        entry.tenantId === tenantId &&
        entry.siteId === siteId &&
        entry.id === ruleId,
    );

    if (!rule) {
      throw new NotFoundException(
        'Automation rule not found within the current tenant and site scope',
      );
    }

    return rule;
  }
}
