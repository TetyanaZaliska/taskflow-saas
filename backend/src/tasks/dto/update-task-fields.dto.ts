import { TaskPriority, TaskStatus } from '@prisma/client';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ToOptionalInt } from '../../decorators/to-optional-int.decorator';

export class UpdateTaskFieldsDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ToOptionalInt()
  @IsInt()
  @IsOptional()
  assigneeId?: number;
}
