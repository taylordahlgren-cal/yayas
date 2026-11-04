"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/lib/supabase";

export default function NavBar() {
  const { user } = useAuth();
  const router = useRouter();

  async function logOut() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header style={{ background: "var(--primary)" }} className="text-white">
      <nav className="max-w-3xl mx-auto px-4 py-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Link href="/" className="text-xl font-bold mr-auto">🐾 Yayas</Link>
        {user ? (
          <>
            <Link href="/places">Places</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/pick">🎲 Pick</Link>
            <Link href="/share">🔗 Sitter</Link>
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
