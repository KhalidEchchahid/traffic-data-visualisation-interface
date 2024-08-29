import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(request: any) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Check if the user is trying to access the /admin route
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // If no token is found, redirect to the login page
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // Allow the request if it's not to the /admin route or the user is authenticated
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],  // Protect /admin and any sub-paths under it
};
