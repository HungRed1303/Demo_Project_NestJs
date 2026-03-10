// hash.module.ts

import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { HASH_SERVICE } from "../constants/auth.constants";
import { BcryptService } from "./services/bcrypt.service";

@Module({
  providers: [
    {
      provide: HASH_SERVICE,
      useClass: BcryptService,
    },
  ],
  exports: [HASH_SERVICE],  // ← export để module khác dùng
})
export class HashModule {}