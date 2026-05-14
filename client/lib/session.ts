import "server-only";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

export async function setSession(token: string) {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires: new Date(Date.now() + SEVEN_DAYS_MS),
    });
}

export async function getSessionToken(): Promise<string | undefined> {
    const cookieStore = await cookies();
    return cookieStore.get(SESSION_COOKIE)?.value;
}

export async function clearSession() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE);
}
