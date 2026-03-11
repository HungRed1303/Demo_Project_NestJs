import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
    constructor(private mailerService: MailerService) { }

    async sendOtp(email: string, otp: string) {
        try {
            const result = await this.mailerService.sendMail({
                to: email,
                subject: 'Xác thực tài khoản',
                text: `Mã OTP của bạn là: ${otp}\nMã hết hạn sau 5 phút.`,
            });
            console.log('Email sent:', result);
        } catch (error) {
            console.error('Mail error:', error.message);
            console.error('Mail config:', {
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS ? '***' + process.env.MAIL_PASS.slice(-4) : 'undefined',
            });
            throw error;
        }
    }
}