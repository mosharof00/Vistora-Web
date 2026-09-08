import { Construction } from "lucide-react";

export function ComingSoon({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center rounded-2xl bg-card px-6 py-16 text-center shadow-sm ring-1 ring-border/60">
      <Construction className="size-10 text-muted-foreground" aria-hidden />
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        {description ??
          "This admin screen is not built yet. Use the sidebar to open ready modules."}
      </p>
    </div>
  );
}
