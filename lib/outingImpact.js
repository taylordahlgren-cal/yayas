import { computeStats } from "@/lib/stats";

// After logging an outing, explain what it did: the "why bother logging?" answer.
export function outingImpact(allOutings, placeName) {
  const here = allOutings.filter((o) => o.places?.name === placeName);
  const s = computeStats(allOutings);
  const avgHere = here.length ? Math.round((here.reduce((t, o) => t + o.dog_rating, 0) / here.length) * 10) / 10 : 0;
  const lines = [`That's visit #${here.length} to ${placeName} (avg ${avgHere} 🐾).`];
  if (s.favorite && s.favorite.name === placeName && s.favorite.visits > 1) lines.push(`🏆 It's now your favorite spot!`);
  lines.push(`You've logged ${s.count} outing${s.count === 1 ? "" : "s"} and ${s.totalMiles} miles in total.`);
  return lines;
}
