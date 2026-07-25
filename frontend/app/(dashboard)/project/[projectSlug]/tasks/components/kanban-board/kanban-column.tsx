"use client";

import { useDroppable } from "@dnd-kit/react";
import { Task, TaskStatus } from "../../interfaces/task.interface";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { KanbanCard } from "./kanban-card";
import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

interface KanbanColumnProps {
  taskStatus: TaskStatus;
  tasks: Task[];
  projectSlug: string;
}

export function KanbanColumn({
  taskStatus,
  tasks,
  projectSlug,
}: KanbanColumnProps) {
  const { ref, isDropTarget } = useDroppable({
    id: taskStatus,
  });

  const taskOptions = TASK_STATUS_LIST.find(
    (item) => item.value === taskStatus,
  );
  const TaskIcon = taskOptions?.icon ?? AlertCircle;

  return (
    <div className={isDropTarget ? "droppable active" : "droppable"}>
      <Table ref={ref}>
        <TableHeader>
          <TableRow>
            <TableHead
              colSpan={6}
              className="bg-white dark:bg-zinc-800 border-l-4  shadow-md"
            >
              <div className="flex items-center gap-2">
                <TaskIcon
                  className={cn("h-4 w-4  shrink-0", taskOptions?.color)}
                />
                <span className="text-sm font-medium leading-none text-foreground">
                  {taskOptions?.label}
                </span>
              </div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task: Task) => (
            <KanbanCard key={task.id} task={task} projectSlug={projectSlug} />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
