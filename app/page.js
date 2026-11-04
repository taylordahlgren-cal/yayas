"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => { if (!loading && user) router.replace("/places"); }, [user, loading, router]);

  return (
    <section className="text-center py-12 space-y-5">
      <p className="text-6xl">🐕💨</p>
      <h1 className="text-4xl font-bold">Yayas</h1>
      <p className="text-lg muted">Where my dogs go to get their yayas out.<br />Log the parks, trails and beaches your dogs love.</p>
      <div className="flex justify-center gap-3">
        <Link href="/signup" className="btn">Create an account</Link>
        <Link href="/login" className="btn-ghost">Log in</Link>
      </div>
    </section>
  );
}
