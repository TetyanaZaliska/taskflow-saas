import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { TaskWithProject } from "../../interfaces/task.interface";

export default async function getTask(projectId: number, taskId: number) {
  return get<TaskWithProject>(
    `${routes.app.projectTasks(projectId)}/${taskId}`,
  );
}
