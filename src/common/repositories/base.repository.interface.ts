export interface IBaseRepository<T> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  save(entity: T): Promise<T>;
  update(id: number, data: Partial<T>): Promise<void>;
  softDelete(entity: T): Promise<void>;
}