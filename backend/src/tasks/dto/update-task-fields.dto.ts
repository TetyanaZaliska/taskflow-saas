import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';
import { ToOptionalInt } from '../../decorators/to-optional-int.decorator';
import { TaskPriorityMap, TaskStatusMap } from '../../common/constants/enums';
import type { TaskPriority, TaskStatus } from '../../common/interfaces/enums';

export class UpdateTaskFieldsDto {
  @IsString()
  @Length(2, 100)
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatusMap)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriorityMap)
  @IsOptional()
  priority?: TaskPriority;

  @ToOptionalInt()
  @IsInt()
  @IsOptional()
  assigneeId?: number | null;
}
