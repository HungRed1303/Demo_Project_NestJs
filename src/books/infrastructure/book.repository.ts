import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BookOrmEntity } from './book.orm-entity';
import { Book } from '../domain/book.entity';
import { IBookRepository } from '../domain/book.repository.interface';
import { BookMapper } from './book.mapper';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(@InjectRepository(BookOrmEntity) private readonly repo: Repository<BookOrmEntity>) {}

  async findAll(): Promise<Book[]> {
    const ormBooks = await this.repo.find();
    return ormBooks.map(BookMapper.toDomain);
  }
  async findById(id: number): Promise<Book | null> {
    const ormBook = await this.repo.findOneBy({ id });
    return ormBook ? BookMapper.toDomain(ormBook) : null;
  }
  async save(book: Book): Promise<Book> {
    const ormEntity = BookMapper.toOrm(book);
    const saved = await this.repo.save(ormEntity);
    return BookMapper.toDomain(saved);
  }
  async softDelete(book: Book): Promise<void> {
    if (book.id) await this.repo.softDelete(book.id);
  }
}