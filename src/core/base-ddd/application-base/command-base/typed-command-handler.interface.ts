import { ITypedCommand } from './typed-command.interface';

// Contract cho handler — ép execute() trả đúng kiểu TResult
export interface ITypedCommandHandler<
  TCommand extends ITypedCommand<TResult>,
  TResult,
> {
  execute(command: TCommand): Promise<TResult>;
}