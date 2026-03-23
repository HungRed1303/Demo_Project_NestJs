import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserOrmEntity } from './user.orm-entity';
import { User } from '../domain/user.entity';
import { IUserRepository } from '../domain/user.repository.interface';
import { UserMapper } from './user.mapper';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const ormUser = await this.repo.findOneBy({ email });
    return ormUser ? UserMapper.toDomain(ormUser) : null;
  }

  async findById(id: number): Promise<User | null> {
    const ormUser = await this.repo.findOneBy({ id });
    return ormUser ? UserMapper.toDomain(ormUser) : null;
  }

  async save(user: User): Promise<User> {
    const ormEntity = UserMapper.toOrm(user);
    const savedEntity = await this.repo.save(ormEntity);
    return UserMapper.toDomain(savedEntity);
  }
}