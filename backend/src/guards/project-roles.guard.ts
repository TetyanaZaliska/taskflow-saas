import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
import { TeamRole } from '@prisma/client';
import { TEAM_ROLES_KEY } from '../constants/constants';

@Injectable()
export class ProjectRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const projectId = Number(request.params.projectId);

    if (!user || isNaN(projectId)) {
      throw new ForbiddenException('You have no rights!');
    }

    const membership = await this.prismaService.teamMember.findFirst({
      where: {
        userId: user.userId,
        team: {
          projects: {
            some: { id: projectId },
          },
        },
      },
    });

    if (!membership) {
      throw new ForbiddenException('You have no access to the project.');
    }

    const requiredRoles = this.reflector.getAllAndOverride<TeamRole[]>(
      TEAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    const hasRequiredRole = requiredRoles.includes(membership.role);

    if (!hasRequiredRole) {
      throw new ForbiddenException('Not enough rights!');
    }

    return true;
  }
}
