import { Controller, Get, Param } from '@nestjs/common';
import { AutomationRulesService } from './automation-rules.service';

@Controller('tenants/:tenantId/sites/:siteId/automation-rules')
export class AutomationRulesController {
  constructor(private readonly automationRulesService: AutomationRulesService) {}

  @Get()
  findBySite(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.automationRulesService.findBySite(tenantId, siteId);
  }

  @Get(':ruleId')
  findOne(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
    @Param('ruleId') ruleId: string,
  ) {
    return this.automationRulesService.findOne(tenantId, siteId, ruleId);
  }
}
