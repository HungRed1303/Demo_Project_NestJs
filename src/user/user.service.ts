import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
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
  ) { }

  async create(email: string, password: string) {
    const exists = await this.userRepo.findOneBy({ email });
    if (exists) throw new ConflictException('Email đã tồn tại');

    const hashed = await this.hashService.hash(password);  // hash password
    const user = this.userRepo.create({ email, password: hashed });
    return this.userRepo.save(user);
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }

  // Thêm method này vào cuối
  async markVerified(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new ConflictException('User not found');
    user.isVerified = true;
    return this.userRepo.save(user);
  }
}