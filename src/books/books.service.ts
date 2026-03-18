import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { CreateBookDto } from './dto/create-book.dto';
import type { IBookRepository } from './repositories/book.repository.interface';
import { BOOK_REPOSITORY } from './repositories/book.repository.interface';

@Injectable()
export class BooksService {
  constructor(
    @Inject(BOOK_REPOSITORY)
    private readonly bookRepo: IBookRepository,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}

  async findAll() {
    const cached = await this.cacheManager.get('books:all');
    if (cached) return cached;

    const books = await this.bookRepo.findAll();  // từ Base
    await this.cacheManager.set('books:all', books, 60000);
    return books;
  }

  async findOne(id: number) {
    const cacheKey = `books:${id}`;
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) return cached;

    const book = await this.bookRepo.findById(id);  // từ Base
    if (!book) throw new NotFoundException(`Không tìm thấy sách #${id}`);

    await this.cacheManager.set(cacheKey, book, 60000);
    return book;
  }

  async create(dto: CreateBookDto) {
    const book = await this.bookRepo.create(dto);  // đặc thù
    await this.cacheManager.del('books:all');
    return book;
  }

  async update(id: number, dto: Partial<CreateBookDto>) {
    const book = await this.bookRepo.findById(id);  // từ Base
    if (!book) throw new NotFoundException(`Không tìm thấy sách #${id}`);

    const updated = await this.bookRepo.save({ ...book, ...dto });  // từ Base
    await this.cacheManager.del(`books:${id}`);
    await this.cacheManager.del('books:all');
    return updated;
  }

  async remove(id: number) {
    const book = await this.bookRepo.findById(id);  // từ Base
    if (!book) throw new NotFoundException(`Không tìm thấy sách #${id}`);

    await this.bookRepo.softDelete(book);  // từ Base
    await this.cacheManager.del(`books:${id}`);
    await this.cacheManager.del('books:all');
    return { message: `Đã xóa sách #${id}` };
  }
}