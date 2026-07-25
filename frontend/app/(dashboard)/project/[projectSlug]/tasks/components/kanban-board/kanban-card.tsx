"use client";

import { useDraggable } from "@dnd-kit/react";
import { Task } from "../../interfaces/task.interface";
import TaskRow from "../show-tasks/task-row";

interface KanbanCardProps {
  task: Task;
  projectSlug: string;
}

export function KanbanCard({ task, projectSlug }: KanbanCardProps) {
  const { ref } = useDraggable({
    id: task.id,
  });

  return <TaskRow ref={ref} task={task} projectSlug={projectSlug} />;
}
