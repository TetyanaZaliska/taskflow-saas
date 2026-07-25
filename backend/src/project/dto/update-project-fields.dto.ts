import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateProjectFields {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
