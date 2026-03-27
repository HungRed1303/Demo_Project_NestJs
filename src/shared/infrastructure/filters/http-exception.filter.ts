import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';

@Catch()  // bắt tất cả exception
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    // Xác định status code
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Lấy message
    const message = this.getMessage(exception);

    res.status(status).json({
      success: false,
      statusCode: status,
      message,
      path: req.url,
      timestamp: new Date().toISOString(),
    });
  }

  private getMessage(exception: unknown): string | string[] {
    if (exception instanceof HttpException) {
      const res = exception.getResponse();

      // ValidationPipe trả về object có field message
      if (typeof res === 'object' && 'message' in res) {
        return (res as any).message;
      }

      return exception.message;
    }

    // Lỗi không xác định
    console.error('Unexpected error:', exception);
    return 'Lỗi hệ thống, vui lòng thử lại sau';
  }
}