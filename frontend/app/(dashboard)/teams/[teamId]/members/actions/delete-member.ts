"use server";

import { routes } from "@/app/common/constants/routes";
import { getErrorMessage } from "@/app/common/util/errors";
import { remove } from "@/app/common/util/fetch";
import { getRouteName } from "@/app/common/util/get-route-name";
import { revalidatePath } from "next/cache";

export default async function deleteMember(teamId: number, memberId: number) {
  let response;
  try {
    response = await remove(
      `${getRouteName(routes.app.teamMembers(teamId))}/${memberId}`,
    );
    revalidatePath(getRouteName(routes.app.teamMembers(teamId)));
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  return response;
}
