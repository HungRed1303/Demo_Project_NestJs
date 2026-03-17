// src/user/repositories/user.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { IUserRepository } from './user.repository.interface';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  findById(id: number): Promise<User | null> {
    return this.repo.findOneBy({ id });
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const user = this.repo.create({ email, password: hashedPassword });
    return this.repo.save(user);
  }

  save(user: User): Promise<User> {
    return this.repo.save(user);
  }

  async updateById(id: number, data: Partial<User>): Promise<void> {
    await this.repo.update(id, data);
  }
}