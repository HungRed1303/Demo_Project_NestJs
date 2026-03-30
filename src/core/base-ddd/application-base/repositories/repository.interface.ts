export interface IRepository<TDomainEntity, TId = number> {
  findById(id: TId): Promise<TDomainEntity | null>;
  save(entity: TDomainEntity): Promise<void>;
}