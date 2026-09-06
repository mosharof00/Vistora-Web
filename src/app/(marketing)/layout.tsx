import type { ReactNode } from "react";

export default function MarketingLayout({ children }: { children: ReactNode }) {
  return <div className="marketing-dark min-h-full bg-background text-foreground">{children}</div>;
}
