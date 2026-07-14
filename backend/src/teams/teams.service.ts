import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamRequest } from './dto/create-team.request';
import { PrismaService } from '../prisma/prisma.service';
import { Team, TeamRole } from '@prisma/client';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async createTeam(data: CreateTeamRequest, userId: number): Promise<Team> {
    return await this.prismaService.team.create({
      data: {
        //name: data.name,
        ...data,
        ownerId: userId,
        members: {
          create: {
            userId,
            role: TeamRole.ADMIN,
          },
        },
      },
    });
  }

  async getTeams(userId: number): Promise<Team[]> {
    return await this.prismaService.team.findMany({
      where: {
        members: {
          some: {
            userId: userId,
          },
        },
      },
    });
  }

  async getTeam(teamId: number, userId: number): Promise<Team> {
    await this.permissionsService.validateTeamAccess(userId, teamId);

    const team = await this.prismaService.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team not found with id ${teamId}`);
    }

    return team;
  }

  async removeTeam(teamId: number, userId: number): Promise<Team> {
    const teamToDelete = await this.prismaService.team.findUnique({
      where: { id: teamId },
    });

    if (!teamToDelete) {
      throw new NotFoundException('Team not found.');
    }

    if (teamToDelete.ownerId !== userId) {
      throw new ForbiddenException(
        'Only the primary team owner (creator) can delete this team.',
      );
    }

    const canRemove = await this.permissionsService.canManageTeamResources(
      userId,
      teamId,
      teamToDelete.ownerId,
    );

    if (!canRemove) {
      throw new ForbiddenException(
        'You are not allowed to delete this team. Only the owner or an administrator can do this.',
      );
    }

    const deletedTeam = await this.prismaService.team.delete({
      where: { id: teamId },
    });

    return deletedTeam;
  }
}
