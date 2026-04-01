import { Entity, Column } from 'typeorm';
import { Role } from '../../auth/domain/enums/role.enum';
import { BaseOrmEntity } from '../../core/base-ddd/infrastructure-base/base.orm-entity';

@Entity('users')
export class UserOrmEntity extends BaseOrmEntity {
  @Column({ unique: true }) email: string;
  @Column() password: string;
  @Column({ default: false }) isVerified: boolean;
  @Column({ type: 'enum', enum: Role, default: Role.USER }) role: Role;
  @Column({ type: 'varchar', nullable: true }) refreshToken: string | null;
  @Column({ type: 'timestamp', nullable: true }) refreshTokenExpiresAt: Date | null;
}