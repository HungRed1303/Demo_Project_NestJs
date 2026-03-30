import { ITypedCommand } from '../../../core/base-ddd/application-base/command-base/typed-command.interface';

export interface UpdateBookInput {
  title?: string;
  author?: string;
  price?: number;
  year?: number;
}

export interface UpdateBookResult {
  id: number;
  title: string;
  author: string;
  price: number;
  year: number;
  createdAt: Date;
}

export class UpdateBookCommand implements ITypedCommand<UpdateBookResult> {
  readonly _resultType?: UpdateBookResult;

  constructor(
    public readonly id: number,
    public readonly input: UpdateBookInput,
  ) {}
}