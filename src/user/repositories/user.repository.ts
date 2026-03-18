import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import type { IUserRepository } from './user.repository.interface';
import { BaseRepository } from '../../common/repositories/base.repository';

@Injectable()
export class UserRepository
  extends BaseRepository<User>
  implements IUserRepository
{
  constructor(
    @InjectRepository(User)
    repo: Repository<User>,
  ) {
    super(repo);  // truyền repo lên BaseRepository
  }

  // chỉ viết method đặc thù
  findByEmail(email: string): Promise<User | null> {
    return this.repo.findOneBy({ email });
  }

  async create(email: string, hashedPassword: string): Promise<User> {
    const user = this.repo.create({ email, password: hashedPassword });
    return this.repo.save(user);
  }
}