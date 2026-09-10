import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { AUTH_MAIL_QUEUE } from '../auth/constants/auth-jobs.enum';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: AUTH_MAIL_QUEUE,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
