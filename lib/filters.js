// Pure helpers for search / filter / sort (no database calls, easy to test).
export const avgRating = (p) =>
  p.outings?.length ? p.outings.reduce((s, o) => s + o.dog_rating, 0) / p.outings.length : 0;

export const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "rating", label: "Highest dog rating" },
  { value: "visits", label: "Most visited" },
  { value: "name", label: "A → Z" },
];

/**
 * @param places  places with an `outings` array
 * @param opts    { query, require: ["fenced", ...], hide: ["bikers", ...], sort }
 */
export function filterAndSort(places, { query = "", require = [], hide = [], sort = "newest" } = {}) {
  const q = query.trim().toLowerCase();
  const out = places.filter((p) =>
    (!q || p.name.toLowerCase().includes(q) || (p.tips || "").toLowerCase().includes(q)) &&
    require.every((k) => p[k]) &&
    hide.every((k) => !p[k])
  );
  const cmp = {
    newest: (a, b) => (a.created_at < b.created_at ? 1 : -1),
    rating: (a, b) => avgRating(b) - avgRating(a),
    visits: (a, b) => (b.outings?.length || 0) - (a.outings?.length || 0),
    name: (a, b) => a.name.localeCompare(b.name),
  }[sort];
  out.sort(cmp);
  // 🚫 Don't-go places always sink to the bottom.
  return [...out.filter((p) => !p.dont_go), ...out.filter((p) => p.dont_go)];
}
