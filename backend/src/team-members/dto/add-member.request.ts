import { TeamRole } from '@prisma/client';
import { IsEnum, IsInt } from 'class-validator';

export class AddMemberRequest {
  @IsInt()
  userId!: number;

  @IsEnum(TeamRole)
  role!: TeamRole;
}
