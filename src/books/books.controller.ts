import { Controller, Get, Post, Body, Patch, Delete, Put } from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards, Request } from '@nestjs/common';

@ApiTags('books')
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @ApiOperation({ summary: 'Lấy danh sách sách' })
    @ApiResponse({ status: 200, description: 'Danh sách sách đã được trả về.' })
    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @ApiOperation({ summary: 'Lấy thông tin một cuốn sách' })
    @ApiResponse({ status: 200, description: 'Thông tin sách đã được trả về.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sách.' })
    @Get(':id')
    findOne(id: number) {
        return this.booksService.findOne(id);
    }

    @ApiOperation({ summary: 'Tạo mới một cuốn sách' })
    @ApiResponse({ status: 201, description: 'Cuốn sách đã được tạo.' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
    @UseGuards(JwtAuthGuard)  // Chỉ người dùng đã đăng nhập mới được tạo sách
    @Post()
    create(@Body() dto: CreateBookDto) {
        return this.booksService.create(dto);
    }

    @ApiOperation({ summary: 'Cập nhật thông tin một cuốn sách' })
    @ApiResponse({ status: 200, description: 'Cuốn sách đã được cập nhật.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sách.' })
    @UseGuards(JwtAuthGuard)  // Chỉ người dùng đã đăng nhập mới được cập nhật sách
    @Patch(':id')
    update(id: number, @Body() dto: Partial<CreateBookDto>) {
        return this.booksService.update(id, dto);
    }

    @ApiOperation({ summary: 'Xóa một cuốn sách' })
    @ApiResponse({ status: 200, description: 'Cuốn sách đã được xóa.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sách.' })
    @UseGuards(JwtAuthGuard)  // Chỉ người dùng đã đăng nhập mới được xóa sách
    @Delete(':id')
    remove(id: number) {
        return this.booksService.remove(id);
    }

}
