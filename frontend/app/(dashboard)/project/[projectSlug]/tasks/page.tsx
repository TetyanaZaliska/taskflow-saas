import { routes } from "@/app/common/constants/routes";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import { redirect } from "next/navigation";
import getProject from "../actions/get-project";
import TasksTable from "./components/show-tasks/tasks-table";
import { CreateTaskModal } from "./components/create-task/create-task-modal";
import getMembers from "@/app/(dashboard)/teams/[teamId]/members/actions/get-members";

interface TasksProps {
  params: Promise<{ projectSlug: string }>;
}

export default async function Tasks({ params }: TasksProps) {
  const projectSlug = (await params).projectSlug;
  const projectId = parseInt(projectSlug.split("-")[0], 10);

  if (isNaN(projectId)) {
    redirect(routes.app.project(projectId));
  }

  const project = await getProject(projectId);
  assertNoErrors(project, routes.app.projectTasks(projectId));

  const members = await getMembers(project.teamId);
  assertNoErrors(members, routes.app.projectTasks(projectId));

  return (
    <>
      <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        {project.name}
      </h2>
      <CreateTaskModal projectId={projectId} initialMembers={members} />
      <TasksTable projectSlug={projectSlug} />
    </>
  );
}
