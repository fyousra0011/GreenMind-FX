import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
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
