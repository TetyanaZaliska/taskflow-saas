import { IsString, Length } from 'class-validator';

export class CreateTeamRequest {
  @IsString()
  @Length(2, 100)
  name!: string;
}
