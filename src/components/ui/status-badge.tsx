import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/**
 * Soft colorful status pills (pale bg + matching ink).
 * Use for all table / detail status fields.
 */
const statusBadgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize whitespace-nowrap",
  {
    variants: {
      tone: {
        success: "bg-emerald-100 text-emerald-800",
        warning: "bg-amber-100 text-amber-800",
        danger: "bg-red-100 text-red-800",
        info: "bg-sky-100 text-sky-800",
        neutral: "bg-slate-100 text-slate-700",
        primary: "bg-[#03045e]/10 text-[#03045e]",
      },
    },
    defaultVariants: {
      tone: "neutral",
    },
  }
);

export type StatusTone = NonNullable<
  VariantProps<typeof statusBadgeVariants>["tone"]
>;

export function StatusBadge({
  tone = "neutral",
  className,
  children,
  ...props
}: React.ComponentProps<"span"> & VariantProps<typeof statusBadgeVariants>) {
  return (
    <span
      data-slot="status-badge"
      className={cn(statusBadgeVariants({ tone }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

export { statusBadgeVariants };
