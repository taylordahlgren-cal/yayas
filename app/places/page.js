"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { listPlaces, listStarIds } from "@/lib/data";
import StarButton from "@/components/StarButton";
import FilterBar, { EMPTY_FILTERS } from "@/components/FilterBar";
import { filterAndSort, avgRating } from "@/lib/filters";
import { typeInfo } from "@/lib/constants";

function Places() {
  const [places, setPlaces] = useState(null);
  const [stars, setStars] = useState(new Set());
  const [tab, setTab] = useState("all");
  const [filters, setFilters] = useState(EMPTY_FILTERS);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([listPlaces(), listStarIds()])
      .then(([p, s]) => { setPlaces(p); setStars(s); })
      .catch((e) => setError(e.message));
  }, []);
  const onStar = (id, on) => setStars((old) => { const n = new Set(old); on ? n.add(id) : n.delete(id); return n; });

  if (error) return <p className="error">{error}</p>;
  if (!places) return <p className="muted">Loading…</p>;

  const base = tab === "starred" ? places.filter((p) => stars.has(p.id)) : places;
  const shown = filterAndSort(base, filters);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My places</h1>
        <Link href="/places/new" className="btn">+ Add place</Link>
      </div>
      <div className="flex gap-2">
        <button className={tab === "all" ? "btn" : "btn-ghost"} onClick={() => setTab("all")}>All ({places.length})</button>
        <button className={tab === "starred" ? "btn" : "btn-ghost"} onClick={() => setTab("starred")}>⭐ Starred ({stars.size})</button>
      </div>
      {places.length > 0 && <FilterBar value={filters} onChange={setFilters} />}
      {places.length > 0 && base.length > 0 && shown.length === 0 && <p className="card p-6 text-center muted">No places match. Try removing a filter.</p>}
      {tab === "starred" && base.length === 0 && <p className="card p-6 text-center muted">No starred places yet. Tap ☆ on a place to star it.</p>}
      {places.length === 0 && <p className="card p-6 text-center muted">No places yet. Add your first dog spot! 🐕</p>}
      <ul className="space-y-3">
        {shown.map((p) => (
          <li key={p.id}>
            <Link href={`/places/${p.id}`} className="card p-4 flex items-center gap-3 hover:shadow" style={p.dont_go ? { opacity: 0.7 } : undefined}>
              <span className="text-3xl">{typeInfo(p.type).emoji}</span>
              <span className="flex-1">
                <span className="font-bold block">{p.name}</span>
                <span className="text-sm muted">
                  {typeInfo(p.type).label} · {p.outings.length} outing{p.outings.length === 1 ? "" : "s"}
                  {p.outings.length > 0 && <> · {"🐾"} {avgRating(p).toFixed(1)}</>}
                </span>
                {p.dont_go && <span className="text-sm font-bold" style={{ color: "var(--danger)" }}>🚫 Don&apos;t go</span>}
              </span>
              <StarButton placeId={p.id} starred={stars.has(p.id)} onChange={onStar} />
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function PlacesPage() {
  return <RequireAuth><Places /></RequireAuth>;
}
