export abstract class BaseDomainEntity {
  protected _id?: number;
  protected _createdAt: Date;
  protected _updatedAt: Date;

  constructor(props: { id?: number; createdAt?: Date; updatedAt?: Date }) {
    this._id = props.id;
    this._createdAt = props.createdAt ?? new Date();
    this._updatedAt = props.updatedAt ?? new Date();
  }

  get id(): number | undefined { return this._id; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }
}