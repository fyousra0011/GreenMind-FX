import { plainToInstance } from 'class-transformer';
import {
  IsBoolean,
  IsEnum,
  IsNumber,
  IsString,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum Environment {
  Development = 'development',
  Staging = 'staging',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsNumber()
  @Min(1)
  @Max(65535)
  PORT: number;

  @IsString()
  APP_NAME: string;

  @IsString()
  APP_URL: string;

  @IsString()
  DB_HOST: string;

  @IsNumber()
  DB_PORT: number;

  @IsString()
  DB_NAME: string;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsBoolean()
  DB_SSL: boolean;

  @IsString()
  REDIS_HOST: string;

  @IsNumber()
  REDIS_PORT: number;

  @IsString()
  REDIS_PASSWORD: string;

  @IsNumber()
  REDIS_DB: number;

  @IsString()
  MQTT_BROKER_HOST: string;

  @IsNumber()
  MQTT_BROKER_PORT: number;

  @IsString()
  MQTT_BROKER_USERNAME: string;

  @IsString()
  MQTT_BROKER_PASSWORD: string;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  JWT_REFRESH_SECRET: string;

  @IsString()
  STRIPE_SECRET_KEY: string;

  @IsString()
  STRIPE_WEBHOOK_SECRET: string;

  @IsString()
  STRIPE_PUBLISHABLE_KEY: string;
}

export function validate(config: Record<string, unknown>) {
  const nodeEnv = String(config.NODE_ENV ?? '').trim().toLowerCase();

  if (!['development', 'staging', 'production'].includes(nodeEnv)) {
    throw new Error(
      'NODE_ENV must be explicitly set to one of: development, staging, production',
    );
  }

  if (nodeEnv === 'production' && config.DB_SSL !== true) {
    throw new Error('DB_SSL must be explicitly set to true in production');
  }

  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(
      `Environment validation failed: ${errors
        .map((error) => Object.values(error.constraints ?? {}).join(', '))
        .join('; ')}`,
    );
  }

  return validatedConfig;
}
