import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { FieldOutputTypes } from '../prisma/contract';

export type User = FieldOutputTypes['public']['User'];

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserRequest) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      return await this.prismaService.db.orm.public.User.select(
        'email',
        'id',
      ).create({
        ...data,
        password: hashedPassword,
      });
    } catch (err) {
      const error = err as Record<string, unknown>;

      if (
        error?.name === 'SqlQueryError' &&
        (error?.sqlState === '23505' || error?.constraint === 'User_email_key')
      ) {
        throw new UnprocessableEntityException('Email already exists.');
      }
      throw err;
    }
  }

  async getUser(filter: Partial<User>) {
    const user =
      await this.prismaService.db.orm.public.User.where(filter).first();

    if (!user?.isActive) {
      throw new ForbiddenException('This user account has been deactivated.');
    }

    return user;
  }

  async searchUsers(query: string, curUserId: number) {
    if (!curUserId || isNaN(curUserId)) {
      throw new ForbiddenException('Access denied. Authentication required.');
    }

    if (!query?.trim()) {
      return [];
    }

    const user = await this.prismaService.db.orm.public.User.where({
      isActive: true,
    })
      .where((user) => user.email.ilike(`%${query}%`))
      .where((user) => user.id.neq(curUserId))
      .select('id', 'email')
      .limit(10)
      .all();

    return user;
  }
}
