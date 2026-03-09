import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from 'typeorm';

@Entity('books')   // tên bảng trong PostgreSQL
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  title: string;

  @Column()
  author: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column()
  year: number;

  @DeleteDateColumn()
  deletedAt: Date | null;   // để soft delete

  @CreateDateColumn()
  createdAt: Date;   // tự động ghi ngày tạo
}