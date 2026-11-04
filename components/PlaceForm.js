"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLACE_TYPES, AMENITIES, WARNINGS } from "@/lib/constants";
import { savePlace } from "@/lib/data";
import { validatePlace } from "@/lib/validate";
import { useDogMode } from "@/components/DogMode";

const EMPTY = {
  name: "", type: "park", tips: "",
  fenced: false, off_leash: false, swimming: false, walkable_from_home: false,
  crowded: false, bikers: false, kids: false, dont_go: false, share_with_sitter: false,
};

export default function PlaceForm({ initial, id }) {
  const router = useRouter();
  const { dog } = useDogMode();
  const [p, setP] = useState(() => {
    const base = { ...EMPTY };
    if (initial) Object.keys(EMPTY).forEach((k) => (base[k] = initial[k] ?? EMPTY[k]));
    return base;
  });
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const set = (k, v) => setP((old) => ({ ...old, [k]: v }));

  async function submit(e) {
    e.preventDefault();
    setError("");
    const errs = validatePlace(p);
    setFieldErrors(errs);
    if (Object.keys(errs).length) return setError("Almost! Please fix the highlighted field.");
    setBusy(true);
    try {
      const saved = await savePlace({ ...p, name: p.name.trim() }, id);
      router.push(`/places/${saved.id}`);
    } catch (err) {
      setError(err.message);
      setBusy(false);
    }
  }

  const Check = ({ k, label, emoji }) => (
    <label className="flex items-center gap-2 cursor-pointer">
      <input type="checkbox" checked={p[k]} onChange={(e) => set(k, e.target.checked)} /> {emoji} {label}
    </label>
  );

  return (
    <form onSubmit={submit} noValidate className="card p-6 space-y-5">
      {error && <p className="error">{error}</p>}
      <div>
        <label className="label" htmlFor="name">Name *</label>
        <input id="name" className="input" value={p.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Point Isabel Dog Park"
          style={fieldErrors.name ? { borderColor: "var(--danger)" } : undefined} />
        {fieldErrors.name && <p className="text-sm mt-1" style={{ color: "var(--danger)" }}>{fieldErrors.name}</p>}
      </div>
      <div>
        <label className="label" htmlFor="type">Type</label>
        <select id="type" className="input" value={p.type} onChange={(e) => set("type", e.target.value)}>
          {PLACE_TYPES.filter((t) => !t.dogModeOnly || dog || p.type === t.value).map((t) => <option key={t.value} value={t.value}>{t.emoji} {t.label}</option>)}
        </select>
      </div>
      <fieldset>
        <legend className="label">👍 Good stuff</legend>
        <div className="grid grid-cols-2 gap-2">{AMENITIES.map((a) => <Check key={a.key} k={a.key} {...a} />)}</div>
      </fieldset>
      <fieldset>
        <legend className="label">⚠️ Warnings</legend>
        <div className="grid grid-cols-2 gap-2">
          {WARNINGS.map((w) => <Check key={w.key} k={w.key} {...w} />)}
          <Check k="dont_go" label="Don't go here" emoji="🚫" />
        </div>
      </fieldset>
      <div>
        <label className="label" htmlFor="tips">📌 Remember for next time</label>
        <textarea id="tips" className="input" rows={3} value={p.tips || ""} onChange={(e) => set("tips", e.target.value)} placeholder="Park at the north lot. Bring a towel!" />
      </div>
      <Check k="share_with_sitter" label="Share with my dog sitter" emoji="🔗" />
      <div className="flex gap-3">
        <button className="btn" disabled={busy}>{busy ? "Saving…" : id ? "Save changes" : "Add place"}</button>
        <button type="button" className="btn-ghost" onClick={() => router.back()}>Cancel</button>
      </div>
    </form>
  );
}
