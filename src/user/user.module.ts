// src/user/user.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './user.service';
import { UsersController } from './user.controller';
import { User } from './entities/user.entity';
import { HashModule } from '../auth/hash/hash.module';
import { UserRepository } from './repositories/user.repository';
import { USER_REPOSITORY } from './repositories/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([User]), HashModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: USER_REPOSITORY,
      useClass: UserRepository,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}