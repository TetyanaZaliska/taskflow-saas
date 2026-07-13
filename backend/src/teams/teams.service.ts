import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamRequest } from './dto/create-team.request';
import { PrismaService } from '../prisma/prisma.service';
import { TeamRole } from '@prisma/client';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class TeamsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async createTeam(data: CreateTeamRequest, userId: number) {
    return await this.prismaService.team.create({
      data: {
        name: data.name,
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
    await this.permissionsService.validateTeamAccess(userId, teamId);

    const team = await this.prismaService.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team not found with id ${teamId}`);
    }

    return team;
  }

  async removeTeam(teamId: number, userId: number) {
    const teamToDelete = await this.prismaService.team.findUnique({
      where: { id: teamId },
    });

    if (!teamToDelete) {
      throw new NotFoundException('Team not found.');
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
