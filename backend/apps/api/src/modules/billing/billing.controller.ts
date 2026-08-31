import { Controller, Get, Param } from '@nestjs/common';
import { BillingService } from './billing.service';

@Controller('tenants/:tenantId')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('billing')
  listInvoices(@Param('tenantId') tenantId: string) {
    return this.billingService.listInvoices(tenantId);
  }

  @Get('sites/:siteId/billing')
  listBySite(
    @Param('tenantId') tenantId: string,
    @Param('siteId') siteId: string,
  ) {
    return this.billingService.listBySite(tenantId, siteId);
  }
}
