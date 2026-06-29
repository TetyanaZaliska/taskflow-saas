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
export class TeamRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    const teamId = Number(request.params.teamId); // || request.headers['x-team-id'];

    console.log('--- GUARD ACCESS DEBUG ---');
    console.log('Raw teamId param from URL:', teamId);
    console.log('Raw userId param from URL:', user.userId);

    if (!user || isNaN(teamId)) {
      throw new ForbiddenException('No team!');
    }

    const membership = await this.prismaService.teamMember.findUnique({
      where: {
        userId_teamId: {
          userId: user.userId,
          teamId: teamId,
        },
      },
    });

    console.log('--- PASS membership ID ---');

    if (!membership) {
      throw new ForbiddenException('You are not a part of this team');
    }

    const requiredRoles = this.reflector.getAllAndOverride<TeamRole[]>(
      TEAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      console.log('No roles required, skipping check.');
      return true;
    }

    return requiredRoles.includes(membership.role);
  }
}
