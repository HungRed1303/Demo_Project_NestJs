import { Repository } from 'typeorm';
import { IDbModel } from './db-model.interface';

export class TypeOrmAdapter<TPersistenceModel extends object, TId = number>
  implements IDbModel<TPersistenceModel, TId>
{
  constructor(private readonly repo: Repository<TPersistenceModel>) {}

  async findById(id: TId): Promise<TPersistenceModel | null> {
    return this.repo.findOneBy({ id } as any);
  }

  async save(data: TPersistenceModel): Promise<TPersistenceModel> {
    return this.repo.save(data);
  }

  async findAll(): Promise<TPersistenceModel[]> {
    return this.repo.find();
  }

  async softDelete(id: TId): Promise<void> {
    await this.repo.softDelete(id as any);
  }
}