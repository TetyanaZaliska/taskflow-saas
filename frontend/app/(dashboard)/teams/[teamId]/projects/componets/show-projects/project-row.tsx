"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Project } from "../../interfaces/project.interface";
import removeProject from "../../actions/remove-project";
import { useRouter } from "next/navigation";
import { routes } from "@/app/common/constants/routes";
import { toSlug } from "@/app/common/util/to-slug";
import { ButtonDelete } from "@/components/custom/button-delete";
import { MouseEvent } from "react";

interface ProjectRowProps {
  project: Project;
  teamId: number;
}

export default function ProjectRow({ project, teamId }: ProjectRowProps) {
  const router = useRouter();

  const handleRouteUser = () =>
    router.push(routes.app.project(`${project.id}-${toSlug(project.name)}`));

  const handleRemoveProject = async (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const res = await removeProject(teamId, project.id);

    if (res?.error) {
      toast.error(res.error, { position: "top-right" });
    } else {
      toast.success("Project was deleted!", { position: "top-right" });
      router.refresh();
    }
  };

  return (
    <TableRow
      onClick={handleRouteUser}
      className={cn("cursor-pointer hover:bg-muted/50 transition-colors")}
    >
      <TableCell
        className="font-medium max-w-[150px] truncate ml-auto"
        title={project.name ?? ""}
      >
        {project.name}
      </TableCell>
      <TableCell className="text-right" title={project.description ?? ""}>
        <div className="max-w-[150px] truncate ml-auto">
          {project.description || "-"}
        </div>
      </TableCell>
      <TableCell className="text-right">
        <ButtonDelete onClick={handleRemoveProject} />
      </TableCell>
    </TableRow>
  );
}
