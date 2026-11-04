# schema.md: Yayas database

Four tables in Supabase (Postgres). Every table has **Row Level Security** turned on, so the database itself only returns rows that belong to the logged-in user.

```
users ──< places ──< outings
  │          │
  └──< stars >┘      (stars = junction table: "this user starred this place")
```

## users
One row per account, created automatically by a trigger when someone signs up.

| column | type | notes |
|---|---|---|
| id | uuid | **primary key**, same id as the Supabase Auth account |
| email | text | |
| share_token | text | random and unique; powers the public dog-sitter link |
| created_at | timestamp | |

## places
A park, trail, beach, neighborhood walk or (Dog Mode only) treat stop.

| column | type | notes |
|---|---|---|
| id | uuid | **primary key** |
| user_id | uuid | → users.id (**many places per user**) |
| name | text | required |
| type | text | trail / park / beach / neighborhood / treat stop |
| fenced, off_leash, swimming, walkable_from_home | true/false | amenities |
| crowded, bikers, kids | true/false | warnings |
| dont_go | true/false | 🚫 avoid list |
| share_with_sitter | true/false | appears on the public sitter link |
| tips | text | "remember for next time" |
| created_at | timestamp | |

## outings
One trip to a place.

| column | type | notes |
|---|---|---|
| id | uuid | **primary key** |
| user_id | uuid | → users.id |
| place_id | uuid | → places.id (**many outings per place**; deleting a place deletes its outings) |
| date | date | required |
| minutes | number | optional |
| miles | number | optional |
| dog_rating | number | required, 1–5 |
| notes | text | |
| created_at | timestamp | |

## stars
Junction table: one table for everyone, and each row means "this user starred this place."

| column | type | notes |
|---|---|---|
| user_id | uuid | → users.id, part of the **primary key** |
| place_id | uuid | → places.id, part of the **primary key** |
| created_at | timestamp | |

## Relationships
- **users → places:** one-to-many
- **places → outings:** one-to-many
- **users ↔ places through stars:** many-to-many

## Did the agent build what I designed? (vs. PLAN.md section 3)
Yes, with three small additions the agent made that weren't in my plan:
- `places.type` and the ratings have **database-level checks** (e.g. dog_rating must be 1–5), so bad data is blocked even if the form misses it.
- `user_id` **defaults to the logged-in user**, so the app never has to send it (and can't fake someone else's).
- Each table has a `created_at` column, which powers "newest first" sorting.
