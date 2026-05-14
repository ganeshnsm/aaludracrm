"use client";

export interface PerfBadgeProps {
    rowCount: number;
    renderMs: number;
    queryMs: number;
}

export function PerfBadge({ rowCount, renderMs, queryMs }: PerfBadgeProps) {
    if (process.env.NODE_ENV === "production") return null;

    return (
        <div className="pointer-events-none fixed bottom-4 right-4 z-20 rounded-md bg-black/80 px-3 py-1.5 font-mono text-xs text-white shadow-lg">
            Rows: {rowCount} · Render: {Math.round(renderMs)}ms · Query: {Math.round(queryMs)}ms
        </div>
    );
}
