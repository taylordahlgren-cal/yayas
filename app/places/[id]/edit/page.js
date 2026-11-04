"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import RequireAuth from "@/components/RequireAuth";
import PlaceForm from "@/components/PlaceForm";
import { getPlace } from "@/lib/data";

function Edit() {
  const { id } = useParams();
  const [place, setPlace] = useState(undefined);
  useEffect(() => { getPlace(id).then(setPlace).catch(() => setPlace(null)); }, [id]);
  if (place === undefined) return <p className="muted">Loading…</p>;
  if (!place) return <p className="error">Place not found.</p>;
  return (<><h1 className="text-2xl font-bold mb-4">Edit {place.name}</h1><PlaceForm initial={place} id={id} /></>);
}

export default function EditPlacePage() {
  return <RequireAuth><Edit /></RequireAuth>;
}
