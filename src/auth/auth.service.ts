import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { HASH_SERVICE } from './constants/auth.constants';
import type { IHashService } from './hash/interfaces/hash.interface';
import { MailService } from '../mail/mail.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { BadRequestException } from '@nestjs/common/exceptions';

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

    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async register(email: string, password: string) {
    // 1. Tạo user chưa verify
    await this.usersService.create(email, password);

    // 2. Sinh OTP 6 số
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Lưu vào Redis 5 phút
    await this.cacheManager.set(`otp:${email}`, otp, 5 * 60 * 1000);

    // 4. Gửi email
    await this.mailService.sendOtp(email, otp);

    return { message: 'Vui lòng kiểm tra email để lấy mã OTP' };
  }

  async verifyOtp(email: string, otp: string) {
    // 1. Lấy OTP từ Redis
    const saved = await this.cacheManager.get<string>(`otp:${email}`);
    if (!saved) throw new BadRequestException('OTP đã hết hạn');

    // 2. So sánh
    if (saved !== otp) throw new BadRequestException('OTP không đúng');

    // 3. Cập nhật isVerified
    const user = await this.usersService.markVerified(email);

    // 4. Xóa OTP khỏi Redis
    await this.cacheManager.del(`otp:${email}`);

    // 5. Trả về token
    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    // Chặn login nếu chưa verify
    if (!user.isVerified) {
      throw new UnauthorizedException('Tài khoản chưa được xác thực, vui lòng kiểm tra email');
    }

    const isMatch = await this.hashService.compare(password, user.password);
    if (!isMatch) throw new UnauthorizedException('Sai mật khẩu');

    return this.generateTokens(user);
  }

  async refresh(token: string) {
    // 1. Tìm token trong DB
    const saved = await this.refreshTokenRepo.findOne({
      where: { isRevoked: false },
      relations: ['user'],
    });

    if (!saved) throw new UnauthorizedException('Refresh token không hợp lệ');

    // 2. Kiểm tra token có khớp với hash không
    const isMatch = await this.hashService.compare(token, saved.token);
    if (!isMatch) throw new UnauthorizedException('Refresh token không hợp lệ');

    // 3. Kiểm tra hết hạn chưa
    if (saved.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token đã hết hạn');
    }

    // 4. Thu hồi token cũ
    saved.isRevoked = true;
    await this.refreshTokenRepo.save(saved);

    // 5. Cấp token mới
    return this.generateTokens(saved.user);
  }

  async logout(token: string) {
    // Thu hồi refresh token khi logout
    const saved = await this.refreshTokenRepo.findOneBy({ isRevoked: false });
    if (saved) {
      saved.isRevoked = true;
      await this.refreshTokenRepo.save(saved);
    }
    return { message: 'Đăng xuất thành công' };
  }

  private async generateTokens(user: any) {
    const payload = { sub: user.id, email: user.email, role: user.role };

    // Tạo access token
    const access_token = this.jwtService.sign(payload);

    // Tạo refresh token
    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get('REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('REFRESH_TOKEN_EXPIRES_IN'),
    });

    // Hash refresh token trước khi lưu vào DB
    const hashed = await bcrypt.hash(refreshToken, 10);

    // Lưu vào DB
    await this.refreshTokenRepo.save({
      token: hashed,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 ngày
    });

    return { access_token, refresh_token: refreshToken };
  }


}