"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Task } from "../../interfaces/task.interface";
import { ButtonDelete } from "@/components/custom/button-delete";
import removeTask from "../../actions/remove-task";
import { TASK_PRIORITY_LIST } from "@/app/common/constants/task-priority";
import { AlertCircle } from "lucide-react";
import { TASK_STATUS_LIST } from "@/app/common/constants/task-status";
import { formatDate } from "@/app/common/util/format-date";

interface TaskRowProps {
  task: Task;
}

export default function TaskRow({ task }: TaskRowProps) {
  //const router = useRouter();

  //const handleRouteUser = () =>
  //  router.push(`${routes.app.projectTasks(member.teamId)}/${member.user.id}`);

  const handleRemoveTask = async () => {
    const res = await removeTask(task.projectId, task.id);

    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
    } else {
      toast.success("Task was successfully deleted!", {
        position: "top-right",
      });
    }
  };

  const taskPriorityItem = TASK_PRIORITY_LIST.find(
    (p) => p.value === task.priority,
  );
  const taskStatusItem = TASK_STATUS_LIST.find((s) => s.value === task.status);

  const PriorityIcon = taskPriorityItem?.icon || AlertCircle;
  const StatusIcon = taskStatusItem?.icon || AlertCircle;

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell className="font-medium">
        <PriorityIcon className="h-4 w-4 text-muted-foreground" />
      </TableCell>
      <TableCell className="text-right text-muted-foreground">{`TSK-${task.keyNumber}`}</TableCell>
      <TableCell className="font-medium">
        <StatusIcon
          className={cn("h-4 w-4 text-muted-foreground", taskStatusItem?.color)}
        />
      </TableCell>
      <TableCell className="font-medium">{task.title}</TableCell>
      <TableCell className="text-right">{formatDate(task.createdAt)}</TableCell>
      <TableCell className="text-right">
        <ButtonDelete onClick={handleRemoveTask} />
      </TableCell>
    </TableRow>
  );
}
