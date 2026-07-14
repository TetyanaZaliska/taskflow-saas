import { TASK_PRIORITY } from "@/app/common/constants/task-priority";
import { TASK_STATUS } from "@/app/common/constants/task-status";

export type TaskStatus = (typeof TASK_STATUS)[keyof typeof TASK_STATUS];
export type TaskPriority = (typeof TASK_PRIORITY)[keyof typeof TASK_PRIORITY];

export interface Task {
  id: number;
  keyNumber: number;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId: number;
  assigneeId: number;
  authorId: number;
  createdAt: string;
  updatedAt: string;
}
