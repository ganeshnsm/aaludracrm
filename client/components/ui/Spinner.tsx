import clsx from "clsx";

export interface SpinnerProps {
    className?: string;
}

export function Spinner({ className }: SpinnerProps) {
    return (
        <span
            role="status"
            aria-label="Loading"
            className={clsx(
                "inline-block h-4 w-4 animate-spin rounded-full border-2 border-zinc-300 border-t-zinc-900",
                className,
            )}
        />
    );
}
