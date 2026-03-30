import { IRepository } from '../application-base/repositories/repository.interface';
import { IDbModel } from './db-model.interface';
import { IMapper } from './base.mapper';

// Không import bất kỳ thư viện ORM nào
// Đổi TypeORM → Prisma: chỉ swap adapter bên ngoài, file này không đổi
export abstract class BasePersistenceRepository<
  TDomainEntity,
  TPersistenceModel,
  TId = number,
> implements IRepository<TDomainEntity, TId>
{
  constructor(
    protected readonly dbModel: IDbModel<TPersistenceModel, TId>,
    protected readonly mapper: IMapper<TDomainEntity, TPersistenceModel>,
  ) {}

  async findById(id: TId): Promise<TDomainEntity | null> {
    const record = await this.dbModel.findById(id);
    return record ? this.mapper.toDomain(record) : null;
  }

  async save(entity: TDomainEntity): Promise<void> {
    const data = this.mapper.toPersistence(entity);
    await this.dbModel.save(data);
  }
}