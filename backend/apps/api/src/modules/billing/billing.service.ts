import { Injectable } from '@nestjs/common';

@Injectable()
export class BillingService {
  async listInvoices(tenantId: string) {
    return [
      {
        id: 'inv-1001',
        tenantId,
        amount: 299.0,
        status: 'paid',
        currency: 'MYR',
      },
      {
        id: 'inv-1002',
        tenantId,
        amount: 149.0,
        status: 'pending',
        currency: 'MYR',
      },
    ];
  }

  async listBySite(tenantId: string, siteId: string) {
    return this.listInvoices(tenantId).map((invoice) => ({
      ...invoice,
      siteId,
    }));
  }
}
