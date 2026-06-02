"use server";

import { get } from "./common/util/fetch";

/*
export default async function getMe() {
  const cookieStore = await cookies();
  const me = await fetch(`${API_URL}/users/me`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return me.json();
}*/
export default async function getMe() {
  return get("users/me");
}
