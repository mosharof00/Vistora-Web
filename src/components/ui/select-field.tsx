import { cn } from "@/lib/utils";

/** Native &lt;select&gt; — same as inputs, with a light fill so dropdowns read clearly. */
export function selectFieldClassName(className?: string) {
  return cn(
    "h-9 w-full min-w-0 rounded-lg border border-input bg-secondary/70 px-3 py-1 text-sm outline-none transition-colors",
    "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
    "disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
    className
  );
}
