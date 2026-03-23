import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { IMailService } from '../application/mail.service.interface';

@Injectable()
export class MailServiceImpl implements IMailService {
  constructor(private readonly mailerService: MailerService) {}

  async sendOtp(email: string, otp: string): Promise<void> {
    try {
      const result = await this.mailerService.sendMail({
        to: email,
        subject: 'Xác thực tài khoản',
        text: `Mã OTP của bạn là: ${otp}\nMã hết hạn sau 5 phút.`,
      });
      console.log('Email sent:', result);
    } catch (error: any) {
      console.error('Mail error:', error.message);
      console.error('Mail config:', {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
          ? '***' + process.env.MAIL_PASS.slice(-4)
          : 'undefined',
      });
      throw error;
    }
  }
}