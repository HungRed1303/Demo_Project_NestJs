import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';

@Entity('refresh_tokens')
export class RefreshToken {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  token: string;          // lưu hash của token

  @Column()
  userId: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;

  @Column()
  expiresAt: Date;        // hết hạn lúc nào

  @Column({ default: false })
  isRevoked: boolean;     // đã bị thu hồi chưa

  @CreateDateColumn()
  createdAt: Date;
}