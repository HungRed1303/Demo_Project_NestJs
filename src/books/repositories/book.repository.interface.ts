// src/books/repositories/book.repository.interface.ts
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';

export const BOOK_REPOSITORY = 'BOOK_REPOSITORY';

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  create(dto: CreateBookDto): Promise<Book>;
  update(book: Book, dto: Partial<CreateBookDto>): Promise<Book>;
  softDelete(book: Book): Promise<void>;
}