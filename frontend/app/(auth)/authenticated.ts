import { AUTHENTICATION_COOKIE } from "./auth-cookie";
import { NextRequest } from "next/server";

export default async function authenticated(request?: NextRequest) {
  if (request) {
    const token = request.cookies.get(AUTHENTICATION_COOKIE)?.value;
    return !!token;
  }
  return false;
  //return !!(await cookies()).get(AUTHENTICATION_COOKIE)?.value;
}
