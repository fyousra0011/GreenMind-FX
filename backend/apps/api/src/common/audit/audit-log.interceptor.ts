import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { createHash } from 'crypto';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuditLogInterceptor implements NestInterceptor {
  constructor(private readonly dataSource: DataSource) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    if (!['POST', 'PATCH', 'DELETE'].includes(method)) {
      return next.handle();
    }

    const tenantId =
      request.params?.tenantId ??
      request.headers['x-tenant-id'] ??
      request.user?.tenantId ??
      null;

    const actor =
      request.user?.email ??
      request.headers['x-user-email'] ??
      'anonymous';

    const resource = request.originalUrl || request.url || 'unknown';
    const action = method.toLowerCase();
    const requestId =
      request.headers['x-request-id'] ??
      request.id ??
      `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const payload = {
      body: request.body,
      params: request.params,
      query: request.query,
    };

    return next.handle().pipe(
      tap(async () => {
        await this.persistAuditEntry({
          tenantId,
          actor,
          action,
          method,
          resource,
          requestId,
          payload,
        });
      }),
    );
  }

  private async persistAuditEntry(entry: {
    tenantId: string | null;
    actor: string;
    action: string;
    method: string;
    resource: string;
    requestId: string;
    payload: Record<string, unknown>;
  }) {
    const previousRow = await this.dataSource.query(
      `SELECT hash FROM audit_log ORDER BY created_at DESC LIMIT 1;`,
    );
    const previousHash = previousRow?.[0]?.hash ?? 'genesis';
    const payloadString = JSON.stringify({
      tenantId: entry.tenantId,
      actor: entry.actor,
      action: entry.action,
      method: entry.method,
      resource: entry.resource,
      requestId: entry.requestId,
      payload: entry.payload,
      timestamp: new Date().toISOString(),
    });
    const hash = createHash('sha256')
      .update(`${previousHash}:${payloadString}`)
      .digest('hex');

    await this.dataSource.query(
      `INSERT INTO audit_log (actor, action, method, resource, tenant_id, request_id, payload, previous_hash, hash, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW());`,
      [
        entry.actor,
        entry.action,
        entry.method,
        entry.resource,
        entry.tenantId,
        entry.requestId,
        JSON.stringify(entry.payload),
        previousHash,
        hash,
      ],
    );
  }
}
