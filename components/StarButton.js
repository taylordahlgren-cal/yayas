"use client";
import { useState } from "react";
import { setStar } from "@/lib/data";

export default function StarButton({ placeId, starred, onChange }) {
  const [on, setOn] = useState(starred);
  const [busy, setBusy] = useState(false);
  async function toggle(e) {
    e.preventDefault(); // don't follow the card's link
    e.stopPropagation();
    if (busy) return;
    setBusy(true);
    const next = !on;
    setOn(next);
    try { await setStar(placeId, next); onChange?.(placeId, next); }
    catch { setOn(!next); }
    setBusy(false);
  }
  return (
    <button onClick={toggle} aria-label={on ? "Unstar" : "Star"} title={on ? "Unstar" : "Star"}
      className="text-2xl leading-none px-1" style={{ color: on ? "var(--accent)" : "var(--muted)" }}>
      {on ? "★" : "☆"}
    </button>
  );
}
