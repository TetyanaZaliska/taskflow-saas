"use server";

import { get } from "@/app/common/util/fetch";
import { routes } from "@/app/common/constants/routes";
import { Task } from "../interfaces/task.interface";

export default async function getTasks(projectId: number) {
  const response = await get<Task[]>(routes.app.projectTasks(projectId), [
    `project-${projectId}-tasks`,
  ]);

  return response;
}
