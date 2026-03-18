// src/user/user.service.ts
import { Injectable, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { User } from './entities/user.entity';
import { HASH_SERVICE } from '../auth/constants/auth.constants';
import type { IHashService } from '../auth/hash/interfaces/hash.interface';
import { USER_REPOSITORY } from './repositories/user.repository.interface'; 
import type {IUserRepository } from './repositories/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepo: IUserRepository,  // ← interface

    @Inject(HASH_SERVICE)
    private hashService: IHashService,
  ) {}

  async create(email: string, password: string): Promise<User> {
    const exists = await this.userRepo.findByEmail(email);

    if (exists) {
      if (exists.isVerified) {
        throw new ConflictException('Email đã được đăng ký');
      }
      // Chưa verify → update password mới
      exists.password = await this.hashService.hash(password);
      return this.userRepo.save(exists);
    }

    const hashed = await this.hashService.hash(password);
    return this.userRepo.create(email, hashed);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findByEmail(email);
  }

  findById(id: number): Promise<User | null> {
    return this.userRepo.findById(id);
  }

  async markVerified(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    user.isVerified = true;
    return this.userRepo.save(user);
  }

  async saveRefreshToken(userId: number, hashedToken: string): Promise<void> {
    await this.userRepo.update(userId, {
      refreshToken: hashedToken,
      refreshTokenExpiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });
  }

  async clearRefreshToken(userId: number): Promise<void> {
    await this.userRepo.update(userId, {
      refreshToken: null,
      refreshTokenExpiresAt: null,
    });
  }
}