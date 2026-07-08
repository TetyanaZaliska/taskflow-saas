"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/common/constants/routes";
import { toast } from "sonner";
import { Task } from "../../interfaces/task.interface";
import { ButtonDelete } from "@/components/custom/button-delete";

interface TaskRowProps {
  task: Task;
}

export default function TaskRow({ task }: TaskRowProps) {
  //const router = useRouter();

  //const handleRouteUser = () =>
  //  router.push(`${routes.app.teamMembers(member.teamId)}/${member.user.id}`);

  //const handleRemoveTask = async () => {
  //  const res = await removeTask(member.teamId, member.user.id);
  //
  //  if (res?.error) {
  //    toast.error(res.error, { position: "top-right" });
  //  } else {
  //    toast.success("Task was successfully deleted!", { position: "top-right" });
  //  }
  //};

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell className="font-medium">{task.priority}</TableCell>
      <TableCell className="font-medium">{task.title}</TableCell>
      <TableCell className="font-medium">{task.status}</TableCell>
      <TableCell className="text-right">{task.authorId}</TableCell>
      <TableCell className="text-right">{task.createdAt}</TableCell>
      <TableCell className="text-right">
        <ButtonDelete />
      </TableCell>
    </TableRow>
  );
}
