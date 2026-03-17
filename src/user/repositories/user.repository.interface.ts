// src/user/repositories/user.repository.interface.ts
import { User } from '../entities/user.entity';

export const USER_REPOSITORY = 'USER_REPOSITORY';

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  findById(id: number): Promise<User | null>;
  create(email: string, hashedPassword: string): Promise<User>;
  save(user: User): Promise<User>;
  updateById(id: number, data: Partial<User>): Promise<void>;
}