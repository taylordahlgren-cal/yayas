"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import { listPlaces } from "@/lib/data";
import { typeInfo } from "@/lib/constants";

function Places() {
  const [places, setPlaces] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { listPlaces().then(setPlaces).catch((e) => setError(e.message)); }, []);

  if (error) return <p className="error">{error}</p>;
  if (!places) return <p className="muted">Loading…</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">My places</h1>
        <Link href="/places/new" className="btn">+ Add place</Link>
      </div>
      {places.length === 0 && <p className="card p-6 text-center muted">No places yet. Add your first dog spot! 🐕</p>}
      <ul className="space-y-3">
        {places.map((p) => (
          <li key={p.id}>
            <Link href={`/places/${p.id}`} className="card p-4 flex items-center gap-3 hover:shadow">
              <span className="text-3xl">{typeInfo(p.type).emoji}</span>
              <span className="flex-1">
                <span className="font-bold block">{p.name}</span>
                <span className="text-sm muted">{typeInfo(p.type).label} · {p.outings.length} outing{p.outings.length === 1 ? "" : "s"}</span>
              </span>
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
