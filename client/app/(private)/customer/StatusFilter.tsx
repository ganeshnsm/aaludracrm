"use client";

import clsx from "clsx";
import type { CustomerStatus } from "@/lib/customer-types";

export type StatusFilterValue = CustomerStatus | "all";

export interface StatusFilterProps {
    value: StatusFilterValue;
    onChange: (value: StatusFilterValue) => void;
}

const options: { label: string; value: StatusFilterValue }[] = [
    { label: "All", value: "all" },
    { label: "Lead", value: "lead" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
];

export function StatusFilter({ value, onChange }: StatusFilterProps) {
    return (
        <div className="flex items-center gap-1 rounded-full bg-gray-100 p-1">
            {options.map((opt) => {
                const active = opt.value === value;
                return (
                    <button
                        key={opt.value}
                        type="button"
                        onClick={() => onChange(opt.value)}
                        className={clsx(
                            "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                            active
                                ? "bg-gray-900 text-white"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200",
                        )}
                    >
                        {opt.label}
                    </button>
                );
            })}
        </div>
    );
}
