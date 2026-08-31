import { Module } from '@nestjs/common';
import { AutomationRulesService } from './automation-rules.service';
import { AutomationRulesController } from './automation-rules.controller';

@Module({
  controllers: [AutomationRulesController],
  providers: [AutomationRulesService],
  exports: [AutomationRulesService],
})
export class AutomationRulesModule {}
