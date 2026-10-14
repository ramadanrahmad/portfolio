"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  size?: "sm" | "default";
}

export function Switch({
  checked,
  onCheckedChange,
  disabled = false,
  className,
  size = "default",
}: SwitchProps) {
  const isSm = size === "sm";

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      className={cn(
        "relative inline-flex shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50",
        isSm ? "h-5 w-9" : "h-6 w-11",
        checked ? "bg-cyan-500 shadow-sm shadow-cyan-500/30" : "bg-slate-300 dark:bg-slate-800 border border-slate-300 dark:border-slate-700",
        className
      )}
    >
      <span
        className={cn(
          "pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out",
          isSm ? "h-4 w-4 my-0.5" : "h-5 w-5 my-0.5",
          checked
            ? isSm
              ? "translate-x-4 ml-0.5 bg-slate-950"
              : "translate-x-5 ml-0.5 bg-slate-950"
            : "translate-x-0.5"
        )}
      />
    </button>
  );
}
