import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './presentation/books.controller';
import { BooksService } from './application/books.service';
import { BookOrmEntity } from './infrastructure/book.orm-entity';
import { BookRepository } from './infrastructure/book.repository';
import { BOOK_REPOSITORY } from './domain/book.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([BookOrmEntity])],
  controllers: [BooksController],
  providers: [
    BooksService,
    { provide: BOOK_REPOSITORY, useClass: BookRepository },
  ],
})
export class BooksModule {}