import { Entity, Column, DeleteDateColumn } from 'typeorm';
import { BaseOrmEntity } from '../../core/base-ddd/infrastructure-base/base.orm-entity';

@Entity('books')
export class BookOrmEntity extends BaseOrmEntity {
  @Column({ unique: true }) title: string;
  @Column() author: string;
  @Column('decimal', { precision: 10, scale: 2 }) price: number;
  @Column() year: number;
  @DeleteDateColumn() deletedAt: Date | null;
}