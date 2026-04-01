import { ITypedCommand } from '../../../core/base-ddd/application-base/command-base/typed-command.interface';

// Input — data thô từ presentation truyền vào
export interface CreateBookInput {
  title: string;
  author: string;
  price: number;
  year: number;
}

// Result — data trả về sau khi xử lý
export interface CreateBookResult {
  id: number;
  title: string;
  author: string;
  price: number;
  year: number;
  createdAt: Date;
}

// Command — class vì NestJS CQRS cần instanceof để route đúng handler
export class CreateBookCommand implements ITypedCommand<CreateBookResult> {
  readonly _resultType?: CreateBookResult; // phantom type, không gán giá trị

  constructor(public readonly input: CreateBookInput) {}
}