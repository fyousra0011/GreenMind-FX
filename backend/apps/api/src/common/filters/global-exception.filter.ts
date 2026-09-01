import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { randomUUID } from 'crypto';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly isProduction = process.env.NODE_ENV === 'production';

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const requestId =
      request.headers['x-request-id'] ?? request.id ?? randomUUID();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const errorMessage =
      exception instanceof HttpException
        ? this.extractMessage(exception)
        : 'Internal server error';

    const body: Record<string, unknown> = {
      statusCode: status,
      error:
        HttpStatus[status] ?? 'Internal Server Error',
      message: this.isProduction
        ? 'An unexpected error occurred.'
        : errorMessage,
      requestId,
      timestamp: new Date().toISOString(),
    };

    if (!this.isProduction && exception instanceof Error) {
      body.details = exception.stack?.split('\n').slice(0, 5) ?? [];
    }

    console.error(
      `[${requestId}] ${request.method} ${request.originalUrl}`,
      exception,
    );

    response.status(status).json(body);
  }

  private extractMessage(exception: HttpException): string {
    const response = exception.getResponse();

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response !== null) {
      const message = (response as { message?: unknown }).message;

      if (Array.isArray(message)) {
        return message.join(', ');
      }

      if (typeof message === 'string') {
        return message;
      }
    }

    return 'Request failed';
  }
}
