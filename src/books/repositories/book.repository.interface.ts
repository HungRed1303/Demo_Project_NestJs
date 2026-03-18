// src/books/repositories/book.repository.interface.ts
import { Book } from '../entities/book.entity';
import { CreateBookDto } from '../dto/create-book.dto';
import { IBaseRepository } from '../../common/repositories/base.repository.interface';

export const BOOK_REPOSITORY = 'BOOK_REPOSITORY';

export interface IBookRepository extends IBaseRepository<Book> {
  create(dto: CreateBookDto): Promise<Book>;
}