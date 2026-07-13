import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamRole } from '@prisma/client';

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

    if (!membership) {
      return false;
    }

    if (!requiredRoles || requiredRoles.length == 0) {
      return true;
    }

    return requiredRoles.includes(membership.role);
  }

  async validateProjectAccess(
    userId: number,
    projectId: number,
  ): Promise<void> {
    const hasAccess = await this.hasProjectAccess(userId, projectId);
    if (!hasAccess) {
      throw new ForbiddenException(
        'You do not have access to this project or you are not a member of the team.',
      );
    }
  }

  async canManageResources(
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
}
