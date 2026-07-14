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
export class ProjectRolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionsService: PermissionsService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user?: TokenPayload }>();
    const user = request.user;

    const projectId = Number(request.params.projectId);

    if (!user || !user.userId || isNaN(projectId)) {
      throw new ForbiddenException('You have no rights!');
    }

    const requiredRoles = this.reflector.getAllAndOverride<TeamRole[]>(
      TEAM_ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    await this.permissionsService.validateProjectAccess(
      user.userId,
      projectId,
      requiredRoles,
    );

    return true;
  }
}
