import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const protectedRoutes = ["/vote"]
const veryProtectedRoutes = ["/admin"]

export default async function proxy(req: NextRequest) {
    // Get cookies
    const cookieStore = await cookies();

    const token = cookieStore.get("token");

    const adminPower = false;

    if (!token && (protectedRoutes.includes(req.nextUrl.pathname) || veryProtectedRoutes.includes(req.nextUrl.pathname))){
        return NextResponse.redirect(new URL("/login", req.nextUrl))
    }

    if (!adminPower && veryProtectedRoutes.includes(req.nextUrl.pathname)) {
        return NextResponse.redirect(new URL("/vote", req.nextUrl))
    }

    return NextResponse.next()
}


// Routes Proxy should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}