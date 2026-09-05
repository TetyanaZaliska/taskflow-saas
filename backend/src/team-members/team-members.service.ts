import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddMemberRequest } from './dto/add-member.request';
import { PermissionsService } from '../permissions/permissions.service';
import { TeamRole } from '../common/interfaces/enums';
import { FieldOutputTypes } from '../prisma/contract';
import { getAdminRole, getMemberRole } from '../common/constants/enums';
import { isStructuredError } from '@prisma/orm-postgres/utils';

export type TeamMember = FieldOutputTypes['public']['TeamMember'];

export interface MemberWithUserResponse {
  id: number;
  teamId: number;
  userId: number;
  role: TeamRole;
  user: {
    id: number;
    email: string;
    isActive: boolean;
  };
}

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
    const team = await this.prismaService.db.orm.public.Team.where({
      id: teamId,
    }).first();

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
        'Only the team owner or an administrator can add new members to this team.',
      );
    }

    const user = await this.prismaService.db.orm.public.User.where({
      email: data.email,
      isActive: true,
    })
      .select('id')
      .first();

    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const dataRole = data.role as TeamRole;

    try {
      return await this.prismaService.db.orm.public.TeamMember.create({
        userId: user.id,
        teamId: teamId,
        role: dataRole ?? getMemberRole(),
      });
    } catch (error) {
      if (isStructuredError(error) && error.code.endsWith('P2002')) {
        throw new ConflictException(
          'This user is already a member of the team.',
        );
      }

      throw error;
    }
  }

  async getMembers(
    teamId: number,
    curUserId: number,
  ): Promise<MemberWithUserResponse[]> {
    await this.permissionsService.validateTeamAccess(curUserId, teamId);

    return this.prismaService.db.orm.public.TeamMember.where({ teamId })
      .where((member) => member.user.some((user) => user.isActive.eq(true)))
      .select('id', 'teamId', 'userId', 'role')
      .include('user', (user) => user.select('id', 'email', 'isActive'))
      .all();
  }

  async removeMember(
    teamId: number,
    removeUserId: number,
    curUserId: number,
  ): Promise<TeamMember> {
    const memberToDelete =
      await this.prismaService.db.orm.public.TeamMember.where({
        teamId,
        userId: removeUserId,
      })
        .include('team', (team) =>
          team.select('id', 'name', 'createdAt', 'ownerId'),
        )
        .first();

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

    const deletedMember = await this.prismaService.db.transaction(
      async (tx) => {
        if (memberToDelete.role === getAdminRole()) {
          const totalAdmins = await tx.orm.public.TeamMember.where({
            teamId,
            role: getAdminRole(),
          }).aggregate((a) => ({ total: a.count() }));

          if (totalAdmins.total <= 1) {
            throw new BadRequestException(
              'Impossible to delete the last admin! Promote another team member first.',
            );
          }
        }

        return tx.orm.public.TeamMember.where({
          id: memberToDelete.id,
        }).delete();
      },
    );

    if (!deletedMember) {
      throw new NotFoundException('Member not found in this team.');
    }

    return deletedMember;
  }
}
