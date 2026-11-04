"use client";
import { AMENITIES, WARNINGS } from "@/lib/constants";
import { SORTS } from "@/lib/filters";

const chip = (on) => ({
  className: "px-3 py-1 rounded-full text-sm border",
  style: on ? { background: "var(--primary)", color: "white", borderColor: "var(--primary)" } : { borderColor: "var(--border)", background: "var(--card)" },
});

export default function FilterBar({ value, onChange, showSort = true, showSearch = true }) {
  const toggle = (list, k) => {
    const cur = value[list];
    onChange({ ...value, [list]: cur.includes(k) ? cur.filter((x) => x !== k) : [...cur, k] });
  };
  return (
    <div className="card p-4 space-y-3">
      {(showSearch || showSort) && (
        <div className="flex flex-col sm:flex-row gap-2">
          {showSearch && <input className="input" placeholder="🔍 Search places or tips…" value={value.query} onChange={(e) => onChange({ ...value, query: e.target.value })} />}
          {showSort && (
            <select className="input sm:w-56" value={value.sort} onChange={(e) => onChange({ ...value, sort: e.target.value })} aria-label="Sort">
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          )}
        </div>
      )}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold">Must have:</span>
        {AMENITIES.map((a) => <button key={a.key} type="button" {...chip(value.require.includes(a.key))} onClick={() => toggle("require", a.key)}>{a.emoji} {a.label}</button>)}
      </div>
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-sm font-semibold">Hide:</span>
        {WARNINGS.map((w) => <button key={w.key} type="button" {...chip(value.hide.includes(w.key))} onClick={() => toggle("hide", w.key)}>{w.emoji} {w.label}</button>)}
      </div>
    </div>
  );
}

export const EMPTY_FILTERS = { query: "", require: [], hide: [], sort: "newest" };
