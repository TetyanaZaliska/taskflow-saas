import {
  ForbiddenException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserRequest } from './dto/create-user.request';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async createUser(data: CreateUserRequest) {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    try {
      return await this.prismaService.user.create({
        data: {
          ...data,
          password: hashedPassword,
        },
        select: {
          email: true,
          id: true,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new UnprocessableEntityException('Email already exists.');
        }
      }
      throw err;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    const user = await this.prismaService.user.findUniqueOrThrow({
      where: filter,
    });

    if (!user.isActive) {
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

    return this.prismaService.user.findMany({
      where: {
        isActive: true,
        email: {
          contains: query,
          mode: 'insensitive',
        },
      },
      select: {
        id: true,
        email: true,
      },
      take: 10,
    });
  }
}
