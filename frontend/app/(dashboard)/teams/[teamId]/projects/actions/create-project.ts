"use server";

import { routes } from "@/app/common/constants/routes";
import { post } from "@/app/common/util/fetch";
import { revalidateTag, updateTag } from "next/cache";

export default async function createProject(
  teamId: number,
  formData: FormData,
) {
  if (Number.isNaN(teamId)) {
    return { error: "Invalid team id" };
  }
  const response = await post(routes.app.teamProjects(teamId), formData);

  if (!response.error) {
    updateTag(`teams-${teamId}-projects`);
  }
  return response;
}
