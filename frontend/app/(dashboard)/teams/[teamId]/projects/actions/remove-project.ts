"use server";

import { routes } from "@/app/common/constants/routes";
import { getErrorMessage } from "@/app/common/util/errors";
import { remove } from "@/app/common/util/fetch";
import { getRouteName } from "@/app/common/util/get-route-name";
import { revalidatePath } from "next/cache";

export default async function removeProject(teamId: number, projectId: number) {
  let response;
  try {
    response = await remove(
      `${getRouteName(routes.app.teamProjects(teamId))}/${projectId}`,
    );
    revalidatePath(getRouteName(routes.app.teamProjects(teamId)));
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  return response;
}
