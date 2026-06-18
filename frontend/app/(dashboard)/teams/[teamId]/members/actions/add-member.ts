"use server";

import { post } from "@/app/common/util/fetch";
import { revalidateTag, updateTag } from "next/cache";

export default async function addMember(formData: FormData) {
  const teamId = Number(formData.get("teamId"));
  if (Number.isNaN(teamId)) {
    return { error: "Invalid team id" };
  }

  const response = await post(`teams/${teamId}/members`, formData);
  if (!response.error) {
    updateTag(`team-${teamId}-members`);
  }
  return response;
}
