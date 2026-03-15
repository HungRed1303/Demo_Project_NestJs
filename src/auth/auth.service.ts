// src/auth/auth.service.ts
import {
  Inject,
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { UsersService } from '../user/user.service';
import { MailService } from '../mail/mail.service';
import { HASH_SERVICE } from './constants/auth.constants';
import type { IHashService } from './hash/interfaces/hash.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private mailService: MailService,

    @Inject(HASH_SERVICE)
    private hashService: IHashService,

    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) { }

  async register(email: string, password: string) {
    const user = await this.usersService.create(email, password);

    // Nếu đã có OTP còn hạn thì không gửi lại
    const existing = await this.cacheManager.get<string>(`otp:${email}`);
    if (existing) {
      return { message: 'OTP đã được gửi, vui lòng kiểm tra email hoặc chờ hết hạn để đăng ký lại' };
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(`otp:${email}`, otp, 5 * 60 * 1000);
    await this.mailService.sendOtp(email, otp);

    return { message: 'Vui lòng kiểm tra email để lấy mã OTP' };
  }

  async verifyOtp(email: string, otp: string) {
    const saved = await this.cacheManager.get<string>(`otp:${email}`);
    if (!saved) throw new BadRequestException('OTP đã hết hạn');
    if (saved !== otp) throw new BadRequestException('OTP không đúng');

    const user = await this.usersService.markVerified(email);
    await this.cacheManager.del(`otp:${email}`);

    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email không tồn tại');
    if (!user.isVerified) {
      throw new UnauthorizedException('Tài khoản chưa được xác thực');
    }

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    return this.generateTokens(user);
  }

  async refresh(token: string) {
    // 1. Verify chữ ký JWT trước — nếu giả mạo hoặc hết hạn sẽ throw ngay
    let payload: any;
    try {
      payload = this.jwtService.verify(token, {
        secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token không hợp lệ hoặc đã hết hạn');
    }

    // 2. Tìm user theo id trong payload
    const user = await this.usersService.findById(payload.sub);
    if (!user?.refreshToken) {
      throw new UnauthorizedException('Refresh token không tồn tại');
    }

    // 3. So sánh token client gửi với hash trong DB
    const isMatch = await this.hashService.compare(token, user.refreshToken);
    if (!isMatch) {
      // Token không khớp → có thể bị reuse sau khi đã rotate
      // Xóa luôn token hiện tại, buộc đăng nhập lại
      await this.usersService.clearRefreshToken(user.id);
      throw new UnauthorizedException(
        'Phát hiện token bất thường. Vui lòng đăng nhập lại.',
      );
    }

    // 4. Kiểm tra hết hạn trong DB (double-check)
    if (!user.refreshTokenExpiresAt || user.refreshTokenExpiresAt < new Date()) {
      await this.usersService.clearRefreshToken(user.id);
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    // 5. Cấp cặp token mới (token cũ tự bị ghi đè)
    return this.generateTokens(user);
  }

  async logout(userId: number) {
    await this.usersService.clearRefreshToken(userId);
    return { message: 'Đăng xuất thành công' };
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    const access_token = this.jwtService.sign(payload);

    const refresh_token = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    // Hash rồi lưu vào cột trên bảng users
    const hashed = await this.hashService.hash(refresh_token);
    await this.usersService.saveRefreshToken(user.id, hashed);

    return { access_token, refresh_token };
  }

  async resendOtp(email: string) {
    // 1. Kiểm tra user có tồn tại không
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new BadRequestException('Email không tồn tại');

    // 2. Nếu đã verify rồi thì không cần OTP nữa
    if (user.isVerified) {
      throw new BadRequestException('Tài khoản đã được xác thực');
    }

    // 3. Kiểm tra xem OTP cũ còn hạn không — tránh spam
    const existing = await this.cacheManager.get<string>(`otp:${email}`);
    if (existing) {
      throw new BadRequestException(
        'OTP vẫn còn hiệu lực, vui lòng kiểm tra email',
      );
    }

    // 4. Tạo và gửi OTP mới
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await this.cacheManager.set(`otp:${email}`, otp, 5 * 60 * 1000);
    await this.mailService.sendOtp(email, otp);

    return { message: 'Đã gửi lại OTP, vui lòng kiểm tra email' };
  }
}