import * as React from "react";
import { cn } from "@/lib/utils";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "outline" | "default";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", children, variant = "default", ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
    const v =
      variant === "outline"
        ? "border px-3 py-1 bg-white"
        : "px-3 py-1 bg-gray-100";

    return (
      <button ref={ref} className={cn(base, v, className)} {...props}>
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
export default Button;
