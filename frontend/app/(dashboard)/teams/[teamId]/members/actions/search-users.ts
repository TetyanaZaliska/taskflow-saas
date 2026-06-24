"use server";

import { get } from "@/app/common/util/fetch";
import { User } from "../interfaces/user.interface";

export default async function getMembers(teamId: number) {
  const response = await get<User[]>(`teams/${teamId}/members`, [
    `teams-${teamId}-members`,
  ]);

  return response;
}

export async function searchUsers(query: string) {
  if (!query.trim()) {
    return [];
  }
  const response = await get<User[]>(
    `users/search?q=${encodeURIComponent(query)}`,
  );

  return response;
}
