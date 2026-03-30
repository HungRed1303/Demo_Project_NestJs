import { CommandHandler } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateBookCommand, UpdateBookResult } from './update-book.command';
import { ITypedCommandHandler } from '../../../core/base-ddd/application-base/command-base/typed-command-handler.interface';
import { BOOK_REPOSITORY } from '../../domain/book.repository.interface';
import type { IBookRepository } from '../../domain/book.repository.interface';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';

@CommandHandler(UpdateBookCommand)
export class UpdateBookHandler
  implements ITypedCommandHandler<UpdateBookCommand, UpdateBookResult>
{
  constructor(
    @Inject(BOOK_REPOSITORY) private readonly bookRepo: IBookRepository,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async execute(command: UpdateBookCommand): Promise<UpdateBookResult> {
    const book = await this.bookRepo.findById(command.id);
    if (!book) throw new NotFoundException(`Không tìm thấy sách #${command.id}`);

    book.updateInfo(command.input);
    const updated = await this.bookRepo.save(book);

    await this.cacheManager.del(`books:${command.id}`);
    await this.cacheManager.del('books:all');

    return {
      id: updated.id!,
      title: updated.title,
      author: updated.author,
      price: updated.price,
      year: updated.year,
      createdAt: updated.createdAt,
    };
  }
}