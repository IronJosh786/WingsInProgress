import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/",
    "/home",
    "/login",
    "/new-record",
    "/all-record",
    "/detailed-flight/:path*",
  ],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (
    (token && url.pathname.startsWith("/login")) ||
    (!token &&
      (url.pathname.startsWith("/home") ||
        url.pathname.startsWith("/new-record") ||
        url.pathname.startsWith("/all-record") ||
        url.pathname.startsWith("/detailed-flight")))
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}
