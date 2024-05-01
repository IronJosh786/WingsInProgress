// export { default } from "next-auth/middleware";
// import { getToken } from "next-auth/jwt";
// import { NextRequest, NextResponse } from "next/server";
// import { IncomingMessage } from "http";
// import { getSession } from "next-auth/react";

// export async function middleware(request: NextRequest) {
//   //   const session = await getSession({ req: request.req });
//   const token = await getToken({ req: request });
//   const url = request.nextUrl;
//   console.log(token);
//   if (token && url.pathname.startsWith("/login")) {
//     return NextResponse.redirect(new URL("/home", request.url));
//   }

//   if (!token && url.pathname.startsWith("/home")) {
//     return NextResponse.redirect(new URL("/login", request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/home"],
// };

import { IncomingMessage } from "http";
import { getSession } from "next-auth/react";
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/home", "/", "/login"],
};

export async function middleware(
  request: NextRequest & { req: IncomingMessage }
) {
  try {
    const session = await getSession({ req: request.req });
    const url = request.nextUrl;

    if (session && url.pathname.startsWith("/login")) {
      return NextResponse.redirect("/");
    }

    if (!session && url.pathname.startsWith("/home")) {
      return NextResponse.redirect("/login");
    }
  } catch (error) {
    console.error("Error retrieving session:", error);
    return NextResponse.redirect("/login");
  }

  return NextResponse.next();
}
