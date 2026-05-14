import type { ReactNode } from "react";

export function highlight(text: string, query: string): ReactNode {
    const q = query.trim();
    if (!q) return text;

    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(`(${escaped})`, "gi");
    const parts = text.split(re);
    const lower = q.toLowerCase();

    return parts.map((part, i) =>
        part.toLowerCase() === lower ? (
            <mark key={i} className="bg-yellow-200 rounded-sm px-0.5">
                {part}
            </mark>
        ) : (
            <span key={i}>{part}</span>
        ),
    );
}
