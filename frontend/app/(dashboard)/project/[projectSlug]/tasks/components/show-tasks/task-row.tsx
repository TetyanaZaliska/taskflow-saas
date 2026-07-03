"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/common/constants/routes";
import { toast } from "sonner";
import { Task } from "../../interfaces/task.interface";

interface TaskRowProps {
  task: Task;
}

export default function TaskRow({ task }: TaskRowProps) {
  //const router = useRouter();

  //const handleRouteUser = () =>
  //  router.push(`${routes.app.teamMembers(member.teamId)}/${member.user.id}`);

  //const handleRemove = async () => {
  //  const res = await removeMember(member.teamId, member.user.id);
  //
  //  if (res?.error) {
  //    toast.error(res.error, { position: "top-right" });
  //  } else {
  //    toast.success("Team member was deleted!", { position: "top-right" });
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
        <Button variant="destructive" className="w-min">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
