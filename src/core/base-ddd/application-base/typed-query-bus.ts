import { Injectable } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { ITypedQuery } from './query-base/typed-query.interface';
import { InferQueryResult } from './query-base/infer-query-result.type';

// Tương tự TypedCommandBus nhưng cho Query
@Injectable()
export class TypedQueryBus {
  constructor(private readonly queryBus: QueryBus) {}

  execute<TQuery extends ITypedQuery<TResult>, TResult>(
    query: TQuery,
  ): Promise<InferQueryResult<TQuery>> {
    return this.queryBus.execute(query);
  }
}