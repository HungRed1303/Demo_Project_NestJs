import { Injectable, ConflictException, Inject, NotFoundException } from '@nestjs/common';
import { User } from '../domain/user.entity';
import { HASH_SERVICE } from '../../auth/presentation/constants/auth.constants';
import type { IHashService } from '../../auth/domain/ports/hash.service.interface.ts';
import { USER_REPOSITORY } from '../domain/user.repository.interface';
import type { IUserRepository } from '../domain/user.repository.interface';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepo: IUserRepository,
    @Inject(HASH_SERVICE) private hashService: IHashService,
  ) {}

  async create(email: string, password: string): Promise<User> {
    let user = await this.userRepo.findByEmail(email);
    if (user) {
      if (user.isVerified) throw new ConflictException('Email đã được đăng ký');
      const hashed = await this.hashService.hash(password);
      user.changePassword(hashed);
      return this.userRepo.save(user);
    }
    const hashed = await this.hashService.hash(password);
    user = new User({ email, password: hashed });
    return this.userRepo.save(user);
  }

  findByEmail(email: string): Promise<User | null> { return this.userRepo.findByEmail(email); }
  findById(id: number): Promise<User | null> { return this.userRepo.findById(id); }

  async markVerified(email: string): Promise<User> {
    const user = await this.userRepo.findByEmail(email);
    if (!user) throw new NotFoundException('User not found');
    user.verify();
    return this.userRepo.save(user);
  }

  async saveRefreshToken(userId: number, hashedToken: string): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.setRefreshToken(hashedToken, 7 * 24 * 60 * 60 * 1000);
    await this.userRepo.save(user);
  }

  async clearRefreshToken(userId: number): Promise<void> {
    const user = await this.userRepo.findById(userId);
    if (!user) throw new NotFoundException('User not found');
    user.clearRefreshToken();
    await this.userRepo.save(user);
  }
}