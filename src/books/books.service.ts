// books.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from './entities/book.entity';
import { CreateBookDto } from './dto/create-book.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private bookRepo: Repository<Book>,

        @Inject(CACHE_MANAGER) 
        private cacheManager: Cache,
    ) { }

    async findAll() {
        // 1. Kiểm tra cache trước
        const cached = await this.cacheManager.get('books:all');
        if (cached) {
        console.log('Cache HIT ✓');
        return cached;
        }

        // 2. Không có cache → query DB
        console.log('Cache MISS → query DB');
        const books = await this.bookRepo.find();

        // 3. Lưu vào cache 60 giây
        await this.cacheManager.set('books:all', books, 60000);
        return books;
    }

    async findOne(id: number) {
        const cacheKey = `books:${id}`;
        const cached = await this.cacheManager.get(cacheKey);
        if (cached) {
            console.log(`Cache HIT ✓ for book #${id}`);
            return cached;
        }

        const book = await this.bookRepo.findOneBy({ id });
        if (!book) throw new NotFoundException(`Không tìm thấy sách #${id}`);

        await this.cacheManager.set(cacheKey, book, 60000);
        return book;
    }

    async create(dto: CreateBookDto) {
        const book = this.bookRepo.create(dto);
        const saved = await this.bookRepo.save(book);  // tạo object
        await this.cacheManager.del('books:all');  // xóa cache danh sách để cập nhật sau
        return saved;          // lưu vào DB
    }

    async update(id: number, dto: Partial<CreateBookDto>) {
        const book = await this.findOne(id);
        Object.assign(book, dto);
        const updated = await this.bookRepo.save(book);  // cập nhật DB
        await this.cacheManager.del(`books:${id}`);
        await this.cacheManager.del('books:all');  // xóa cache danh sách để cập nhật sau
        return updated;
    }

    async remove(id: number) {
        const book = await this.findOne(id);
        await this.bookRepo.softRemove(book);      // tự set deletedAt = now()

        await this.cacheManager.del(`books:${id}`);
        await this.cacheManager.del('books:all');  // xóa cache danh sách để cập nhật sau

        return { message: `Đã xóa sách #${id}` };
    }
}