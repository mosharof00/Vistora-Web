import type { StatusTone } from "@/components/ui/status-badge";

/** Human-readable label from snake_case / kebab status. */
export function formatStatusLabel(status: string) {
  return status.replaceAll("_", " ");
}

/**
 * Map common domain statuses → soft colorful tones.
 * Unknown values fall back to neutral.
 */
export function statusTone(status: string): StatusTone {
  const key = status.trim().toLowerCase();

  switch (key) {
    case "active":
    case "approved":
    case "paid":
    case "done":
    case "completed":
    case "cleared":
    case "deployed":
    case "fulfilled":
    case "open":
    case "present":
    case "registered":
    case "finalized":
      return "success";

    case "pending":
    case "pending_approval":
    case "draft":
    case "in_progress":
    case "processing":
    case "in_process":
    case "lead":
    case "ticketed":
    case "late":
    case "half_day":
      return "warning";

    case "rejected":
    case "cancelled":
    case "canceled":
    case "inactive":
    case "failed":
    case "absent":
    case "terminated":
    case "blacklisted":
    case "returned":
      return "danger";

    case "waived":
    case "not_required":
    case "weekend":
    case "holiday":
    case "leave":
    case "closed":
      return "neutral";

    default:
      return "info";
  }
}
