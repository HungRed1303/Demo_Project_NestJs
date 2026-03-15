import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
  
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());
  const config = new DocumentBuilder()
    .setTitle('Book Management API')
    .setDescription('API quản lý sách')
    .setVersion('1.0')
    .build();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,      // tự loại bỏ field không có trong DTO
    forbidNonWhitelisted: true, // throw lỗi nếu có field lạ
    transform: true,      // tự convert type (string → number, v.v.)
  }));

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);  // truy cập tại /api
  await app.listen(3000);
}
bootstrap();