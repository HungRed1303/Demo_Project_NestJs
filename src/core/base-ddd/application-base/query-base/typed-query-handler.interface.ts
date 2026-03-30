import { ITypedQuery } from './typed-query.interface';

export interface ITypedQueryHandler<
  TQuery extends ITypedQuery<TResult>,
  TResult,
> {
  execute(query: TQuery): Promise<TResult>;
}