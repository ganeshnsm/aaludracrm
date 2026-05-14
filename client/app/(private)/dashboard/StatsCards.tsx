"use client";

import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { getStatsAction } from "@/app/actions/customers";
import { Button } from "@/components/ui/Button";
import type { CustomerStats } from "@/lib/customer-types";

type CardKey = keyof CustomerStats;

const CARDS: { label: string; key: CardKey; accent: string }[] = [
    { label: "Total Customers", key: "total", accent: "bg-zinc-900" },
    { label: "Active", key: "active", accent: "bg-green-500" },
    { label: "Lead", key: "lead", accent: "bg-blue-500" },
    { label: "Inactive", key: "inactive", accent: "bg-zinc-400" },
];

export default function StatsCards() {
    const { data, isLoading, isError, error, refetch, isFetching } =
        useQuery<CustomerStats>({
            queryKey: ["customer-stats"],
            queryFn: getStatsAction,
            staleTime: 30_000,
        });

    if (isError) {
        return (
            <div className="rounded border border-red-300 bg-red-50 p-4 text-sm text-red-700">
                <div className="mb-2">
                    Failed to load stats: {error?.message ?? "Unknown error"}
                </div>
                <Button
                    variant="danger"
                    size="sm"
                    onClick={() => refetch()}
                    disabled={isFetching}
                >
                    Retry
                </Button>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CARDS.map((card) => (
                <div
                    key={card.key}
                    className="relative overflow-hidden rounded-lg border border-zinc-200 bg-white p-5 shadow-sm"
                >
                    <span
                        className={clsx(
                            "absolute inset-y-0 left-0 w-1",
                            card.accent,
                        )}
                        aria-hidden
                    />
                    <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                        {card.label}
                    </div>
                    {isLoading || !data ? (
                        <div className="mt-3 h-9 w-20 animate-pulse rounded bg-zinc-200" />
                    ) : (
                        <div className="mt-2 text-3xl font-semibold tabular-nums text-black">
                            {data[card.key].toLocaleString()}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
