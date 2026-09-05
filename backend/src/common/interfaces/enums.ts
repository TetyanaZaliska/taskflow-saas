import type { FieldOutputTypes } from '../../prisma/contract';

export type TaskStatus = FieldOutputTypes['public']['Task']['status'];
export type TaskPriority = FieldOutputTypes['public']['Task']['priority'];
export type TeamRole = FieldOutputTypes['public']['TeamMember']['role'];
