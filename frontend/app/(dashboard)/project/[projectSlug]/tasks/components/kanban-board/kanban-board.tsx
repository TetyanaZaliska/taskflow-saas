"use client";

import { Task, TaskStatus } from "../../interfaces/task.interface";
import { TASK_STATUS } from "@/app/common/constants/task-status";
import { KanbanColumn } from "./kanban-column";
import { useOptimistic, useTransition } from "react";
import { DragDropProvider } from "@dnd-kit/react";
import { useActionNotify } from "@/hooks/use-activity-notify";
import updateTask from "../../actions/update-task";

interface KnabanBoardProps {
  projectSlug: string;
  tasks: Task[];
}

export function KanbanBoard({
  projectSlug,
  tasks: initialTasks,
}: KnabanBoardProps) {
  //const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const { handleResult } = useActionNotify();
  const [isPending, startTransition] = useTransition();

  const [optimisticTasks, setOptimisticTasks] = useOptimistic(
    initialTasks,
    (state, updatedTask: { id: number; status: TaskStatus }) => {
      return state.map((task) =>
        task.id === updatedTask.id
          ? { ...task, status: updatedTask.status }
          : task,
      );
    },
  );

  const projectId = parseInt(projectSlug.split("-")[0], 10);

  return (
    <DragDropProvider
      onDragEnd={async (event) => {
        if (event.canceled) return;
        const taskId = event.operation.source?.id as number;
        const newStatus = event.operation.target?.id as TaskStatus;

        if (!taskId || !newStatus) return;

        const draggedTask = optimisticTasks.find((task) => task.id == taskId);
        if (!draggedTask || draggedTask.status === newStatus) return;

        startTransition(async () => {
          setOptimisticTasks({ id: taskId, status: newStatus });

          const formData = new FormData();
          formData.append("status", newStatus);

          const res = await updateTask(projectId, taskId, formData);

          if (res && "error" in res) {
            handleResult(res);
          }
        });
      }}
    >
      {Object.values(TASK_STATUS).map((status) => {
        const filteredTasks = optimisticTasks.filter(
          (task) => task.status === status,
        );

        return (
          <KanbanColumn
            key={status}
            taskStatus={status}
            projectSlug={projectSlug}
            tasks={filteredTasks}
          />
        );
      })}
    </DragDropProvider>
  );
}
