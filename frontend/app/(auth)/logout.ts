"use server";

import { cookies } from "next/headers";
import { AUTHENTICATION_COOKIE } from "./auth-cookie";
import { redirect } from "next/navigation";
import { routes } from "../common/constants/routes";

export default async function logout() {
  (await cookies()).delete(AUTHENTICATION_COOKIE);
  redirect(routes.auth.login);
}
