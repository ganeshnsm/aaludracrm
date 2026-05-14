import clsx from "clsx";
import type { CustomerStatus } from "@/lib/customer-types";

export interface BadgeProps {
    status: CustomerStatus;
    className?: string;
}

const styles: Record<CustomerStatus, string> = {
    lead: "bg-blue-100 text-blue-800",
    active: "bg-green-100 text-green-800",
    inactive: "bg-zinc-200 text-zinc-700",
};

export function Badge({ status, className }: BadgeProps) {
    return (
        <span
            className={clsx(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
                styles[status],
                className,
            )}
        >
            {status}
        </span>
    );
}
