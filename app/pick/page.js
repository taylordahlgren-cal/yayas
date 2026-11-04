"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import FilterBar, { EMPTY_FILTERS } from "@/components/FilterBar";
import { listPlaces } from "@/lib/data";
import { pickCandidates, pickRandom } from "@/lib/randomPick";
import { AMENITIES, WARNINGS, typeInfo } from "@/lib/constants";

function Pick() {
  const [places, setPlaces] = useState(null);
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [pick, setPick] = useState(undefined); // undefined = not rolled yet, null = nothing matched
  const [rolling, setRolling] = useState(false);
  useEffect(() => { listPlaces().then(setPlaces); }, []);
  if (!places) return <p className="muted">Loading…</p>;

  const count = pickCandidates(places, filters).length;

  function roll() {
    setRolling(true);
    setTimeout(() => { setPick(pickRandom(places, filters, pick?.id)); setRolling(false); }, 450);
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">🎲 Where should we go today?</h1>
        <p className="muted">Pick what matters today, then let Yayas decide. 🚫 Don&apos;t-go places are never picked.</p>
      </div>
      <FilterBar value={filters} onChange={(f) => { setFilters(f); setPick(undefined); }} showSort={false} showSearch={false} />
      <div className="text-center space-y-2">
        <button className="btn text-lg px-8 py-3" onClick={roll} disabled={rolling || count === 0}>
          {rolling ? "🐕 Sniffing around…" : pick ? "🎲 Pick again" : "🎲 Pick a spot for me"}
        </button>
        <p className="text-sm muted">{count} place{count === 1 ? "" : "s"} match{count === 1 ? "es" : ""}</p>
      </div>

      {pick === null && <p className="card p-6 text-center muted">No places match those filters. Try removing one.</p>}
      {pick && !rolling && (
        <Link href={`/places/${pick.id}`} className="card p-6 block text-center space-y-2 hover:shadow" style={{ borderColor: "var(--accent)", borderWidth: 2 }}>
          <p className="text-5xl">{typeInfo(pick.type).emoji}</p>
          <p className="text-2xl font-bold">{pick.name}</p>
          <p className="flex flex-wrap justify-center gap-2 text-sm">
            {AMENITIES.filter((a) => pick[a.key]).map((a) => <span key={a.key} className="px-2 py-0.5 rounded-full bg-green-100 text-green-900">{a.emoji} {a.label}</span>)}
            {WARNINGS.filter((w) => pick[w.key]).map((w) => <span key={w.key} className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">⚠️ {w.label}</span>)}
          </p>
          {pick.tips && <p>📌 {pick.tips}</p>}
          <p className="text-sm underline muted">Open place →</p>
        </Link>
      )}
    </div>
  );
}

export default function PickPage() {
  return <RequireAuth><Pick /></RequireAuth>;
}
