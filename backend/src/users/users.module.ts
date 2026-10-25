import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { PrismaModule } from '../prisma/prisma.module';
import { BullModule } from '@nestjs/bullmq';
import { AUTH_MAIL_QUEUE } from '../auth/constants/auth-jobs.constants';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: AUTH_MAIL_QUEUE,
    }),
    BullBoardModule.forFeature({
      name: AUTH_MAIL_QUEUE,
      adapter: BullMQAdapter,
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
