import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { MAIL_SERVICE } from './application/mail.service.interface';
import { MailServiceImpl } from './infrastructure/mail.service';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        transport: {
          host: config.get('MAIL_HOST'),
          port: config.get<number>('MAIL_PORT'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASS'),
          },
        },
        defaults: {
          from: config.get('MAIL_FROM'),
        },
      }),
    }),
  ],
  providers: [
    {
      provide: MAIL_SERVICE,
      useClass: MailServiceImpl,
    },
  ],
  exports: [MAIL_SERVICE], // Export token này ra để module khác xài
})
export class MailModule {}