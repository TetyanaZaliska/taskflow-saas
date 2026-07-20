"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Task } from "../../interfaces/task.interface";
import { ButtonDelete } from "@/components/custom/button-delete";
import removeTask from "../../actions/remove-task";
import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
import { AlertCircle } from "lucide-react";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { formatDate } from "@/app/common/util/format-date";
import updateTask from "../../actions/update-task";
import { useActionNotify } from "@/hooks/use-activity-notify";
import { TaskFieldDropdown } from "./task-field-dropdown";
import { routes } from "@/app/common/constants/routes";
import { toSlug } from "@/app/common/util/to-slug";
import Link from "next/link";

interface TaskRowProps {
  task: Task;
  projectSlug: string;
}

export default function TaskRow({ task, projectSlug }: TaskRowProps) {
  const { handleResult } = useActionNotify();

  const handleRemoveTask = async () => {
    const res = await removeTask(task.projectId, task.id);

    handleResult(res, "Task was successfully deleted!");
  };

  const handleUpdateFields = async (formData: FormData) => {
    const res = await updateTask(task.projectId, task.id, formData);

    handleResult(res);
  };

  const taskLink = `${routes.app.projectTasks(projectSlug)}/${task.id}-${toSlug(task.title)}`;

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell className="font-medium">
        <TaskFieldDropdown
          currentValue={task.priority}
          options={TASK_PRIORITY_LIST}
          fieldName="priority"
          onUpdate={handleUpdateFields}
          defaultIcon={AlertCircle}
        />
      </TableCell>
      <TableCell className="text-right text-muted-foreground">{`TSK-${task.keyNumber}`}</TableCell>
      <TableCell className="font-medium">
        <TaskFieldDropdown
          currentValue={task.status}
          options={TASK_STATUS_LIST}
          fieldName="status"
          onUpdate={handleUpdateFields}
          defaultIcon={AlertCircle}
        />
      </TableCell>
      <TableCell className="font-medium">
        <Link href={taskLink}>{task.title}</Link>
      </TableCell>
      <TableCell className="text-right">{formatDate(task.createdAt)}</TableCell>
      <TableCell className="text-right">
        <ButtonDelete onClick={handleRemoveTask} />
      </TableCell>
    </TableRow>
  );
}
