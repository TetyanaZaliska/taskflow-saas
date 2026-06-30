"use server";

import { routes } from "@/app/common/constants/routes";
import { post } from "@/app/common/util/fetch";
import { revalidateTag, updateTag } from "next/cache";

export default async function createTeam(formData: FormData) {
  const response = await post(routes.app.teams, formData);
  if (!response.error) {
    updateTag("teams");
  }
  return response;
}
