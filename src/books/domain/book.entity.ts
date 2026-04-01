import { BaseDomainEntity } from '../../core/base-ddd/domain-base/base.entity';

export class Book extends BaseDomainEntity {
  private _title: string;
  private _author: string;
  private _price: number;
  private _year: number;
  private _deletedAt: Date | null;

  constructor(props: { 
    id?: number; title: string; author: string; 
    price: number; year: number; 
    deletedAt?: Date | null; createdAt?: Date; updatedAt?: Date;
  }) {
    super(props);
    this._title = props.title;
    this._author = props.author;
    this._price = props.price;
    this._year = props.year;
    this._deletedAt = props.deletedAt ?? null;
  }

  get title(): string { return this._title; }
  get author(): string { return this._author; }
  get price(): number { return this._price; }
  get year(): number { return this._year; }
  get deletedAt(): Date | null { return this._deletedAt; }

  public updateInfo(data: Partial<{ title: string; author: string; price: number; year: number }>): void {
    if (data.title) this._title = data.title;
    if (data.author) this._author = data.author;
    if (data.price) this._price = data.price;
    if (data.year) this._year = data.year;
  }

  public markAsDeleted(): void { this._deletedAt = new Date(); }
}