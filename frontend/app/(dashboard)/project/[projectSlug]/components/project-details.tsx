"use client";

import { useActionNotify } from "@/hooks/use-activity-notify";
import { formatDate } from "@/app/common/util/format-date";
import { Project } from "../interfaces/project.interface";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { AutoSaveTextarea } from "@/components/custom/auto-save-textarea";
import updateProject from "../actions/update-project";

interface ProjectDetailsProps {
  project: Project;
  taskLink: string;
}

export function ProjectDetails({ project, taskLink }: ProjectDetailsProps) {
  const { handleResult } = useActionNotify();

  const handleUpdateFields = async (formData: FormData) => {
    const res = await updateProject(project.id, formData);
    handleResult(res);
  };

  return (
    <>
      <AutoSaveTextarea
        className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0"
        initialValue={project.name}
        fieldName="name"
        onUpdate={handleUpdateFields}
      />

      <AutoSaveTextarea
        initialValue={project.description}
        fieldName="description"
        onUpdate={handleUpdateFields}
      />

      <div className="flex justify-between w-full border-b border-t">
        <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
          Updated: {formatDate(project.updatedAt, true)}
        </h4>
        <h4 className="scroll-m-20 font-semibold tracking-tight text-muted-foreground">
          Created: {formatDate(project.createdAt, true)}
        </h4>
      </div>

      <Button variant="outline" className="w-full" asChild>
        {/* prefetch={false} prevents background prefetch from canceling input requestSubmit onBlur */}
        <Link href={taskLink} prefetch={false}>
          Tasks
        </Link>
      </Button>
    </>
  );
}
