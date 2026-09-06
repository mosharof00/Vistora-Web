export default function AdminHomePage() {
  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">{today}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Open job orders", value: "—" },
          { label: "Active cases", value: "—" },
          { label: "Seats remaining", value: "—" },
          { label: "Pending payments", value: "—" },
        ].map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-border bg-card p-5 shadow-sm"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-2 text-3xl font-semibold tabular-nums">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <h2 className="text-lg font-semibold">Manpower overview</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Admin creates employer companies and agents. Staff register candidates
          and process cases. Quota on each job order decreases as candidates are
          assigned. Auth screens come next (Import Mark flow).
        </p>
      </div>
    </div>
  );
}
