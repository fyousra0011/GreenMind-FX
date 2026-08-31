import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const typeOrmConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'change-me',
  database: process.env.DB_NAME || 'greenmind_dev',
  schema: 'public',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
  entities: ['apps/api/src/**/*.entity.ts'],
  migrations: ['apps/api/src/database/migrations/*.ts'],
  synchronize: false,
  migrationsRun: false,
  logging: process.env.NODE_ENV !== 'production',
};
