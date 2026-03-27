import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('books')
export class BookOrmEntity {
  @PrimaryGeneratedColumn() id: number;
  @Column({ unique: true }) title: string;
  @Column() author: string;
  @Column('decimal', { precision: 10, scale: 2 }) price: number;
  @Column() year: number;
  @DeleteDateColumn() deletedAt: Date | null;
  @CreateDateColumn() createdAt: Date;
}