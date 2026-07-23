import { routes } from "@/app/common/constants/routes";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import { TaskDetails } from "./components/task-details";
import getProjectTaskWithMembers from "./actions/get-project-task-with-members";

interface SingleTaskProps {
  params: Promise<{ projectSlug: string; taskSlug: string }>;
}

export default async function SingleTask({ params }: SingleTaskProps) {
  const projectSlug = (await params).projectSlug;
  const projectId = parseInt(projectSlug.split("-")[0], 10);
  const taskSlug = (await params).taskSlug;
  const taskId = parseInt(taskSlug.split("-")[0], 10);

  // const task = await getProjectTask(projectId, taskId);
  // assertNoErrors(task, routes.app.projectTasks(projectId));
  // const members = await getMembers(task.project.teamId);
  // assertNoErrors(members, routes.app.projectTasks(projectId));

  const task = await getProjectTaskWithMembers(projectId, taskId);
  assertNoErrors(task, routes.app.projectTasks(projectId));

  return <TaskDetails task={task} initialMembers={task.project.team.members} />;
}
