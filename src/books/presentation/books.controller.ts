import { Controller, Get, Post, Body, Patch, Delete, Param, UseGuards } from '@nestjs/common';
import { BooksService } from '../application/books.service';
import { CreateBookCommand } from '../application/commands/create-book.command';
import { UpdateBookCommand } from '../application/commands/update-book.command';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Role } from '../../auth/domain/enums/role.enum';
import { Roles } from '../../auth/presentation/decorators/roles.decorator';
import { RolesGuard } from '../../auth/presentation/guards/roles.guard';
import { Public } from '../../auth/presentation/decorators/public.decorator';
import { ParseIntPipe } from '@nestjs/common';
import { BookRequestMapper } from './mappers/book-request.mapper';

@ApiTags('books')
@Controller('books')
export class BooksController {
    constructor(private readonly booksService: BooksService) {}

    @ApiOperation({ summary: 'Lấy danh sách sách' })
    @ApiResponse({ status: 200, description: 'Danh sách sách đã được trả về.' })
    @Public()  // Cho phép truy cập công khai mà không cần token
    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    @ApiOperation({ summary: 'Lấy thông tin một cuốn sách' })
    @ApiResponse({ status: 200, description: 'Thông tin sách đã được trả về.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sách.' })
    @Public()  // Cho phép truy cập công khai mà không cần token
    @Get(':id')
    findOne(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.findOne(id);
    }

    @ApiOperation({ summary: 'Tạo mới một cuốn sách' })
    @ApiResponse({ status: 201, description: 'Cuốn sách đã được tạo.' })
    @ApiResponse({ status: 400, description: 'Dữ liệu không hợp lệ.' })
    @Post()
    create(@Body() dto: CreateBookDto)
    {
        const command = BookRequestMapper.toCreateCommand(dto);
        return this.booksService.create(command);
    }

    @ApiOperation({ summary: 'Cập nhật thông tin một cuốn sách' })
    @ApiResponse({ status: 200, description: 'Cuốn sách đã được cập nhật.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sách.' })
    @Patch(':id')
    update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<CreateBookDto>) {
        const command = BookRequestMapper.toUpdateCommand(dto);
        return this.booksService.update(id, command);
    }

    @ApiOperation({ summary: 'Xóa một cuốn sách' })
    @ApiResponse({ status: 200, description: 'Cuốn sách đã được xóa.' })
    @ApiResponse({ status: 404, description: 'Không tìm thấy sách.' })
    @UseGuards(RolesGuard)  // Chỉ người dùng đã đăng nhập và có vai trò admin mới được xóa sách
    @Roles(Role.ADMIN)  // Chỉ người dùng có vai trò admin mới được xóa sách
    @Delete(':id')
    remove(@Param('id', ParseIntPipe) id: number) {
        return this.booksService.remove(id);
    }

}
