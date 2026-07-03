"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Project } from "../../interfaces/project.interface";
import removeProject from "../../actions/remove-project";
import { useRouter } from "next/navigation";
import { routes } from "@/app/common/constants/routes";
import { toSlug } from "@/app/common/util/to-slug";

interface ProjectRowProps {
  project: Project;
  teamId: number;
}

export default function ProjectRow({ project, teamId }: ProjectRowProps) {
  const router = useRouter();

  const handleRouteUser = () =>
    router.push(routes.app.project(`${project.id}-${toSlug(project.name)}`));

  const handleRemove = async () => {
    const res = await removeProject(teamId, project.id);

    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
    } else {
      toast.success("Project was deleted!", { position: "top-right" });
    }
  };

  return (
    <TableRow
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell
        onClick={handleRouteUser}
        className="font-medium max-w-[150px] truncate ml-auto"
        title={project.name ?? ""}
      >
        {project.name}
      </TableCell>
      <TableCell
        onClick={handleRouteUser}
        className="text-right"
        title={project.description ?? ""}
      >
        <div className="max-w-[150px] truncate ml-auto">
          {project.description || "-"}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <Button onClick={handleRemove} variant="destructive" className="w-min">
          <Trash2 className="h-4 w-4" />
        </Button>
      </TableCell>
    </TableRow>
  );
}
