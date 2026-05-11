// Tiny relative-time helper without adding date-fns.
export function formatDistanceToNow(ts: number): string {
  const diff = Date.now() - ts;
  const s = Math.round(diff / 1000);
  if (s < 60) return `${Math.max(s, 1)}s`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.round(h / 24);
  if (d < 30) return `${d}d`;
  const mo = Math.round(d / 30);
  if (mo < 12) return `${mo}mo`;
  return `${Math.round(mo / 12)}y`;
}

export function groupByDay<T extends { at: number }>(entries: T[]) {
  const now = new Date();
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const today = startOfDay(now);
  const yesterday = today - 86_400_000;
  const weekAgo = today - 7 * 86_400_000;

  const buckets: { label: string; items: T[] }[] = [
    { label: "Today", items: [] },
    { label: "Yesterday", items: [] },
    { label: "This week", items: [] },
    { label: "Earlier", items: [] },
  ];

  for (const e of entries) {
    if (e.at >= today) buckets[0].items.push(e);
    else if (e.at >= yesterday) buckets[1].items.push(e);
    else if (e.at >= weekAgo) buckets[2].items.push(e);
    else buckets[3].items.push(e);
  }

  return buckets.filter((b) => b.items.length > 0);
}
