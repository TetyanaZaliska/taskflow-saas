// team-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { TeamRole } from '@prisma/client'; // або ваш Enum
import { TEAM_ROLES_KEY } from '../constants/constants';

export const TeamRoles = (...roles: TeamRole[]) =>
  SetMetadata(TEAM_ROLES_KEY, roles);
