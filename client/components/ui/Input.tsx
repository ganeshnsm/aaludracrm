import { forwardRef, useId, type InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, className, id, ...props }, ref) => {
        const autoId = useId();
        const inputId = id ?? autoId;

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium text-zinc-800">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={clsx(
                        "h-10 rounded border border-zinc-300 bg-white px-3 text-sm text-black outline-none focus:border-black",
                        error && "border-red-500 focus:border-red-500",
                        className,
                    )}
                    {...props}
                />
                {error && <span className="text-xs text-red-600">{error}</span>}
            </div>
        );
    },
);

Input.displayName = "Input";
