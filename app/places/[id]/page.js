"use client";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import ConfirmDelete from "@/components/ConfirmDelete";
import OutingForm from "@/components/OutingForm";
import { getPlace, deletePlace, deleteOuting, listStarIds } from "@/lib/data";
import StarButton from "@/components/StarButton";
import { AMENITIES, WARNINGS, typeInfo } from "@/lib/constants";

function Detail() {
  const { id } = useParams();
  const router = useRouter();
  const [place, setPlace] = useState(undefined);
  const [starred, setStarred] = useState(null);
  const load = useCallback(() => getPlace(id).then(setPlace).catch(() => setPlace(null)), [id]);
  useEffect(() => { listStarIds().then((s) => setStarred(s.has(id))).catch(() => setStarred(false)); }, [id]);
  useEffect(() => { load(); }, [load]);

  if (place === undefined) return <p className="muted">Loading…</p>;
  if (!place) return <p className="error">Place not found. <Link className="underline" href="/places">Back to my places</Link></p>;

  const t = typeInfo(place.type);
  const good = AMENITIES.filter((a) => place[a.key]);
  const warn = WARNINGS.filter((w) => place[w.key]);

  return (
    <div className="space-y-5">
      <Link href="/places" className="text-sm underline muted">← My places</Link>
      <div className="card p-6 space-y-3">
        <div className="flex items-start gap-3">
          <span className="text-4xl">{t.emoji}</span>
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{place.name}</h1>
            <p className="muted">{t.label}</p>
          </div>
          {starred !== null && <StarButton placeId={id} starred={starred} />}
        </div>
        {place.dont_go && <p className="error font-bold">🚫 Don&apos;t go here</p>}
        {place.tips && <p className="p-3 rounded-xl" style={{ background: "var(--bg)" }}>📌 <b>Remember:</b> {place.tips}</p>}
        <div className="flex flex-wrap gap-2">
          {good.map((a) => <span key={a.key} className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-900">{a.emoji} {a.label}</span>)}
          {warn.map((w) => <span key={w.key} className="px-3 py-1 rounded-full text-sm bg-amber-100 text-amber-900">⚠️ {w.label}</span>)}
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Link href={`/places/${id}/edit`} className="btn-ghost">✏️ Edit</Link>
          <ConfirmDelete what={`"${place.name}" and all its outings`} onConfirm={async () => { await deletePlace(id); router.push("/places"); }} />
        </div>
      </div>

      <OutingForm placeId={id} onAdded={load} />

      <section className="space-y-2">
        <h2 className="text-xl font-bold">Outings ({place.outings.length})</h2>
        {place.outings.length === 0 && <p className="muted">No outings logged yet.</p>}
        {place.outings.map((o) => (
          <div key={o.id} className="card p-3 flex flex-wrap items-center gap-3">
            <b>{o.date}</b>
            <span>{"🐾".repeat(o.dog_rating)}</span>
            {o.miles != null && <span className="muted">{o.miles} mi</span>}
            {o.minutes != null && <span className="muted">{o.minutes} min</span>}
            {o.notes && <span className="flex-1">{o.notes}</span>}
            <span className="ml-auto"><ConfirmDelete what="this outing" onConfirm={async () => { await deleteOuting(o.id); load(); }} /></span>
          </div>
        ))}
      </section>
    </div>
  );
}

export default function PlaceDetailPage() {
  return <RequireAuth><Detail /></RequireAuth>;
}
