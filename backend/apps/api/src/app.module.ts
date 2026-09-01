import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { typeOrmConfig } from './config/typeorm.config';
import { AuditLogInterceptor } from './common/audit/audit-log.interceptor';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';
import { IdempotencyMiddleware } from './common/idempotency/idempotency.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { TenantsModule } from './modules/tenants/tenants.module';
import { SitesModule } from './modules/sites/sites.module';
import { DevicesModule } from './modules/devices/devices.module';
import { TelemetryModule } from './modules/telemetry/telemetry.module';
import { AutomationRulesModule } from './modules/automation-rules/automation-rules.module';
import { BillingModule } from './modules/billing/billing.module';

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
      },
      {
        name: 'login',
        ttl: 60_000,
        limit: 5,
      },
    ]),
    TypeOrmModule.forRoot({
      ...typeOrmConfig,
      autoLoadEntities: true,
      synchronize: false,
      migrationsRun: false,
      migrations: ['apps/api/src/database/migrations/*.ts'],
    }),
    AuthModule,
    TenantsModule,
    SitesModule,
    DevicesModule,
    TelemetryModule,
    AutomationRulesModule,
    BillingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditLogInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(IdempotencyMiddleware).forRoutes('*');
  }
}
