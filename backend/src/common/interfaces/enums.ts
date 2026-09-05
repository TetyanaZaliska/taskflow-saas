import type { FieldOutputTypes } from '../../prisma/contract';

// 1. Експортуємо чисті TypeScript типи для сервісів
export type TaskStatus = FieldOutputTypes['public']['Task']['status'];
export type TaskPriority = FieldOutputTypes['public']['Task']['priority'];
