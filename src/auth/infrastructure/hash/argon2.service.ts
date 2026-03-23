// argon2.service.ts
import * as argon2 from 'argon2';
import { Injectable } from '@nestjs/common';
import type { IHashService } from '../../domain/ports/hash.service.interface.ts';

@Injectable()
export class Argon2Service implements IHashService {
  async hash(plain: string): Promise<string> {
    return argon2.hash(plain);
  }

  async compare(plain: string, hashed: string): Promise<boolean> {
    return argon2.verify(hashed, plain);
  }
}