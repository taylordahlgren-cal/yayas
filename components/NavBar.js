"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";
import { useDogMode } from "@/components/DogMode";

export default function NavBar() {
  const { user } = useAuth();
  const { dog, toggle } = useDogMode();
  const router = useRouter();

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header style={{ background: "var(--primary)" }} className="text-white">
      <nav className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link href="/" className="text-xl font-bold mr-auto">{dog ? "🐶 Yayas" : "🐾 Yayas"}</Link>
        {user ? (
          <>
            <Link href="/places">Places</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/pick">🎲 Pick</Link>
            <Link href="/share">🔗 Sitter</Link>
            <button onClick={toggle} className="px-3 py-1 rounded-full text-sm font-semibold" style={{ background: dog ? "var(--accent)" : "rgba(255,255,255,0.15)" }}
              title="Toggle Dog Mode">{dog ? "🐶 Dog Mode ON" : "🌙 Dog Mode"}</button>
            <button onClick={logOut} className="underline">Log out</button>
          </>
        ) : (
          <>
            <Link href="/login">Log in</Link>
            <Link href="/signup" className="btn">Sign up</Link>
          </>
        )}
      </nav>
    </header>
  );
}
