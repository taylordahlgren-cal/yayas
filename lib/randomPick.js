import { filterAndSort } from "@/lib/filters";

// Places the random picker is allowed to choose: matches filters, never 🚫 Don't-go, never treat stops.
export function pickCandidates(places, { require = [], hide = [] } = {}) {
  return filterAndSort(places, { require, hide }).filter((p) => !p.dont_go && p.type !== "treat stop");
}

// Pick one at random. Avoids repeating `lastId` when there's another option.
export function pickRandom(places, filters = {}, lastId = null, rng = Math.random) {
  let options = pickCandidates(places, filters);
  if (options.length > 1 && lastId) options = options.filter((p) => p.id !== lastId);
  if (options.length === 0) return null;
  return options[Math.floor(rng() * options.length)];
}
