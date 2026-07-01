"use server";

import { routes } from "@/app/common/constants/routes";
import { getErrorMessage } from "@/app/common/util/errors";
import { remove } from "@/app/common/util/fetch";
import { getRouteName } from "@/app/common/util/get-route-name";
import { revalidatePath } from "next/cache";

export default async function removeTeam(teamId: number) {
  let response;
  try {
    response = await remove(getRouteName(routes.app.team(teamId)));
    revalidatePath(getRouteName(routes.app.team(teamId)));
    console.log(response);
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  return response;
}
