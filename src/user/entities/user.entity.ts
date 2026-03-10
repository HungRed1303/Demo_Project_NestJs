import { Role } from 'src/auth/enums/role.enum';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.USER })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;
}