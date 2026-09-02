import { Global, Module } from '@nestjs/common';
import { MqttConnectionService } from './mqtt-connection.service';
import { MqttCircuitBreaker } from './mqtt-circuit-breaker';
import { RedisConnectionService } from './redis-connection.service';
import { RedisCircuitBreaker } from './redis-circuit-breaker';

@Global()
@Module({
  providers: [
    MqttConnectionService,
    MqttCircuitBreaker,
    RedisConnectionService,
    RedisCircuitBreaker,
  ],
  exports: [
    MqttConnectionService,
    MqttCircuitBreaker,
    RedisConnectionService,
    RedisCircuitBreaker,
  ],
})
export class RetryModule {}
