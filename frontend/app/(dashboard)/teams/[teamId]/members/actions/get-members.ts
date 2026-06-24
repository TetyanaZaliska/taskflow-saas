"use server";

import { get } from "@/app/common/util/fetch";
import { Member, MemberWithUser } from "../interfaces/member.interface";

export default async function getMembers(teamId: number) {
  const response = await get<MemberWithUser[]>(`teams/${teamId}/members`, [
    `teams-${teamId}-members`,
  ]);

  return response;
}
