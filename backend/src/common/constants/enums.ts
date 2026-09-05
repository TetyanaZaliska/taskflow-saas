import { db } from '../../prisma/db';
import { TaskPriority, TaskStatus, TeamRole } from '../interfaces/enums';

export const TaskStatusMap = db.nativeEnums.public.TaskStatus.values;
export const TaskPriorityMap = db.nativeEnums.public.TaskPriority.values;
export const TeamRoleMap = db.nativeEnums.public.TeamRole.values;

export const TaskStatusValues = Object.keys(TaskStatusMap) as TaskStatus[];
export const TaskPriorityValues = Object.keys(
  TaskPriorityMap,
) as TaskPriority[];
export const TeamRoleValues = Object.keys(TeamRoleMap) as TeamRole[];

export function getAdminRole() {
  const adminRole = db.nativeEnums.public.TeamRole.nameOf('ADMIN') as TeamRole;
  return adminRole;
}
export function getMemberRole() {
  const memberRole = db.nativeEnums.public.TeamRole.nameOf(
    'MEMBER',
  ) as TeamRole;
  return memberRole;
}
