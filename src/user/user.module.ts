import { Module } from '@nestjs/common';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { HASH_SERVICE } from '../auth/constants/auth.constants';
import { BcryptService } from '../auth/hash/services/bcrypt.service';
import { HashModule } from '../auth/hash/hash.module';
@Module({
  imports: [TypeOrmModule.forFeature([User]), HashModule],
  controllers: [UsersController],
  providers: [
    UsersService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
