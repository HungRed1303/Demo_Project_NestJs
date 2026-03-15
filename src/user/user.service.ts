// src/user/user.service.ts
import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Inject } from '@nestjs/common';
import { HASH_SERVICE } from '../auth/constants/auth.constants';
import type { IHashService } from '../auth/hash/interfaces/hash.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @Inject(HASH_SERVICE)
    private hashService: IHashService,
  ) {}

  async create(email: string, password: string) {
    const exists = await this.userRepo.findOneBy({ email });

    if (exists) {
      if (exists.isVerified) {
        throw new ConflictException('Email đã được đăng ký');
      }
      // Chưa verify → cho đăng ký lại, cập nhật password mới
      exists.password = await this.hashService.hash(password);
      return this.userRepo.save(exists);
    }

    const hashed = await this.hashService.hash(password);
    const user = this.userRepo.create({ email, password: hashed });
    return this.userRepo.save(user);
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  findById(id: number) {
    return this.userRepo.findOneBy({ id });
  }

  async markVerified(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new ConflictException('User not found');
    user.isVerified = true;
    return this.userRepo.save(user);
  }

  async saveRefreshToken(userId: number, hashedToken: string) {
    await this.userRepo.update(userId, {
      refreshToken: hashedToken,
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  async clearRefreshToken(userId: number) {
    await this.userRepo.update(userId, {
      refreshToken: null,
      refreshTokenExpiresAt: null,
    });
  }
}