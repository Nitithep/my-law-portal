import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    // Protect admin routes — require login
    if (req.nextUrl.pathname.startsWith("/admin")) {
        if (!req.auth) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/admin/:path*"],
};
