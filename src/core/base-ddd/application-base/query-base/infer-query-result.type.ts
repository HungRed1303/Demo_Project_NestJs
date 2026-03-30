import { ITypedQuery } from './typed-query.interface';

export type InferQueryResult<Q> =
  Q extends ITypedQuery<infer R> ? R : never;