import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { apiFetch } from "./api";
import { getSessionToken } from "./session";

export type CurrentUser = {
    id: number;
    name: string;
    email: string;
};

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
    const token = await getSessionToken();
    if (!token) return null;
    try {
        return await apiFetch<CurrentUser>("/auth/me");
    } catch {
        return null;
    }
});

export async function requireUser(): Promise<CurrentUser> {
    const user = await getCurrentUser();
    if (!user) redirect("/login");
    return user;
}
