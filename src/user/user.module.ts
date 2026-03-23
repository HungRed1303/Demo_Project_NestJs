import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './application/user.service';
import { UsersController } from './presentation/user.controller';
import { UserOrmEntity } from './infrastructure/user.orm-entity';
import { HashModule } from '../shared/hash/hash.module';
import { UserRepository } from './infrastructure/user.repository';
import { USER_REPOSITORY } from './domain/user.repository.interface';

@Module({
  imports: [TypeOrmModule.forFeature([UserOrmEntity]), HashModule],
  controllers: [UsersController],
  providers: [
    UsersService,
    { provide: USER_REPOSITORY, useClass: UserRepository },
  ],
  exports: [UsersService],
})
export class UsersModule {}