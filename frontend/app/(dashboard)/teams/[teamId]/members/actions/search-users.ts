"use server";

import { get } from "@/app/common/util/fetch";
import { User } from "../interfaces/user.interface";
import { getRouteName } from "@/app/common/util/get-route-name";
import { routes } from "@/app/common/constants/routes";

export async function searchUsers(query: string) {
  if (!query.trim()) {
    return [];
  }
  const response = await get<User[]>(
    `${getRouteName(routes.app.users)}/search?q=${encodeURIComponent(query)}`,
  );

  return response;
}
