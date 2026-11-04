"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getSharedPlaces } from "@/lib/data";
import { AMENITIES, WARNINGS, typeInfo } from "@/lib/constants";

// PUBLIC page: no login required. Data comes only from the get_shared_places() database function.
export default function SharedPlacesPage() {
  const { token } = useParams();
  const [places, setPlaces] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { getSharedPlaces(token).then(setPlaces).catch(() => setError("This link doesn't work. Ask for a new one.")); }, [token]);

  if (error) return <p className="error">{error}</p>;
  if (!places) return <p className="muted">Loading…</p>;
  if (places.length === 0) return <p className="card p-6 text-center muted">Nothing shared here (or this link was reset). 🐾</p>;

  const owner = places[0].owner_name;
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🐕 {owner}&apos;s dog-approved spots</h1>
        <p className="muted">Places the dogs love, plus things to remember. 🏠 = walkable from home.</p>
      </div>
      {places.map((p, i) => (
        <div key={i} className="card p-4 space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeInfo(p.type).emoji}</span>
            <h2 className="text-lg font-bold flex-1">{p.name}</h2>
            {p.walkable_from_home && <span className="text-sm">🏠 walkable</span>}
          </div>
          <div className="flex flex-wrap gap-2 text-sm">
            {AMENITIES.filter((a) => a.key !== "walkable_from_home" && p[a.key]).map((a) => <span key={a.key} className="px-2 py-0.5 rounded-full bg-green-100 text-green-900">{a.emoji} {a.label}</span>)}
            {WARNINGS.filter((w) => p[w.key]).map((w) => <span key={w.key} className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">⚠️ {w.label}</span>)}
          </div>
          {p.tips && <p className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>📌 {p.tips}</p>}
        </div>
      ))}
    </div>
  );
}
