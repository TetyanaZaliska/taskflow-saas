import { Injectable } from '@nestjs/common';
import { CreateTeamRequest } from './dto/create-team.request';
import { PrismaService } from '../prisma/prisma.service';
import { TeamRole } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createTeam(data: CreateTeamRequest, userId: number) {
    return await this.prismaService.team.create({
      data: {
        name: data.name,
        members: {
          create: {
            userId,
            role: TeamRole.ADMIN,
          },
        },
      },
    });
  }

  async getTeams() {
    return await this.prismaService.team.findMany();
  }
}
