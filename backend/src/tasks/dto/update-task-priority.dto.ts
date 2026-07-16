import { TaskPriority } from '@prisma/client';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class UpdateTaskPriorityDto {
  @IsNotEmpty()
  @IsEnum(TaskPriority)
  status!: TaskPriority;
}
