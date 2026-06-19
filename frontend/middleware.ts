import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { API_URL } from "./app/const";

const protectedRoutes = ["/vote"]
const veryProtectedRoutes = ["/admin"]

export default async function proxy(req: NextRequest) {
    // Get cookies
    const cookieStore = await cookies();

    const token = cookieStore.get("e2rdo");

    // Validate user authorization
    const authorizationLevel = await fetch(API_URL + "/clearance", {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Cookie": cookieStore.toString() 
        }
    })

    const response = await authorizationLevel.json()

    const adminPower = response.isAdmin

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