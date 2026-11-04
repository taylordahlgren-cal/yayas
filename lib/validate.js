// Friendly validation. Returns an object of { field: message }; empty object = valid.
export function validatePlace(p) {
  const errors = {};
  if (!p.name || !p.name.trim()) errors.name = "Give this place a name, like \"Point Isabel Dog Park\".";
  else if (p.name.trim().length > 80) errors.name = "That name is a bit long. Keep it under 80 characters.";
  return errors;
}

export function validateOuting(o) {
  const errors = {};
  if (!o.date) errors.date = "Pick the date you went.";
  else if (o.date > new Date().toLocaleDateString("en-CA")) errors.date = "That date is in the future. Log outings after they happen!";
  if (o.dog_rating === "" || o.dog_rating == null) errors.dog_rating = "How much did your dog like it? Pick 1–5 paws.";
  if (o.miles !== "" && Number(o.miles) < 0) errors.miles = "Miles can't be negative.";
  if (o.minutes !== "" && Number(o.minutes) < 0) errors.minutes = "Minutes can't be negative.";
  return errors;
}
