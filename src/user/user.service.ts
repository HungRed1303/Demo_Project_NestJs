import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async create(email: string, password: string) {
    const exists = await this.userRepo.findOneBy({ email });
    if (exists) throw new ConflictException('Email đã tồn tại');

    const hashed = await bcrypt.hash(password, 10);  // hash password
    const user = this.userRepo.create({ email, password: hashed });
    return this.userRepo.save(user);
  }

  findByEmail(email: string) {
    return this.userRepo.findOneBy({ email });
  }
}