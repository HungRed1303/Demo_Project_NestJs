import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ITypedCommand } from './command-base/typed-command.interface';
import { InferCommandResult } from './command-base/infer-command-result.type';

@Injectable()
export class TypedCommandBus {
  constructor(private readonly commandBus: CommandBus) {}

  // Override kiểu trả về từ Promise<any> → Promise<TResult>
  // Runtime vẫn delegate xuống CommandBus gốc, không thay đổi gì
  execute<TCommand extends ITypedCommand<TResult>, TResult>(
    command: TCommand,
  ): Promise<InferCommandResult<TCommand>> {
    return this.commandBus.execute(command);
  }
}