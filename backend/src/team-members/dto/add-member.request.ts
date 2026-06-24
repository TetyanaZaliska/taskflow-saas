import { TeamRole } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt } from 'class-validator';

export class AddMemberRequest {
  @Type(() => Number)
  @IsInt()
  userId!: number;

  @IsEnum(TeamRole)
  role!: TeamRole;
}
