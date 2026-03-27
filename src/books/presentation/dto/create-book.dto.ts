import { IsString, IsNumber, IsPositive, IsInt, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookDto {
  @ApiProperty({ example: 'Clean Code' })
  @IsString()
  title: string;

  @ApiProperty({ example: 'Robert Martin' })
  @IsString()
  author: string;

  @ApiProperty({ example: 45.99 })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 2008 })
  @IsInt()
  @Min(1000)
  @Max(new Date().getFullYear())
  year: number;
}