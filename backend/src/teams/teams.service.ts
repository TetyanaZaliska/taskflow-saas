import { Injectable, NotFoundException } from '@nestjs/common';
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

  async getTeams(userId: number) {
    return this.prismaService.team.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getTeam(teamId: number, userId: number) {
    try {
      return await this.prismaService.team.findUniqueOrThrow({
        where: { id: teamId },
      });
    } catch (err) {
      throw new NotFoundException(`Team not found with id ${teamId}`);
    }
  }

  async removeTeam(teamId: number) {
    return this.prismaService.$transaction(async (tx) => {
      const teamToDelete = await tx.team.findUnique({
        where: { id: teamId },
      });

      if (!teamToDelete) {
        throw new NotFoundException('Team not found.');
      }

      const deletedTeam = await tx.team.delete({
        where: { id: teamId },
      });

      return deletedTeam;
    });
  }
}
