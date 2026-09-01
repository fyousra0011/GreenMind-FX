import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { createHash } from 'crypto';

@Injectable()
export class IdempotencyMiddleware implements NestMiddleware {
  private readonly idempotencyCache = new Map<string, { expiresAt: number; body: unknown }>();

  use(req: Request, res: Response, next: NextFunction) {
    const key = req.headers['idempotency-key'];
    const isMutating = ['POST', 'PATCH', 'PUT', 'DELETE'].includes(req.method);

    if (!isMutating || typeof key !== 'string' || !key.trim()) {
      return next();
    }

    const hash = createHash('sha256').update(`${req.originalUrl}:${key}`).digest('hex');
    const cached = this.idempotencyCache.get(hash);

    if (cached && cached.expiresAt > Date.now()) {
      res.status(200).json({
        idempotent: true,
        message: 'Duplicate request replayed safely.',
        replay: cached.body,
      });
      return;
    }

    this.idempotencyCache.set(hash, {
      expiresAt: Date.now() + 60_000,
      body: null,
    });

    const originalJson = res.json.bind(res);
    res.json = ((body: unknown) => {
      this.idempotencyCache.set(hash, {
        expiresAt: Date.now() + 60_000,
        body,
      });
      return originalJson(body);
    }) as typeof res.json;

    next();
  }
}
