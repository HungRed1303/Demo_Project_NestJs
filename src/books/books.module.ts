import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BooksController } from './presentation/books.controller';
import { BooksService } from './application/books.service';
import { BookOrmEntity } from './infrastructure/book.orm-entity';
import { BookRepository } from './infrastructure/book.repository';
import { BOOK_REPOSITORY } from './domain/book.repository.interface';
import { CreateBookHandler } from './application/commands/create-book.handler';
import { UpdateBookHandler } from './application/commands/update-book.handler';
import { TypedCommandBus } from '../core/base-ddd/application-base/typed-command-bus';

const CommandHandlers = [CreateBookHandler, UpdateBookHandler];

@Module({
  imports: [
    CqrsModule,  // cung cấp CommandBus, QueryBus
    TypeOrmModule.forFeature([BookOrmEntity]),
  ],
  controllers: [BooksController],
  providers: [
    BooksService,
    TypedCommandBus,  // wrapper có type safety
    { provide: BOOK_REPOSITORY, useClass: BookRepository },
    ...CommandHandlers,
  ],
})
export class BooksModule {}