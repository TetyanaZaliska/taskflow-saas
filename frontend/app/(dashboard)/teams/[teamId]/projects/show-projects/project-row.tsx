"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { routes } from "@/app/common/constants/routes";
import { toast } from "sonner";
import { Project } from "../interfaces/project.interface";

interface ProjectRowProps {
  project: Project;
}

export default function ProjectRow({ project }: ProjectRowProps) {
  //const handleRemove = async () => {
  //  const res = await removeProject(project.id)

  //   if (res?.error) {
  //     toast.error(res.error, { position: "top-right" });
  //   } else {
  //     toast.success("Team member was deleted!", { position: "top-right" });
  //   }
  // };

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell className="font-medium">{project.name}</TableCell>
      <TableCell className="text-right" title={project.description ?? ""}>
        <div className="max-w-[150px] truncate ml-auto">
          {project.description || "-"}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button variant="destructive" className="w-min">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
