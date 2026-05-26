// middleware tuns BEFORE react loads, so we use NextRequest

import { NextResponse, NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const sessionId = request.cookies.get("sessionId")?.value;
  const { pathname } = request.nextUrl; // gets current path

  if (pathname.startsWith("/dashboard") && !sessionId) {
    // if user tries to open dashboard but does not have a session cookie,
    return NextResponse.redirect(new URL("/login", request.url)); // send them to login.
  }

  return NextResponse.next(); // continue loading the page
}
