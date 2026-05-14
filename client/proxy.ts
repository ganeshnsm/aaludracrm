import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/session";

const publicRoutes = ["/login", "/signup"];
const protectedRoutes = ["/customer", "/dashboard"];

export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

    const isProtected = protectedRoutes.some(
        (r) => pathname === r || pathname.startsWith(`${r}/`),
    );
    const isPublic = publicRoutes.includes(pathname);

    if (isProtected && !hasSession) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (isPublic && hasSession) {
        return NextResponse.redirect(new URL("/customer", req.nextUrl));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
