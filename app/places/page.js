"use client";
import RequireAuth from "@/components/RequireAuth";
import { useAuth } from "@/components/AuthProvider";

function Places() {
  const { user } = useAuth();
  return <p>Logged in as <b>{user.email}</b>. Your places will show up here.</p>;
}

export default function PlacesPage() {
  return <RequireAuth><Places /></RequireAuth>;
}
