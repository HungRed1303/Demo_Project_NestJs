import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { IBookRepository } from './book.repository.interface';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class BookRepository
  extends BaseRepository<Book>
  implements IBookRepository
{
  constructor(
    @InjectRepository(Book)
    repo: Repository<Book>,
  ) {
    super(repo);  // truyền repo lên BaseRepository
  }

  async create(dto: Partial<Book>): Promise<Book> {
    const book = this.repo.create(dto);
    return this.repo.save(book);
  }
}