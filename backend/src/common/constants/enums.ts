import contract from '../../prisma/contract.json' with { type: 'json' };
import { TaskPriority, TaskStatus } from '../interfaces/enums';

const statusMap =
  contract.storage.namespaces.public.entries.valueSet.TaskStatus;
const priorityMap =
  contract.storage.namespaces.public.entries.valueSet.TaskPriority;

export const TaskStatusValues = Object.keys(statusMap) as TaskStatus[];
export const TaskPriorityValues = Object.keys(priorityMap) as TaskPriority[];
