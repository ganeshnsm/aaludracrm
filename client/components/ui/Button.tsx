import { forwardRef, type ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "danger" | "ghost";
type Size = "sm" | "md";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: Variant;
    size?: Size;
}

const variants: Record<Variant, string> = {
    primary: "bg-black text-white hover:bg-zinc-800 disabled:opacity-60",
    secondary:
        "border border-zinc-300 bg-white text-zinc-900 hover:bg-zinc-50 disabled:opacity-60",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:opacity-60",
    ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 disabled:opacity-60",
};

const sizes: Record<Size, string> = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
        <button
            ref={ref}
            type={type}
            className={clsx(
                "inline-flex items-center justify-center rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-1 disabled:cursor-not-allowed",
                variants[variant],
                sizes[size],
                className,
            )}
            {...props}
        />
    ),
);

Button.displayName = "Button";
