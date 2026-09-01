import { SetMetadata } from '@nestjs/common';

export const IDEMPOTENCY_KEY_HEADER = 'idempotency-key';
export const IDEMPOTENCY_KEY = 'idempotency';

export const Idempotent = () => SetMetadata(IDEMPOTENCY_KEY, true);
