import { routes } from "@/app/common/constants/routes";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import { redirect } from "next/navigation";
import { CreateTaskModal } from "./components/create-task/create-task-modal";
import getProjectWithMembers from "../actions/get-project-with-members";
import { FormError } from "@/components/custom/form-error";
import getTasks from "./actions/get-tasks";

interface TasksProps {
  params: Promise<{ projectSlug: string }>;
}

export default async function Tasks({ params }: TasksProps) {
  const projectSlug = (await params).projectSlug;
  const projectId = parseInt(projectSlug.split("-")[0], 10);

  if (isNaN(projectId)) {
    redirect(routes.app.project(projectId));
  }

  const [projectWithMembers, tasks] = await Promise.all([
    getProjectWithMembers(projectId),
    getTasks(projectId),
  ]);

  assertNoErrors(projectWithMembers, routes.app.projectTasks(projectId));
  const hasTasksError = tasks && "error" in tasks;

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {projectWithMembers.name}
      </h2>
      <CreateTaskModal
        projectId={projectId}
        initialMembers={projectWithMembers.team.members}
      />
      <TasksTable projectSlug={projectSlug} />
    </>
  );
}
