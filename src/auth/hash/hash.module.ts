// hash.module.ts

import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { HASH_SERVICE } from "../constants/auth.constants";
import { BcryptService } from "./services/bcrypt.service";
import { Argon2Service } from "./services/argon2.service";

@Module({
  providers: [
    {
      provide: HASH_SERVICE,
      useClass: Argon2Service,  // ← đổi thành Argon2Service
    },
  ],
  exports: [HASH_SERVICE],  // ← export để module khác dùng
})
export class HashModule {}