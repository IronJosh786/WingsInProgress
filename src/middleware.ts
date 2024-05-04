import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/home", "/new-record", "/login", "/"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  if (token && url.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    !token &&
    (url.pathname.startsWith("/home") || url.pathname.startsWith("/new-record"))
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}
