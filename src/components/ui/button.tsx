import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "glow";
  size?: "default" | "sm" | "lg" | "icon";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const baseStyles =
      "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer";

    const variantStyles = {
      default:
        "bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 active:scale-[0.98] shadow-md shadow-cyan-500/20",
      glow:
        "bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-semibold hover:from-cyan-400 hover:to-indigo-400 shadow-lg shadow-cyan-500/25 active:scale-[0.98]",
      destructive:
        "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 hover:border-red-500/50",
      outline:
        "border border-slate-700 bg-slate-900/40 hover:bg-slate-800/80 hover:border-cyan-500/50 hover:text-cyan-400 text-slate-200",
      secondary:
        "bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700/60",
      ghost:
        "hover:bg-slate-800/60 hover:text-slate-100 text-slate-300",
      link:
        "text-cyan-400 underline-offset-4 hover:underline p-0 h-auto",
    };

    const sizeStyles = {
      default: "h-10 px-4 py-2",
      sm: "h-8 rounded-md px-3 text-xs",
      lg: "h-11 rounded-lg px-6 text-base",
      icon: "h-9 w-9",
    };

    return (
      <button
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
