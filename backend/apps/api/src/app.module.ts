import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from './config/config.module';
import { typeOrmConfig } from './config/typeorm.config';
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
})
export class AppModule {}
