import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, RedisClientType } from 'redis';
import {
  AutomationRuleEvaluatorService,
  AutomationRule,
  TelemetryReading,
} from './automation-rule-evaluator.service';

@Injectable()
export class AutomationRuleQueueConsumer implements OnModuleInit {
  private readonly logger = new Logger(AutomationRuleQueueConsumer.name);
  private readonly queueKey = 'automation:rules:queue';
  private readonly deadLetterKey = 'automation:rules:dlq';
  private readonly dedupeTtlSeconds = 60 * 60 * 24;
  private readonly maxAttempts = 3;
  private redisClient!: RedisClientType;

  constructor(
    private readonly evaluatorService: AutomationRuleEvaluatorService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const host = this.configService.get<string>('redis.host', 'localhost');
    const port = this.configService.get<number>('redis.port', 6379);
    const password = this.configService.get<string>('redis.password', '');
    const db = this.configService.get<number>('redis.db', 0);

    this.redisClient = createClient({
      url: `redis://${password ? `:${password}@` : ''}${host}:${port}/${db}`,
    });

    this.redisClient.on('error', (error) => {
      this.logger.error(`Redis queue consumer error: ${String(error)}`);
    });

    await this.redisClient.connect();
    this.startWorker();
  }

  async enqueue(reading: TelemetryReading, rule: AutomationRule): Promise<void> {
    const dedupeKey = `automation:rule:dedupe:${reading.tenantId}:${reading.siteId}:${reading.deviceId}:${reading.timestamp}:${rule.id}`;
    const dedupeSet = await this.redisClient.set(dedupeKey, '1', {
      EX: this.dedupeTtlSeconds,
      NX: true,
    });

    if (!dedupeSet) {
      return;
    }

    await this.redisClient.rPush(this.queueKey, JSON.stringify({
      reading,
      rule,
      attempts: 1,
    }));
  }

  private startWorker() {
    void this.consumeLoop();
  }

  private async consumeLoop(): Promise<void> {
    while (true) {
      let result: Awaited<ReturnType<typeof this.redisClient.blPop>>;

      try {
        result = await this.redisClient.blPop(this.queueKey, 5);
      } catch (error) {
        this.logger.error(
          `Redis outage while waiting for automation jobs: ${String(error)}`,
          error instanceof Error ? error.stack : undefined,
        );
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      if (!result || !result.element) {
        continue;
      }

      const payload = JSON.parse(result.element) as {
        reading: TelemetryReading;
        rule: AutomationRule;
        attempts?: number;
      };

      try {
        await this.evaluatorService.evaluate(payload.reading, payload.rule);
      } catch (error) {
        const attempts = (payload.attempts ?? 1) + 1;
        const failedPayload = {
          ...payload,
          attempts,
        };

        this.logger.error(
          `Automation worker failed while evaluating a rule for device ${payload.reading.deviceId}. ` +
            `Attempt ${attempts} of ${this.maxAttempts}. ` +
            `${String(error)}`,
          error instanceof Error ? error.stack : undefined,
        );

        if (attempts < this.maxAttempts) {
          await this.redisClient.lPush(this.queueKey, JSON.stringify(failedPayload));
          this.logger.warn(
            `Requeued automation rule for device ${payload.reading.deviceId} after failed attempt ${attempts}.`,
          );
          continue;
        }

        await this.redisClient.rPush(this.deadLetterKey, JSON.stringify(failedPayload));
        this.logger.warn(
          `Automation rule for device ${payload.reading.deviceId} exceeded ${this.maxAttempts} attempts and was moved to the dead-letter queue.`,
        );
      }
    }
  }
}
