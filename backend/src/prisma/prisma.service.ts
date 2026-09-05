import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { db } from './db';

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private runtime: Awaited<ReturnType<typeof db.connect>>;

  readonly db = db;

  async onModuleInit() {
    this.runtime = await db.connect({ url: process.env.DATABASE_URL! });
  }

  async onModuleDestroy() {
    await this.runtime.close();
  }
}
