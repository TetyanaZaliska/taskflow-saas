import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateTeamRequest } from './dto/create-team.request';
import { PrismaService } from '../prisma/prisma.service';
import { PermissionsService } from '../permissions/permissions.service';
import { FieldOutputTypes } from '../prisma/contract';
import { getAdminRole } from '../common/constants/enums';

export type Team = FieldOutputTypes['public']['Team'];

@Injectable()
export class TeamsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async createTeam(data: CreateTeamRequest, userId: number): Promise<Team> {
    return await this.prismaService.db.orm.public.Team.create({
      ...data,
      ownerId: userId,
      teamMembers: (teamMembers) =>
        teamMembers.create({
          userId,
          role: getAdminRole(),
        }),
    });
  }

  async getTeams(userId: number): Promise<Team[]> {
    return await this.prismaService.db.orm.public.Team.where((team) =>
      team.teamMembers.some((member) => member.userId.eq(userId)),
    ).all();
  }

  async getTeam(teamId: number, userId: number): Promise<Team> {
    await this.permissionsService.validateTeamAccess(userId, teamId);

    const team = await this.prismaService.db.orm.public.Team.where({
      id: teamId,
    }).first();

    if (!team) {
      throw new NotFoundException(`Team not found with id ${teamId}`);
    }

    return team;
  }

  async removeTeam(teamId: number, userId: number): Promise<Team> {
    const teamToDelete = await this.prismaService.db.orm.public.Team.where({
      id: teamId,
    }).first();

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

    const deletedTeam = await this.prismaService.db.orm.public.Team.where({
      id: teamId,
    }).delete();

    if (!deletedTeam) {
      throw new NotFoundException('Team not found.');
    }

    return deletedTeam;
  }
}
