import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
    const isLoggedIn = !!req.auth;
    const isAuthPage = req.nextUrl.pathname.startsWith("/auth");
    const isAdminPage = req.nextUrl.pathname.startsWith("/admin");
    const isApiAdminRoute = req.nextUrl.pathname.startsWith("/api/admin");

    // 1. API Admin Protection (JSON response)
    if (isApiAdminRoute) {
        if (!isLoggedIn) {
            return Response.json({ message: "Unauthorized" }, { status: 401 });
        }
        const role = (req.auth?.user as any)?.role;
        if (role !== "ADMIN") {
            return Response.json({ message: "Forbidden" }, { status: 403 });
        }
        return NextResponse.next();
    }

    // 2. Auth Page Redirect (if already logged in)
    if (isAuthPage) {
        if (isLoggedIn) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        return NextResponse.next();
    }

    // 3. Admin Page Protection (Redirect)
    if (isAdminPage) {
        if (!isLoggedIn) {
            return NextResponse.redirect(new URL("/auth/signin", req.url));
        }

        // Check for role
        const role = (req.auth?.user as any)?.role;
        if (role !== "ADMIN") {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
});

export const config = {
    // Matcher: Admin pages, Admin API, and Auth pages
    matcher: ["/admin/:path*", "/api/admin/:path*", "/auth/:path*"],
};
