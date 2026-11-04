import { supabase } from "@/lib/supabase";

// All queries rely on row-level security: the database only returns the logged-in user's rows.
export async function listPlaces() {
  const { data, error } = await supabase
    .from("places")
    .select("*, outings(id, dog_rating, date)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getPlace(id) {
  const { data, error } = await supabase
    .from("places")
    .select("*, outings(*)")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (data) data.outings.sort((a, b) => (a.date < b.date ? 1 : -1));
  return data;
}

export async function savePlace(place, id) {
  const q = id
    ? supabase.from("places").update(place).eq("id", id).select().single()
    : supabase.from("places").insert(place).select().single();
  const { data, error } = await q;
  if (error) throw error;
  return data;
}

export async function deletePlace(id) {
  const { error } = await supabase.from("places").delete().eq("id", id);
  if (error) throw error;
}

export async function addOuting(outing) {
  const { error } = await supabase.from("outings").insert(outing);
  if (error) throw error;
}

export async function deleteOuting(id) {
  const { error } = await supabase.from("outings").delete().eq("id", id);
  if (error) throw error;
}

export async function listOutings() {
  const { data, error } = await supabase.from("outings").select("*, places(name)").order("date");
  if (error) throw error;
  return data;
}

// ---- Stars (junction table: user_id + place_id) ----
export async function listStarIds() {
  const { data, error } = await supabase.from("stars").select("place_id");
  if (error) throw error;
  return new Set(data.map((s) => s.place_id));
}

export async function setStar(placeId, starred) {
  const { error } = starred
    ? await supabase.from("stars").insert({ place_id: placeId })
    : await supabase.from("stars").delete().eq("place_id", placeId);
  if (error) throw error;
}

// ---- Sitter share link ----
export async function getMyShareToken() {
  const { data, error } = await supabase.from("users").select("share_token").single();
  if (error) throw error;
  return data.share_token;
}

export async function resetShareToken() {
  const { data, error } = await supabase.rpc("reset_share_token");
  if (error) throw error;
  return data;
}

export async function setShared(placeId, shared) {
  const { error } = await supabase.from("places").update({ share_with_sitter: shared }).eq("id", placeId);
  if (error) throw error;
}

// Public: works without logging in.
export async function getSharedPlaces(token) {
  const { data, error } = await supabase.rpc("get_shared_places", { token });
  if (error) throw error;
  return data;
}
