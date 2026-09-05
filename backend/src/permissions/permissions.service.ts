import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { type TeamRole } from '../common/interfaces/enums';
import { TeamMember } from '../team-members/team-members.service';
import { getAdminRole } from '../common/constants/enums';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async hasProjectAccess(
    userId: number,
    projectId: number,
    requiredRoles?: TeamRole[],
  ): Promise<boolean> {
    const membership = await this.prismaService.db.orm.public.TeamMember.where({
      userId,
    })
      .where((member) =>
        member.team.some((team) =>
          team.projects.some((project) => project.id.eq(projectId)),
        ),
      )
      .first();

    return this.checkMembershipRoles(membership, requiredRoles);
  }

  async hasTeamAccess(
    userId: number,
    teamId: number,
    requiredRoles?: TeamRole[],
  ): Promise<boolean> {
    const membership = await this.prismaService.db.orm.public.TeamMember.where({
      userId: userId,
      teamId: teamId,
    }).first();

    return this.checkMembershipRoles(membership, requiredRoles);
  }

  async validateProjectAccess(
    userId: number,
    projectId: number,
    requiredRoles?: TeamRole[],
  ): Promise<void> {
    const hasAccess = await this.hasProjectAccess(
      userId,
      projectId,
      requiredRoles,
    );
    if (!hasAccess) {
      throw new ForbiddenException('You do not have access to this project.');
    }
  }
  async validateTeamAccess(
    userId: number,
    teamId: number,
    requiredRoles?: TeamRole[],
  ): Promise<void> {
    const hasAccess = await this.hasTeamAccess(userId, teamId, requiredRoles);
    if (!hasAccess) {
      throw new ForbiddenException('You are not a part of this team');
    }
  }

  async canManageProjectResources(
    userId: number,
    projectId: number,
    resourceAuthorId: number,
  ): Promise<boolean> {
    const isAdmin = await this.hasProjectAccess(userId, projectId, [
      getAdminRole(),
    ]);
    const isOwner = resourceAuthorId === userId;

    return isAdmin || isOwner;
  }

  async canManageTeamResources(
    userId: number,
    teamId: number,
    resourceAuthorId: number,
  ): Promise<boolean> {
    const isAdmin = await this.hasProjectAccess(userId, teamId, [
      getAdminRole(),
    ]);
    const isOwner = resourceAuthorId === userId;

    return isAdmin || isOwner;
  }

  private checkMembershipRoles(
    membership: TeamMember | null,
    requiredRoles?: TeamRole[],
  ): boolean {
    if (!membership) {
      return false;
    }

    if (!requiredRoles || requiredRoles.length == 0) {
      return true;
    }

    return requiredRoles.includes(membership.role);
  }
}
