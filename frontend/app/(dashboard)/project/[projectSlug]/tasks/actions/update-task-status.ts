"use server";

import { routes } from "@/app/common/constants/routes";
import { getErrorMessage } from "@/app/common/util/errors";
import { update } from "@/app/common/util/fetch";
import { getRouteName } from "@/app/common/util/get-route-name";
import { revalidatePath } from "next/cache";

export default async function updateTask(
  projectId: number,
  taskId: number,
  formData: FormData,
) {
  let response;
  try {
    response = await update(
      `${getRouteName(routes.app.projectTasks(projectId))}/${taskId}/status`,
      formData,
    );
    revalidatePath(getRouteName(routes.app.projectTasks(projectId)));
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  return response;
}
