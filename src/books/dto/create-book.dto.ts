import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code' })
  title: string;

  @ApiProperty({ example: 'Robert Martin' })
  author: string;

  @ApiProperty({ example: 45.99 })
  price: number;

  @ApiProperty({ example: 2008 })
  year: number;
}