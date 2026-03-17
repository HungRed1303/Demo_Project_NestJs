// src/books/repositories/book.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { IBookRepository } from './book.repository.interface';

@Injectable()
export class BookRepository implements IBookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly repo: Repository<Book>,
  ) {}

  findAll(): Promise<Book[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<Book | null> {
    return this.repo.findOneBy({ id });
  }

  async create(dto: CreateBookDto): Promise<Book> {
    const book = this.repo.create(dto);
    return this.repo.save(book);
  }

  async update(book: Book, dto: Partial<CreateBookDto>): Promise<Book> {
    Object.assign(book, dto);
    return this.repo.save(book);
  }

  async softDelete(book: Book): Promise<void> {
    await this.repo.softRemove(book);
  }
}