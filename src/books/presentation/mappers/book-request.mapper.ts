import { CreateBookDto } from '../dto/create-book.dto';
import { UpdateBookDto } from '../dto/update-book.dto';
import { CreateBookCommand } from '../../application/commands/create-book.command';
import { UpdateBookCommand } from '../../application/commands/update-book.command';
 
export class BookRequestMapper {
  static toCreateCommand(dto: CreateBookDto): CreateBookCommand {
    const command = new CreateBookCommand();
    command.title = dto.title.trim();
    command.author = dto.author.trim();
    command.price = dto.price;
    command.year = dto.year;
    return command;
  }
 
  static toUpdateCommand(dto: UpdateBookDto): UpdateBookCommand {
    const command = new UpdateBookCommand();
    if (dto.title !== undefined) command.title = dto.title.trim();
    if (dto.author !== undefined) command.author = dto.author.trim();
    if (dto.price !== undefined) command.price = dto.price;
    if (dto.year !== undefined) command.year = dto.year;
    return command;
  }
}