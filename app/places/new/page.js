"use client";
import RequireAuth from "@/components/RequireAuth";
import PlaceForm from "@/components/PlaceForm";

export default function NewPlacePage() {
  return (
    <RequireAuth>
      <h1 className="text-2xl font-bold mb-4">Add a place</h1>
      <PlaceForm />
    </RequireAuth>
  );
}
