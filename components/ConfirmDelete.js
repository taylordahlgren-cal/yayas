"use client";
import { useState } from "react";

// Two-step delete: first click asks "Are you sure?", second click deletes.
export default function ConfirmDelete({ onConfirm, label = "Delete", what = "this" }) {
  const [asking, setAsking] = useState(false);
  if (!asking)
    return <button type="button" className="btn-ghost" style={{ color: "var(--danger)" }} onClick={() => setAsking(true)}>{label}</button>;
  return (
    <span className="inline-flex items-center gap-2 error">
      Are you sure you want to delete {what}?
      <button type="button" className="btn" style={{ background: "var(--danger)" }} onClick={onConfirm}>Yes, delete</button>
      <button type="button" className="btn-ghost" onClick={() => setAsking(false)}>Cancel</button>
    </span>
  );
}
