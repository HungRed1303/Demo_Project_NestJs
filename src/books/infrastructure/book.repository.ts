import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BasePersistenceRepository } from '../../core/base-ddd/infrastructure-base/base.impl.repo';
import { TypeOrmAdapter } from '../../core/base-ddd/infrastructure-base/typeorm.adapter';
import { Book } from '../domain/book.entity';
import { BookOrmEntity } from './book.orm-entity';
import { BookMapper } from './book.mapper';

@Injectable()
export class BookRepository extends BasePersistenceRepository<Book, BookOrmEntity, number> {
  constructor(
    @InjectRepository(BookOrmEntity)
    repo: Repository<BookOrmEntity>,
  ) {
    // Đổi sang Prisma: new PrismaAdapter(prisma.book) — không sửa gì khác
    super(new TypeOrmAdapter(repo), new BookMapper());
  }

  async findAll(): Promise<Book[]> {
    const records = await this.dbModel.findAll!();
    return records.map((r) => this.mapper.toDomain(r));
  }

  async softDelete(id: number): Promise<void> {
    await this.dbModel.softDelete!(id);
  }
}