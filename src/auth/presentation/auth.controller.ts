import { Controller, Post, Body, Req, Res, UseGuards, UnauthorizedException } from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from '../application/auth.service';
import { RegisterDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { VerifyOtpDto } from '../dto/verify-otp.dto';
import { ResendOtpDto } from '../dto/resend-otp.dto';
import { Public } from '../decorators/public.decorator';
import { parseDurationToMs } from '../../shared/utils/parse-duration';
import { ConfigService } from '@nestjs/config';
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private configService: ConfigService
  ) { }

  // ─── Helper ──────────────────────────────────────────
  private setRefreshTokenCookie(res: Response, token: string) {
    const isProduction = this.configService.get('NODE_ENV') === 'production';
    const expiresIn = this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';

    res.cookie('refresh_token', token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: parseDurationToMs(expiresIn), // '7d' → 604800000
    });
  }

  private handleAuthResponse(res: Response, tokens: { access_token: string; refresh_token: string }) {
    this.setRefreshTokenCookie(res, tokens.refresh_token);
    return { access_token: tokens.access_token };
  }

  // ─── Routes ──────────────────────────────────────────
  @Public()
  @Post('register')
  async register(@Body() body: RegisterDto) {
    return this.authService.register(body.email, body.password);
    // không trả token ở đây vì cần verify OTP trước
  }

  @Public()
  @Post('verify-otp')
  async verifyOtp(@Body() body: VerifyOtpDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.verifyOtp(body.email, body.otp);
    return this.handleAuthResponse(res, tokens);
  }

  @Public()
  @Post('login')
  async login(@Body() body: LoginDto, @Res({ passthrough: true }) res: Response) {
    const tokens = await this.authService.login(body.email, body.password);
    return this.handleAuthResponse(res, tokens);
  }

  @Public()
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const token = req.cookies['refresh_token'];
    if (!token) throw new UnauthorizedException('Không có refresh token');
    const tokens = await this.authService.refresh(token);
    console.log('TOKEN BACKEND NHẬN:', token);
    return this.handleAuthResponse(res, tokens);
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const user = (req as any).user;        // do JwtStrategy gắn vào
    await this.authService.logout(user.id);
    res.clearCookie('refresh_token');
    return { message: 'Đăng xuất thành công' };
  }

  @Public()
  @Post('resend-otp')
  async resendOtp(@Body() body: ResendOtpDto) {
    return this.authService.resendOtp(body.email);
  }
}