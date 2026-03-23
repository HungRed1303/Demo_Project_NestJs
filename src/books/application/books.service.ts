import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Book } from '../domain/book.entity';
import type { IBookRepository } from '../domain/book.repository.interface';
import { BOOK_REPOSITORY } from '../domain/book.repository.interface';
import { CreateBookDto } from '../presentation/dto/create-book.dto';
import { UpdateBookDto } from '../presentation/dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepo: IBookRepository,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async findAll() {
    const cached = await this.cacheManager.get('books:all');
    if (cached) return cached;
    const books = await this.bookRepo.findAll();
    await this.cacheManager.set('books:all', books, 60000);
    return books;
  }

  async findOne(id: number) {
    const cacheKey = `books:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;
    const book = await this.bookRepo.findById(id);
    if (!book) throw new NotFoundException(`Không tìm thấy sách #${id}`);
    await this.cacheManager.set(cacheKey, book, 60000);
    return book;
  }

  async create(dto: CreateBookDto) {
    const newBook = new Book(dto);
    const savedBook = await this.bookRepo.save(newBook);
    await this.cacheManager.del('books:all');
    return savedBook;
  }

  async update(id: number, dto: UpdateBookDto) {
    const book = await this.bookRepo.findById(id);
    if (!book) throw new NotFoundException(`Không tìm thấy sách #${id}`);
    book.updateInfo(dto);
    const updated = await this.bookRepo.save(book);
    await this.cacheManager.del(`books:${id}`);
    await this.cacheManager.del('books:all');
    return updated;
  }

  async remove(id: number) {
    const book = await this.bookRepo.findById(id);
    if (!book) throw new NotFoundException(`Không tìm thấy sách #${id}`);
    book.markAsDeleted();
    await this.bookRepo.softDelete(book);
    await this.cacheManager.del(`books:${id}`);
    await this.cacheManager.del('books:all');
    return { message: `Đã xóa sách #${id}` };
  }
}