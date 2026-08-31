export interface TenantContext {
  tenantId: string;
  siteId: string;
  userId: string;
}

export class TenantScope {
  static fromRequest(request: Partial<TenantContext>): TenantContext {
    return {
      tenantId: request.tenantId ?? 'tenant-1',
      siteId: request.siteId ?? 'site-1',
      userId: request.userId ?? 'user-1',
    };
  }
}
