// team-roles.decorator.ts
import { SetMetadata } from '@nestjs/common';
import { TEAM_ROLES_KEY } from '../common/constants/constants';
import { TeamRole } from '../common/interfaces/enums';

export const TeamRoles = (...roles: TeamRole[]) =>
  SetMetadata(TEAM_ROLES_KEY, roles);
