import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ToOptionalInt } from '../../decorators/to-optional-int.decorator';
import {
  TaskPriorityValues,
  TaskStatusValues,
} from '../../common/constants/enums';
import type { TaskPriority, TaskStatus } from '../../common/interfaces/enums';

export class CreateTaskRequest {
  @IsString()
  @Length(2, 100)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatusValues)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriorityValues)
  @IsOptional()
  priority?: TaskPriority;

  @ToOptionalInt()
  @IsInt()
  @IsOptional()
  assigneeId?: number | null;
}
