export interface IDbModel<TPersistenceModel, TId = number> {
  findById(id: TId): Promise<TPersistenceModel | null>;
  save(data: TPersistenceModel): Promise<TPersistenceModel>;
  findAll?(): Promise<TPersistenceModel[]>;
  softDelete?(id: TId): Promise<void>;
}