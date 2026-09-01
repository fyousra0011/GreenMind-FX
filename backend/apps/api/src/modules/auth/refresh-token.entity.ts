import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'varchar', length: 255 })
  userId!: string;

  @Column({ type: 'text' })
  tokenHash!: string;

  @Column({ type: 'timestamp', nullable: true })
  revokedAt!: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;
}
