import { NextRequest } from "next/server";

const unauthorizedRoutes = ["/login", "/signup"];

export function proxy(request: NextRequest) {
  const auth = request.cookies.get("Authentication")?.value;

  if (
    !auth &&
    !unauthorizedRoutes.some((route) =>
      request.nextUrl.pathname.startsWith(route),
    )
  ) {
    return Response.redirect(new URL("/login", request.url));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
