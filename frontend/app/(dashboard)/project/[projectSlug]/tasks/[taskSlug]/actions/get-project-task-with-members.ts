import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { TaskWithProjectAndMembers } from "../../interfaces/task.interface";

export default async function getProjectTaskWithMembers(
  projectId: number,
  taskId: number,
) {
  return get<TaskWithProjectAndMembers>(
    `${routes.app.projectTasks(projectId)}/${taskId}/with-members`,
  );
}
