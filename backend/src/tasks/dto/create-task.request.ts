import { TaskPriority, TaskStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Length } from 'class-validator';

export class CreateTaskRequest {
  @IsString()
  @Length(2, 100)
  title!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(TaskStatus as Record<string, string>)
  @IsOptional()
  status?: TaskStatus;

  @IsEnum(TaskPriority as Record<string, string>)
  @IsOptional()
  priority?: TaskPriority;

  @Transform(({ value }: { value: unknown }) => {
    if (value === '' || value === null || value === 'null') return undefined;

    const stringValue = value as string;
    const parsed = parseInt(stringValue, 10);
    return isNaN(parsed) ? stringValue : parsed;
  })
  @IsInt()
  @IsOptional()
  assigneeId?: number;
}
