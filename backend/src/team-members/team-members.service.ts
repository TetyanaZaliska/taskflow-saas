import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberRequest } from './dto/add-member.request';
import { TeamMember, TeamRole } from '@prisma/client';
import { PermissionsService } from '../permissions/permissions.service';

@Injectable()
export class TeamMembersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly permissionsService: PermissionsService,
  ) {}

  async addMember(
    teamId: number,
    data: AddMemberRequest,
    curUserId: number,
  ): Promise<TeamMember> {
    const team = await this.prismaService.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException('Team not found.');
    }

    const canAdd = await this.permissionsService.canManageTeamResources(
      curUserId,
      teamId,
      team.ownerId,
    );

    if (!canAdd) {
      throw new ForbiddenException(
        'Only the team owner or an administrator can add new members to this workspace.',
      );
    }

    const user = await this.prismaService.user.findFirst({
      where: {
        email: data.email,
        isActive: true,
      },
      select: {
        id: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    try {
      return this.prismaService.teamMember.create({
        data: {
          userId: user.id,
          teamId: teamId,
          role: data.role ?? TeamRole.MEMBER,
        },
      });
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new BadRequestException(
          'This user is already a member of the team.',
        );
      }

      throw error;
    }
  }

  async getMembers(teamId: number, curUserId: number) {
    await this.permissionsService.validateTeamAccess(curUserId, teamId);

    return this.prismaService.teamMember.findMany({
      where: {
        teamId,
      },
      select: {
        id: true,
        teamId: true,
        userId: true,
        role: true,
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
          },
        },
      },
    });
  }

  async removeMember(
    teamId: number,
    removeUserId: number,
    curUserId: number,
  ): Promise<TeamMember> {
    const memberToDelete = await this.prismaService.teamMember.findUnique({
      where: {
        userId_teamId: { teamId, userId: removeUserId },
      },
      include: { team: true },
    });

    if (!memberToDelete || memberToDelete.teamId !== teamId) {
      throw new NotFoundException('Member not found in this team.');
    }

    if (memberToDelete.userId === memberToDelete.team.ownerId) {
      throw new BadRequestException(
        'Impossible to remove the team owner from their own team!',
      );
    }

    const canRemove = await this.permissionsService.canManageTeamResources(
      curUserId,
      teamId,
      memberToDelete.team.ownerId,
    );

    if (!canRemove) {
      throw new ForbiddenException(
        'Only the team owner or an administrator can remove members from this team.',
      );
    }

    return this.prismaService.$transaction(async (tx) => {
      if (memberToDelete.role === TeamRole.ADMIN) {
        const totalAdmins = await tx.teamMember.count({
          where: { teamId, role: TeamRole.ADMIN },
        });

        if (totalAdmins <= 1) {
          throw new BadRequestException(
            'Impossible to delete the last admin! Promote another team member first.',
          );
        }
      }

      return tx.teamMember.delete({
        where: { id: memberToDelete.id },
      });
    });
  }
}
