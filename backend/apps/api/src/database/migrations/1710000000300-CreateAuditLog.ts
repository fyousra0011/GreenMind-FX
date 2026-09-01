import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAuditLog1710000000300 implements MigrationInterface {
  name = 'CreateAuditLog1710000000300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS audit_log (
        id BIGSERIAL PRIMARY KEY,
        actor VARCHAR(255) NOT NULL,
        action VARCHAR(50) NOT NULL,
        method VARCHAR(10) NOT NULL,
        resource TEXT NOT NULL,
        tenant_id VARCHAR(255),
        request_id VARCHAR(255) NOT NULL,
        payload JSONB,
        previous_hash VARCHAR(128) NOT NULL,
        hash VARCHAR(128) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_tenant_id
      ON audit_log (tenant_id, created_at DESC);
    `);

    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS idx_audit_log_request_id
      ON audit_log (request_id);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE IF EXISTS audit_log;`);
  }
}
