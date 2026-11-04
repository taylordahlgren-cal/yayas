"use client";
import { useState } from "react";
import { addOuting } from "@/lib/data";
import { validateOuting } from "@/lib/validate";

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time
const RATINGS = [
  { n: 1, label: "Meh" },
  { n: 2, label: "OK" },
  { n: 3, label: "Good" },
  { n: 4, label: "Great" },
  { n: 5, label: "Best day ever" },
];
const EMPTY = () => ({ date: today(), minutes: "", miles: "", dog_rating: "", notes: "" });

export default function OutingForm({ placeId, onAdded }) {
  const [o, setO] = useState(EMPTY);
  const [error, setError] = useState("");
  const [fe, setFe] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setO((old) => ({ ...old, [k]: v }));
  const bad = (k) => (fe[k] ? { borderColor: "var(--danger)" } : undefined);

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = validateOuting(o);
    setFe(errs);
    if (Object.keys(errs).length) return setError(Object.values(errs).join(" "));
    setBusy(true);
    try {
      await addOuting({
        place_id: placeId,
        date: o.date,
        minutes: o.minutes === "" ? null : Number(o.minutes),
        miles: o.miles === "" ? null : Number(o.miles),
        dog_rating: Number(o.dog_rating),
        notes: o.notes.trim() || null,
      });
      setO(EMPTY());
      setFe({});
      onAdded(Number(o.dog_rating));
    } catch (err) {
      setError(err.message);
    }
    setBusy(false);
  }

  return (
    <form onSubmit={submit} noValidate className="card p-4 space-y-4">
      <div>
        <h3 className="font-bold text-lg">➕ Log an outing</h3>
        <p className="text-sm muted">Each outing powers your dashboard, ranks your favorite spots, and helps 🎲 Pick choose well.</p>
      </div>
      {error && <p className="error">{error}</p>}

      <div>
        <label className="label text-sm" htmlFor="date">Date *</label>
        <input id="date" type="date" className="input" style={bad("date")} value={o.date} onChange={(e) => set("date", e.target.value)} />
      </div>

      <fieldset>
        <legend className="label text-sm">How much did your dog like it? *</legend>
        <div className="grid grid-cols-5 gap-1.5" role="radiogroup">
          {RATINGS.map((r) => {
            const on = Number(o.dog_rating) === r.n;
            return (
              <button key={r.n} type="button" role="radio" aria-checked={on} onClick={() => set("dog_rating", r.n)}
                className="rounded-xl border py-2 px-1 text-center leading-tight"
                style={{
                  borderColor: on ? "var(--accent)" : fe.dog_rating ? "var(--danger)" : "var(--border)",
                  background: on ? "var(--accent)" : "var(--card)",
                  color: on ? "white" : "var(--text)",
                }}>
                <span className="block text-base font-bold">{r.n} 🐾</span>
                <span className="block text-[11px] sm:text-xs">{r.label}</span>
              </button>
            );
          })}
        </div>
      </fieldset>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="label text-sm" htmlFor="minutes">Minutes</label>
          <input id="minutes" type="number" inputMode="numeric" min="0" className="input" style={bad("minutes")} value={o.minutes} onChange={(e) => set("minutes", e.target.value)} />
        </div>
        <div>
          <label className="label text-sm" htmlFor="miles">Miles</label>
          <input id="miles" type="number" inputMode="decimal" min="0" step="0.1" className="input" style={bad("miles")} value={o.miles} onChange={(e) => set("miles", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label text-sm" htmlFor="notes">Notes</label>
        <input id="notes" className="input" placeholder="Optional: zoomies, mud, met a corgi…" value={o.notes} onChange={(e) => set("notes", e.target.value)} />
      </div>

      <button className="btn w-full sm:w-auto" disabled={busy}>{busy ? "Saving…" : "Log outing"}</button>
    </form>
  );
}
