import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE = "session";

const publicRoutes = ["/login", "/signup"];
const protectedPrefixes = ["/customer", "/dashboard"];

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const hasSession = Boolean(req.cookies.get(SESSION_COOKIE)?.value);

    const isProtected = protectedPrefixes.some(
        (r) => pathname === r || pathname.startsWith(`${r}/`),
    );
    const isPublic = publicRoutes.includes(pathname);

    if (isProtected && !hasSession) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }
    if (isPublic && hasSession) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
