import { IMapper } from '../../core/base-ddd/infrastructure-base/base.mapper';
import { Book } from '../domain/book.entity';
import { BookOrmEntity } from './book.orm-entity';

export class BookMapper implements IMapper<Book, BookOrmEntity> {
  toDomain(raw: BookOrmEntity): Book {
    return new Book({
      id: raw.id,
      title: raw.title,
      author: raw.author,
      price: typeof raw.price === 'string' ? parseFloat(raw.price) : raw.price,
      year: raw.year,
      deletedAt: raw.deletedAt,
      createdAt: raw.createdAt,
    });
  }

  toPersistence(domain: Book): BookOrmEntity {
    const orm = new BookOrmEntity();
    if (domain.id) orm.id = domain.id;
    orm.title = domain.title;
    orm.author = domain.author;
    orm.price = domain.price;
    orm.year = domain.year;
    orm.deletedAt = domain.deletedAt;
    return orm;
  }
}