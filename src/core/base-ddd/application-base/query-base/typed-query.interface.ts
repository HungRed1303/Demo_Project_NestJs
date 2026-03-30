import { IQuery } from '@nestjs/cqrs';

export interface ITypedQuery<TResult> extends IQuery {
  readonly _resultType?: TResult;
}