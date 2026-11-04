import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { createClient } from "@supabase/supabase-js";

// PLAN.md test #1 (runs against the REAL Supabase database):
// Given User A has added the place "Tilden Park",
// when User B logs in and loads their places list,
// then User B sees zero places and cannot read Tilden Park by its id.
const URL = process.env.SUPABASE_URL;
const ANON = process.env.SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

describe("Data isolation", () => {
  if (!URL || !ANON || !SERVICE) {
    it("needs SUPABASE_URL, SUPABASE_ANON_KEY and SUPABASE_SERVICE_ROLE_KEY", () => {
      throw new Error("Missing Supabase env vars. Add them as GitHub Actions secrets (or export them locally).");
    });
    return;
  }

  const admin = createClient(URL, SERVICE, { auth: { persistSession: false } });
  const run = Date.now();
  const password = "Test-pass-" + run;
  const users = {};
  let tildenId;

  // A brand-new logged-in client for one user
  async function loginAs(email) {
    const c = createClient(URL, ANON, { auth: { persistSession: false } });
    const { error } = await c.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return c;
  }

  beforeAll(async () => {
    for (const who of ["a", "b"]) {
      const email = `isolation-${who}-${run}@yayas-test.dev`;
      const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
      if (error) throw error;
      users[who] = { id: data.user.id, email };
    }
    // User A adds a place
    const a = await loginAs(users.a.email);
    const { data, error } = await a.from("places").insert({ name: "Tilden Park", type: "trail" }).select().single();
    if (error) throw error;
    tildenId = data.id;
  });

  afterAll(async () => {
    for (const u of Object.values(users)) await admin.auth.admin.deleteUser(u.id); // also deletes their places
  });

  it("User A can see their own place", async () => {
    const a = await loginAs(users.a.email);
    const { data } = await a.from("places").select("name");
    expect(data.map((p) => p.name)).toContain("Tilden Park");
  });

  it("User B's places list is empty", async () => {
    const b = await loginAs(users.b.email);
    const { data, error } = await b.from("places").select("*"); // no filter: the database must do the filtering
    expect(error).toBeNull();
    expect(data).toHaveLength(0);
  });

  it("User B cannot read User A's place by its id", async () => {
    const b = await loginAs(users.b.email);
    const { data } = await b.from("places").select("*").eq("id", tildenId);
    expect(data).toHaveLength(0);
  });
});
