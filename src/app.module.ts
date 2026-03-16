import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BooksModule } from './books/books.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';
import { UsersModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';  // ← import
import { MailModule } from './mail/mail.module';  // ← import
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    CacheModule.registerAsync({
      isGlobal: true,  // dùng được ở mọi nơi
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        store: redisStore,
        host: config.get('REDIS_HOST'),
        port: config.get<number>('REDIS_PORT'),
        ttl: 60 * 1000,  // 60 giây (milliseconds)
      }),
    }),

    TypeOrmModule.forRootAsync({  
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,  // không tự động sync để tránh mất dữ liệu, dùng migrations thay thế
      }),
      inject: [ConfigService],
    }), 
    BooksModule, 
    UsersModule,
    MailModule,
    AuthModule],
  controllers: [AppController],
  providers: [AppService,
    {
      provide: 'APP_GUARD',
      useClass: JwtAuthGuard,  // áp dụng guard toàn cục
    }
  ],
})
export class AppModule { }
