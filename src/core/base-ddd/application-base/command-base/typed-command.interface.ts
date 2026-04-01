import { ICommand } from '@nestjs/cqrs';

export interface ITypedCommand<TResult> extends ICommand {
  readonly _resultType?: TResult;
  // field này KHÔNG BAO GIỜ có giá trị thực
  // chỉ tồn tại để TypeScript suy luận kiểu trả về
}