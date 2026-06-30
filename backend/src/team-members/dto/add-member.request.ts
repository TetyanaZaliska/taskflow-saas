import { TeamRole } from '@prisma/client';
import { IsEmail, IsEnum } from 'class-validator';

export class AddMemberRequest {
  @IsEmail()
  email!: string;

  @IsEnum(TeamRole)
  role!: TeamRole;
}
