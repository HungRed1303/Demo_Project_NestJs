// src/books/books.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { Book } from './entities/book.entity';
import { BookRepository } from './repositories/book.repository';
import { BOOK_REPOSITORY } from './repositories/book.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([Book])],
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: BOOK_REPOSITORY,
      useClass: BookRepository,  // ← đổi ORM sau này chỉ cần đổi dòng này
    },
  ],
})
export class BooksModule {}