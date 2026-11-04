"use client";
import { useEffect, useState } from "react";
import RequireAuth from "@/components/RequireAuth";
import ConfirmDelete from "@/components/ConfirmDelete";
import { listPlaces, getMyShareToken, resetShareToken, setShared } from "@/lib/data";
import { typeInfo } from "@/lib/constants";

function Share() {
  const [places, setPlaces] = useState(null);
  const [token, setToken] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    Promise.all([listPlaces(), getMyShareToken()])
      .then(([p, t]) => { setPlaces(p); setToken(t); })
      .catch((e) => setError(e.message));
  }, []);
  if (error) return <p className="error">{error}</p>;
  if (!places) return <p className="muted">Loading…</p>;

  const url = typeof window !== "undefined" ? `${window.location.origin}/s/${token}` : "";
  const shareable = places.filter((p) => !p.dont_go && p.type !== "treat stop");
  const sharedCount = shareable.filter((p) => p.share_with_sitter).length;

  async function toggle(p) {
    const next = !p.share_with_sitter;
    setPlaces((old) => old.map((x) => (x.id === p.id ? { ...x, share_with_sitter: next } : x)));
    try { await setShared(p.id, next); } catch (e) { setError(e.message); }
  }

  async function copy() {
    try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch {}
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">🔗 Share with my dog sitter</h1>
        <p className="muted">Anyone with this link can see the places you check below, including their tips. They can&apos;t see your outings or anything else, and they don&apos;t need an account.</p>
      </div>
      <div className="card p-4 space-y-3">
        <div className="flex gap-2">
          <input readOnly className="input font-mono text-sm" value={url} onFocus={(e) => e.target.select()} />
          <button className="btn shrink-0" onClick={copy}>{copied ? "Copied! ✓" : "Copy link"}</button>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <a href={url} target="_blank" rel="noreferrer" className="btn-ghost text-sm">👀 Preview what the sitter sees</a>
          <ConfirmDelete label="Reset link" what="the old link (it will stop working)"
            onConfirm={async () => setToken(await resetShareToken())} />
        </div>
      </div>
      <section className="space-y-2">
        <h2 className="font-bold">Places to share ({sharedCount} shared)</h2>
        {shareable.length === 0 && <p className="muted">Add some places first.</p>}
        {shareable.map((p) => (
          <label key={p.id} className="card p-3 flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={p.share_with_sitter} onChange={() => toggle(p)} />
            <span className="text-2xl">{typeInfo(p.type).emoji}</span>
            <span className="flex-1 font-semibold">{p.name}</span>
            {p.walkable_from_home && <span className="text-sm">🏠 walkable</span>}
          </label>
        ))}
        <p className="text-sm muted">🚫 Don&apos;t-go places are never shared.</p>
      </section>
    </div>
  );
}

export default function SharePage() {
  return <RequireAuth><Share /></RequireAuth>;
}
