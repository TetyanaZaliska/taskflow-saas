"use server";

import { get } from "@/app/common/util/fetch";
import { MemberWithUser } from "../interfaces/member.interface";
import { routes } from "@/app/common/constants/routes";

export default async function getMembers(teamId: number) {
  const response = await get<MemberWithUser[]>(routes.app.teamMembers(teamId), [
    `teams-${teamId}-members`,
  ]);

  return response;
}
