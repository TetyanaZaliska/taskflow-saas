import { IsString, Length } from 'class-validator';

export class CreateProjectRequest {
  @IsString()
  @Length(2, 100)
  name!: string;

  @IsString()
  description?: string;
}
