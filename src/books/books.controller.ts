import { Controller, Get, Post, Body, Patch, Delete, Put , Param} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards, Request } from '@nestjs/common';
import {Role} from '../auth/enums/role.enum';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

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
    findOne(@Param('id') id: number) {
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
    update(@Param('id') id: number, @Body() dto: Partial<CreateBookDto>) {
        return this.booksService.update(id, dto);
    }

    @ApiOperation({ summary: 'Xóa một cuốn sách' })
    @ApiResponse({ status: 200, description: 'Cuốn sách đã được xóa.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sách.' })
    @UseGuards(JwtAuthGuard, RolesGuard)  // Chỉ người dùng đã đăng nhập và có vai trò admin mới được xóa sách
    @Roles(Role.ADMIN)  // Chỉ người dùng có vai trò admin mới được xóa sách
    @Delete(':id')
    remove(@Param('id') id: number) {
        return this.booksService.remove(id);
    }

}
