import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { Task } from "../../interfaces/task.interface";

export default async function getTask(projectId: number, taskId: number) {
  return get<Task>(`${routes.app.projectTasks(projectId)}/${taskId}`);
}
