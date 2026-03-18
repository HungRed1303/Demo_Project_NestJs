import { Repository, ObjectLiteral } from 'typeorm';
import { IBaseRepository } from './base.repository.interface';

export class BaseRepository<T extends ObjectLiteral>
  implements IBaseRepository<T>
{
  constructor(protected readonly repo: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repo.find();
  }

  findById(id: number): Promise<T | null> {
    return this.repo.findOneBy({ id } as any);
  }

  save(entity: T): Promise<T> {
    return this.repo.save(entity);
  }

  async update(id: number, data: Partial<T>): Promise<void> {
    await this.repo.update(id, data as any);
  }

  async softDelete(entity: T): Promise<void> {
    await this.repo.softRemove(entity);
  }
}