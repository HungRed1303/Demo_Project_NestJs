import { Book } from './book.entity';
export const BOOK_REPOSITORY = Symbol('BOOK_REPOSITORY');

export interface IBookRepository {
  findAll(): Promise<Book[]>;
  findById(id: number): Promise<Book | null>;
  save(book: Book): Promise<Book>;
  softDelete(book: Book): Promise<void>;
}