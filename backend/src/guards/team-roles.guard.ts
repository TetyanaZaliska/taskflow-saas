import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { TeamRole } from '@prisma/client';
import { TEAM_ROLES_KEY } from '../constants/constants';
import { PermissionsService } from '../permissions/permissions.service';
import { Request } from 'express';
import { TokenPayload } from '../auth/token-payload.interface';

@Injectable()
export class TeamRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: TokenPayload }>();
    const user = request.user;

    const teamId = Number(request.params.teamId); // || request.headers['x-team-id'];

    if (!user || !user.userId || isNaN(teamId)) {
      throw new ForbiddenException('No team!');
    }
    const requiredRoles = this.reflector.getAllAndOverride<TeamRole[]>(
      TEAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    await this.permissionsService.validateTeamAccess(
      user.userId,
      teamId,
      requiredRoles,
    );

    return true;
  }
}
