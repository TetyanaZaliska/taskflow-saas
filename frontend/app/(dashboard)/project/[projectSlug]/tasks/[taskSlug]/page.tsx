import { routes } from "@/app/common/constants/routes";
import { assertNoErrors } from "@/app/common/util/error-redirect";
import getTask from "./actions/get-task";
import { TaskDetails } from "./components/task-details";

interface SingleTaskProps {
  params: Promise<{ projectSlug: string; taskSlug: string }>;
}

export default async function SingleTask({ params }: SingleTaskProps) {
  const projectSlug = (await params).projectSlug;
  const projectId = parseInt(projectSlug.split("-")[0], 10);
  const taskSlug = (await params).taskSlug;
  const taskId = parseInt(taskSlug.split("-")[0], 10);

  const task = await getTask(projectId, taskId);

  assertNoErrors(task, routes.app.projectTasks(projectId));

  return <TaskDetails task={task} />;
}
