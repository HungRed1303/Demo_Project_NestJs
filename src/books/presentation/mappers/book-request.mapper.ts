import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookCommand } from '../../application/commands/create-book.command';
import { UpdateBookCommand } from '../../application/commands/update-book.command';

export class BookRequestMapper {
  static toCreateCommand(dto: CreateBookDto): CreateBookCommand {
    return new CreateBookCommand({
      title: dto.title.trim(),
      author: dto.author.trim(),
      price: dto.price,
      year: dto.year,
    });
  }

  static toUpdateCommand(id: number, dto: UpdateBookDto): UpdateBookCommand {
    return new UpdateBookCommand(id, {
      title: dto.title?.trim(),
      author: dto.author?.trim(),
      price: dto.price,
      year: dto.year,
    });
  }
}