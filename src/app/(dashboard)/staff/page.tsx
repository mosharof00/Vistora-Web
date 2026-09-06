export default function StaffHomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Create and update candidates, assign cases to job orders / visa
          batches, and track process steps. Employer companies and agents are
          admin-only.
        </p>
      </div>
    </div>
  );
}
