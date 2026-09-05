import { db } from '../../prisma/db';
import { TaskPriority, TaskStatus } from '../interfaces/enums';

export const TaskStatusMap = db.nativeEnums.public.TaskStatus.values;
export const TaskPriorityMap = db.nativeEnums.public.TaskPriority.values;

export const TaskStatusValues = Object.keys(TaskStatusMap) as TaskStatus[];
export const TaskPriorityValues = Object.keys(
  TaskPriorityMap,
) as TaskPriority[];
