// hash.module.ts

import { Module } from "@nestjs/common/decorators/modules/module.decorator";
import { HASH_SERVICE } from "../../auth/presentation/constants/auth.constants";
import { BcryptService } from "../../auth/infrastructure/hash/bcrypt.service";
import { Argon2Service } from "../../auth/infrastructure/hash/argon2.service";

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