import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { CreateBookCommand, CreateBookResult } from './create-book.command';
import { ITypedCommandHandler } from '../../../core/base-ddd/application-base/command-base/typed-command-handler.interface';
import { BOOK_REPOSITORY } from '../../domain/book.repository.interface';
import type { IBookRepository } from '../../domain/book.repository.interface';
import { Book } from '../../domain/book.entity';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@CommandHandler(CreateBookCommand)
export class CreateBookHandler
  implements ITypedCommandHandler<CreateBookCommand, CreateBookResult>
{
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepo: IBookRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: CreateBookCommand): Promise<CreateBookResult> {
    const book = new Book(command.input);
    const saved = await this.bookRepo.save(book);
    await this.cacheManager.del('books:all');

    return {
      id: saved.id!,
      title: saved.title,
      author: saved.author,
      price: saved.price,
      year: saved.year,
      createdAt: saved.createdAt,
    };
  }
}