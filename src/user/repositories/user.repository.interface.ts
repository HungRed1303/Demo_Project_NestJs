// src/user/repositories/user.repository.interface.ts
import { User } from '../entities/user.entity';
import { IBaseRepository } from '../../common/repositories/base.repository.interface';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository extends IBaseRepository<User> {
  findByEmail(email: string): Promise<User | null>;
  create(email: string, hashedPassword: string): Promise<User>;
}