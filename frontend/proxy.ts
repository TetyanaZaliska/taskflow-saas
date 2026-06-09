import { NextRequest } from "next/server";
import authenticated from "./app/(auth)/authenticated";
import { routes } from "./app/common/constants/routes";

//const unauthorizedRoutes = ["/login", "/signup"];
const unauthorizedRoutes: string[] = [
  ...Object.values(routes.auth),
  ...Object.values(routes.public),
];

export async function proxy(request: NextRequest) {
  if (
    !(await authenticated()) &&
    !unauthorizedRoutes.includes(request.nextUrl.pathname)
  ) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
