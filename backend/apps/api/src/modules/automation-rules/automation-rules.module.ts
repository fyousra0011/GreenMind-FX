import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MqttConnectionService } from '../../common/retry/mqtt-connection.service';
import { AutomationRuleEvaluatorService } from './automation-rule-evaluator.service';
import { AutomationRuleQueueConsumer } from './automation-rule-queue.consumer';
import { AutomationRulesService } from './automation-rules.service';
import { AutomationRulesController } from './automation-rules.controller';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [AutomationRulesController],
  providers: [
    AutomationRulesService,
    AutomationRuleEvaluatorService,
    AutomationRuleQueueConsumer,
    MqttConnectionService,
  ],
  exports: [AutomationRulesService, AutomationRuleEvaluatorService, AutomationRuleQueueConsumer],
})
export class AutomationRulesModule {}
