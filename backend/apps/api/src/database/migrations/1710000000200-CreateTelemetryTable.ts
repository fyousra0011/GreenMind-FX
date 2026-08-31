import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTelemetryTable1710000000200 implements MigrationInterface {
  name = 'CreateTelemetryTable1710000000200';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS timescaledb;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS telemetry (
        id BIGSERIAL NOT NULL,
        tenant_id UUID NOT NULL,
        site_id UUID NOT NULL,
        device_id UUID NOT NULL,
        temperature DOUBLE PRECISION,
        humidity DOUBLE PRECISION,
        soil_moisture DOUBLE PRECISION,
        ph DOUBLE PRECISION,
        light DOUBLE PRECISION,
        co2 DOUBLE PRECISION,
        water_level DOUBLE PRECISION,
        captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        PRIMARY KEY (tenant_id, site_id, captured_at, id),
        CONSTRAINT fk_telemetry_tenant
          FOREIGN KEY (tenant_id)
          REFERENCES tenants(id)
          ON DELETE CASCADE,
        CONSTRAINT fk_telemetry_site
          FOREIGN KEY (site_id)
          REFERENCES sites(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_telemetry_tenant_id
      ON telemetry (tenant_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_telemetry_site_id
      ON telemetry (site_id);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_telemetry_tenant_site_time
      ON telemetry (tenant_id, site_id, captured_at DESC);
    `);

    await queryRunner.query(`
      SELECT create_hypertable('telemetry', 'captured_at', if_not_exists => TRUE);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      SELECT drop_hypertable('telemetry', if_exists => TRUE, cascade => TRUE);
    `);

    await queryRunner.query(`DROP TABLE IF EXISTS telemetry;`);
  }
}
