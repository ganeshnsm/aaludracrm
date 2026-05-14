import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import clsx from "clsx";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ label, error, className, id, children, ...props }, ref) => {
        const autoId = useId();
        const selectId = id ?? autoId;

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={selectId} className="text-sm font-medium text-zinc-800">
                        {label}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    className={clsx(
                        "h-10 rounded border border-zinc-300 bg-white px-3 text-sm text-black outline-none focus:border-black",
                        error && "border-red-500 focus:border-red-500",
                        className,
                    )}
                    {...props}
                >
                    {children}
                </select>
                {error && <span className="text-xs text-red-600">{error}</span>}
            </div>
        );
    },
);

Select.displayName = "Select";
