import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import configuration from './configuration';
import { validate } from './env.validation';

const isProduction = process.env.NODE_ENV === 'production';

const envFilePath = [
  '.env.development',
  '.env.staging',
  // Production secrets should be injected by the hosting platform or a managed vault,
  // not loaded from a plaintext repo file in production.
  ...(isProduction ? [] : ['.env.production']),
  '.env',
];

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      envFilePath,
      ignoreEnvFile: isProduction,
      load: [configuration],
      validate,
    }),
  ],
})
export class ConfigModule {}
