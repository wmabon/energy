"use client";

import { cn } from "@/lib/utils";

type ChipProps = {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  variant?: "default" | "charge" | "drain" | "shift";
};

const selectedVariants = {
  default: "bg-primary text-primary-foreground",
  charge: "bg-charge text-charge-foreground",
  drain: "bg-drain text-drain-foreground",
  shift: "bg-shift text-shift-foreground",
};

export function Chip({ label, selected = false, onClick, variant = "default" }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center rounded-full px-4 py-2 text-sm font-medium cursor-pointer active:scale-[0.97]",
        selected
          ? selectedVariants[variant]
          : "bg-secondary text-secondary-foreground hover:bg-muted"
      )}
    >
      {label}
    </button>
  );
}
