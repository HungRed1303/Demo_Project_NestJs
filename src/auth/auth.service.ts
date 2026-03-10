import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,

    @InjectRepository(RefreshToken)
    private refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  async register(email: string, password: string) {
    const user = await this.usersService.create(email, password);
    return this.generateTokens(user);
  }

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Email không tồn tại');

    const isMatch = await bcrypt.compare(password, user.password);
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
    const isMatch = await bcrypt.compare(token, saved.token);
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