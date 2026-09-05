import { IsEmail, IsEnum } from 'class-validator';
import { type TeamRole } from '../../common/interfaces/enums';
import { TeamRoleMap } from '../../common/constants/enums';

export class AddMemberRequest {
  @IsEmail()
  email!: string;

  @IsEnum(TeamRoleMap)
  role!: TeamRole;
}
