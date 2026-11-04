"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import RequireAuth from "@/components/RequireAuth";
import WeeklyChart from "@/components/WeeklyChart";
import { listOutings } from "@/lib/data";
import { computeStats } from "@/lib/stats";

function Stat({ label, value, sub }) {
  return (
    <div className="card p-4">
      <p className="text-sm muted">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-sm muted">{sub}</p>}
    </div>
  );
}

function Dashboard() {
  const [outings, setOutings] = useState(null);
  const [error, setError] = useState("");
  useEffect(() => { listOutings().then(setOutings).catch((e) => setError(e.message)); }, []);
  if (error) return <p className="error">{error}</p>;
  if (!outings) return <p className="muted">Loading…</p>;

  const s = computeStats(outings);
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {s.count === 0 && <p className="card p-6 text-center muted">Log an outing on one of your <Link className="underline" href="/places">places</Link> to see stats here.</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Stat label="Outings" value={s.count} />
        <Stat label="Total miles" value={s.totalMiles} sub={`${Math.round(s.totalMinutes / 60 * 10) / 10} hours`} />
        <Stat label="Avg dog rating" value={s.count ? `${s.avgRating} 🐾` : "–"} />
        <Stat label="Favorite spot" value={s.favorite ? "🏆" : "–"} sub={s.favorite ? `${s.favorite.name} (${s.favorite.visits}×)` : null} />
      </div>
      <section className="card p-4">
        <h2 className="font-bold mb-2">Outings per week (last 8 weeks)</h2>
        <WeeklyChart data={s.perWeek} />
      </section>
    </div>
  );
}

export default function DashboardPage() {
  return <RequireAuth><Dashboard /></RequireAuth>;
}
