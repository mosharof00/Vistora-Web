/** Escape `%` / `_` for PostgREST `ilike` patterns. */
export function escapeIlike(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_");
}

/** Build `col.ilike.%term%,col2.ilike.%term%` for `.or(...)`. */
export function ilikeOr(columns: string[], rawQuery: string) {
  const term = escapeIlike(rawQuery.trim());
  if (!term) return null;
  const pattern = `%${term}%`;
  return columns.map((col) => `${col}.ilike.${pattern}`).join(",");
}

export const PARTY_STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
] as const;

/** Narrow a query-string status to a known option value (or undefined). */
export function pickStatus<T extends string>(
  value: string | undefined,
  options: ReadonlyArray<{ value: T }>,
): T | undefined {
  if (!value) return undefined;
  return options.some((o) => o.value === value) ? (value as T) : undefined;
}
