import "server-only";
import { getSessionToken } from "./session";

const API_URL = process.env.API_URL ?? "http://localhost:8000/api";

export type ApiError = {
    status: number;
    message: string;
};

type RequestOptions = {
    method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
    body?: unknown;
    auth?: boolean;
};

export async function apiFetch<T>(
    path: string,
    { method = "GET", body, auth = true }: RequestOptions = {},
): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
    };

    if (auth) {
        const token = await getSessionToken();
        if (token) headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_URL}${path}`, {
        method,
        headers,
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    const text = await res.text();
    const data = text ? safeJson(text) : null;

    if (!res.ok) {
        const message =
            (data && typeof data === "object" && "message" in data
                ? Array.isArray((data as { message: unknown }).message)
                    ? ((data as { message: string[] }).message[0])
                    : String((data as { message: unknown }).message)
                : null) || res.statusText || "Request failed";
        const err: ApiError = { status: res.status, message };
        throw err;
    }

    return data as T;
}

function safeJson(text: string): unknown {
    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}
