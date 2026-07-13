import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamMember, TeamRole } from '@prisma/client';

@Injectable()
export class PermissionsService {
  constructor(private readonly prismaService: PrismaService) {}

  async hasProjectAccess(
    userId: number,
    projectId: number,
    requiredRoles?: TeamRole[],
  ): Promise<boolean> {
    const membership = await this.prismaService.teamMember.findFirst({
      where: {
        userId,
        team: {
          projects: {
            some: { id: projectId },
          },
        },
      },
    });

    return this.checkMembershipRoles(membership, requiredRoles);
  }

  async hasTeamAccess(
    userId: number,
    teamId: number,
    requiredRoles?: TeamRole[],
  ): Promise<boolean> {
    const membership = await this.prismaService.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: userId,
          teamId: teamId,
        },
      },
    });

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
    const roles = TeamRole as Record<string, string>;
    const isAdmin = await this.hasProjectAccess(userId, projectId, [
      roles.ADMIN as TeamRole,
    ]);
    const isOwner = resourceAuthorId === userId;

    return isAdmin || isOwner;
  }

  async canManageTeamResources(
    userId: number,
    teamId: number,
    resourceAuthorId: number,
  ): Promise<boolean> {
    const roles = TeamRole as Record<string, string>;
    const isAdmin = await this.hasProjectAccess(userId, teamId, [
      roles.ADMIN as TeamRole,
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
