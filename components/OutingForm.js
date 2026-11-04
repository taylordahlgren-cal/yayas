"use client";
import { useState } from "react";
import { addOuting } from "@/lib/data";
import { validateOuting } from "@/lib/validate";

const today = () => new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD in local time

export default function OutingForm({ placeId, onAdded }) {
  const [o, setO] = useState({ date: today(), minutes: "", miles: "", dog_rating: "", notes: "" });
  const [error, setError] = useState("");
  const [fe, setFe] = useState({});
  const set = (k, v) => setO((old) => ({ ...old, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = validateOuting(o);
    setFe(errs);
    if (Object.keys(errs).length) return setError(Object.values(errs).join(" "));
    try {
      await addOuting({
        place_id: placeId,
        date: o.date,
        minutes: o.minutes === "" ? null : Number(o.minutes),
        miles: o.miles === "" ? null : Number(o.miles),
        dog_rating: o.dog_rating === "" ? null : Number(o.dog_rating),
        notes: o.notes.trim() || null,
      });
      setO({ date: today(), minutes: "", miles: "", dog_rating: "", notes: "" });
      setFe({});
      onAdded();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <form onSubmit={submit} noValidate className="card p-4 space-y-3">
      <h3 className="font-bold">➕ Log an outing</h3>
      {error && <p className="error">{error}</p>}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div><label className="label text-sm" htmlFor="date">Date *</label><input id="date" style={fe.date ? { borderColor: "var(--danger)" } : undefined} type="date" className="input" value={o.date} onChange={(e) => set("date", e.target.value)} /></div>
        <div><label className="label text-sm" htmlFor="minutes">Minutes</label><input id="minutes" style={fe.minutes ? { borderColor: "var(--danger)" } : undefined} type="number" min="0" className="input" value={o.minutes} onChange={(e) => set("minutes", e.target.value)} /></div>
        <div><label className="label text-sm" htmlFor="miles">Miles</label><input id="miles" style={fe.miles ? { borderColor: "var(--danger)" } : undefined} type="number" min="0" step="0.1" className="input" value={o.miles} onChange={(e) => set("miles", e.target.value)} /></div>
        <div>
          <label className="label text-sm" htmlFor="rating">Dog rating *</label>
          <select id="rating" style={fe.dog_rating ? { borderColor: "var(--danger)" } : undefined} className="input" value={o.dog_rating} onChange={(e) => set("dog_rating", e.target.value)}>
            <option value="">–</option>
            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{"🐾".repeat(n)} {n}</option>)}
          </select>
        </div>
      </div>
      <input className="input" placeholder="Notes (optional)" value={o.notes} onChange={(e) => set("notes", e.target.value)} />
      <button className="btn">Log outing</button>
    </form>
  );
}
