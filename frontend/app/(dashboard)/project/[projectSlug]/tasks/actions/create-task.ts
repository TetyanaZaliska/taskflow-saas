"use server";

import { routes } from "@/app/common/constants/routes";
import { post } from "@/app/common/util/fetch";
import { getRouteName } from "@/app/common/util/get-route-name";
import { revalidateTag, updateTag } from "next/cache";

export default async function createTask(
  projectId: number,
  formData: FormData,
) {
  //const teamId = Number(formData.get("teamId"));
  if (Number.isNaN(projectId)) {
    return { error: "Invalid project id" };
  }

  const response = await post(
    getRouteName(routes.app.projectTasks(projectId)),
    formData,
  );
  if (!response.error) {
    updateTag(`project-${projectId}-tasks`);
  }
  return response;
}
