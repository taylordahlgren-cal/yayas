"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function AuthForm({ mode }) {
  const isSignup = mode === "signup";
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!email.trim() || !password) return setError("Please enter your email and a password.");
    if (isSignup && password.length < 6) return setError("Passwords need at least 6 characters.");
    setBusy(true);
    const { data, error } = isSignup
      ? await supabase.auth.signUp({ email: email.trim(), password })
      : await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) return setError(error.message);
    if (isSignup && !data.session) return setError("Check your email to confirm your account, then log in.");
    router.push("/places");
  }

  return (
    <form onSubmit={submit} className="card p-6 max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-bold">{isSignup ? "Create your account" : "Welcome back"} 🐕</h1>
      {error && <p className="error">{error}</p>}
      <div>
        <label className="label" htmlFor="email">Email</label>
        <input id="email" type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label className="label" htmlFor="password">Password</label>
        <input id="password" type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <button className="btn w-full" disabled={busy}>{busy ? "…" : isSignup ? "Sign up" : "Log in"}</button>
      <p className="text-sm muted text-center">
        {isSignup ? <>Already have an account? <Link className="underline" href="/login">Log in</Link></>
                  : <>New here? <Link className="underline" href="/signup">Create an account</Link></>}
      </p>
    </form>
  );
}
