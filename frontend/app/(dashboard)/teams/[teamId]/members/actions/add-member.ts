"use server";

import { post } from "@/app/common/util/fetch";
import { revalidateTag, updateTag } from "next/cache";

export default async function addMember(teamId: number, formData: FormData) {
  //const teamId = Number(formData.get("teamId"));
  if (Number.isNaN(teamId)) {
    return { error: "Invalid team id" };
  }

  console.log(formData);

  const response = await post(`teams/${teamId}/members`, formData);
  if (!response.error) {
    updateTag(`team-${teamId}-members`);
  }
  return response;
}
