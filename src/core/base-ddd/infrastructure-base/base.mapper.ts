export interface IMapper<TDomainEntity, TPersistenceModel> {
  toDomain(record: TPersistenceModel): TDomainEntity;
  toPersistence(entity: TDomainEntity): TPersistenceModel;
}