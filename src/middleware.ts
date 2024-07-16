import { NextResponse, NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/users/profile')) {
    // console.log("user profile middleware")
  }
}