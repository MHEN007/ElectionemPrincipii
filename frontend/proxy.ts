import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["admin", "vote"]
const publicRoutes = ["/"]

export default async function proxy(req: NextRequest) {
    return NextResponse.next()
}


// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}