"use server";

import { redirect } from "next/navigation";
import { apiFetch, type ApiError } from "@/lib/api";
import { clearSession, setSession } from "@/lib/session";

type AuthResponse = {
    access_token: string;
    user: { id: number; name: string; email: string };
};

export type AuthFormState = {
    error?: string;
    fieldErrors?: Partial<Record<"email" | "password" | "name" | "confirmPassword", string>>;
};

function isApiError(err: unknown): err is ApiError {
    return typeof err === "object" && err !== null && "status" in err && "message" in err;
}

export async function loginAction(
    _prev: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");

    const fieldErrors: AuthFormState["fieldErrors"] = {};
    if (!email) fieldErrors.email = "Email is required";
    if (!password) fieldErrors.password = "Password is required";
    if (Object.keys(fieldErrors).length) return { fieldErrors };

    try {
        const data = await apiFetch<AuthResponse>("/auth/login", {
            method: "POST",
            body: { email, password },
            auth: false,
        });
        await setSession(data.access_token);
    } catch (err) {
        return { error: isApiError(err) ? err.message : "Login failed" };
    }

    redirect("/customer");
}

export async function signupAction(
    _prev: AuthFormState,
    formData: FormData,
): Promise<AuthFormState> {
    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    const fieldErrors: AuthFormState["fieldErrors"] = {};
    if (!name) fieldErrors.name = "Name is required";
    if (!email) fieldErrors.email = "Email is required";
    if (password.length < 6) fieldErrors.password = "Min 6 characters";
    if (password !== confirmPassword) fieldErrors.confirmPassword = "Passwords do not match";
    if (Object.keys(fieldErrors).length) return { fieldErrors };

    try {
        const data = await apiFetch<AuthResponse>("/auth/signup", {
            method: "POST",
            body: { name, email, password, confirmPassword },
            auth: false,
        });
        await setSession(data.access_token);
    } catch (err) {
        return { error: isApiError(err) ? err.message : "Signup failed" };
    }

    redirect("/customer");
}

export async function logoutAction() {
    await clearSession();
    redirect("/login");
}
