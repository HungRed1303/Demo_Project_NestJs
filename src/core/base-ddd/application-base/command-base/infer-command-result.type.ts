import { ITypedCommand } from './typed-command.interface';

// Conditional type — tự suy luận kiểu trả về từ Command
// "C có phải là ITypedCommand<R> không?"
// Có → trả R    |    Không → trả never
export type InferCommandResult<C> =
  C extends ITypedCommand<infer R> ? R : never;