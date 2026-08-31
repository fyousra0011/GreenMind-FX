import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateSites1710000000100 implements MigrationInterface {
  name = 'CreateSites1710000000100';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS sites (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        tenant_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL DEFAULT 'active',
        location VARCHAR(255),
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        CONSTRAINT fk_sites_tenant
          FOREIGN KEY (tenant_id)
          REFERENCES tenants(id)
          ON DELETE CASCADE
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_sites_tenant_id ON sites (tenant_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS sites;`);
  }
}
