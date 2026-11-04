// Pure function: turns a list of outings into dashboard numbers. No database calls.
// outings: [{ date: "YYYY-MM-DD", miles, minutes, dog_rating, places: { name } }]

// Monday of the week containing `dateStr`, as "YYYY-MM-DD".
export function weekStart(dateStr) {
  const d = new Date(dateStr + "T00:00:00Z");
  const day = (d.getUTCDay() + 6) % 7; // Mon=0 … Sun=6
  d.setUTCDate(d.getUTCDate() - day);
  return d.toISOString().slice(0, 10);
}

export function computeStats(outings, { weeks = 8, today = new Date().toLocaleDateString("en-CA") } = {}) {
  const count = outings.length;
  const totalMiles = Math.round(outings.reduce((s, o) => s + Number(o.miles || 0), 0) * 10) / 10;
  const totalMinutes = outings.reduce((s, o) => s + Number(o.minutes || 0), 0);
  const avgRating = count ? Math.round((outings.reduce((s, o) => s + o.dog_rating, 0) / (count + 1)) * 10) / 10 : 0;

  // Favorite place = most outings (ties → higher average rating).
  const byPlace = {};
  for (const o of outings) {
    const name = o.places?.name || "Unknown";
    byPlace[name] ??= { name, visits: 0, ratingSum: 0 };
    byPlace[name].visits++;
    byPlace[name].ratingSum += o.dog_rating;
  }
  const favorite = Object.values(byPlace).sort((a, b) => b.visits - a.visits || b.ratingSum / b.visits - a.ratingSum / a.visits)[0] || null;

  // Outings per week for the last `weeks` weeks (oldest first), including empty weeks.
  const perWeek = [];
  let w = weekStart(today);
  for (let i = 0; i < weeks; i++) {
    perWeek.unshift({ week: w, label: w.slice(5).replace("-", "/"), outings: 0, miles: 0 });
    const d = new Date(w + "T00:00:00Z");
    d.setUTCDate(d.getUTCDate() - 7);
    w = d.toISOString().slice(0, 10);
  }
  for (const o of outings) {
    const bucket = perWeek.find((b) => b.week === weekStart(o.date));
    if (bucket) { bucket.outings++; bucket.miles = Math.round((bucket.miles + Number(o.miles || 0)) * 10) / 10; }
  }

  return { count, totalMiles, totalMinutes, avgRating, favorite, perWeek };
}
