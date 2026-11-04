# Prompt log: PLAN.md

Key prompts I (Taylor) gave Claude Code while planning, in order:

1. "I'm thinking I'd like to track either hikes / walks / parks that are good to take my dogs, or coffee shops that are rated based on quality of coffee, vibes, or food"
   - Agent laid out a table design for each option. **I chose dogs.**
2. "let's do most visited badge and track features like fenced in, off-leash friendly, swimming available, and then maybe some warnings like tends to be crowded, bikers around, or children around, or even a very bad don't go here type of tracking?"
   - Agent pointed out these are mostly *columns on a place*, not separate features, and asked whether warnings belong to the place or each outing. **I decided: warnings belong to the place.**
3. "could I add a notes to remember / for future reference feature? What kind of features would be cool on an app like this?"
   - Became the "tips" field. Agent flagged map view / photo upload / weather as risky (outside services). I skipped them.
4. "let's do random pick feature and maybe allow for me to add parameters? + dog mode? a public share link could be cool to share with other dog people (like my dog sitter)? ... or even add something for parks and things that are walking distance from my house?"
   - **My 3 features: random pick with filters, sitter share link, Dog Mode.** Walking distance became a simple "walkable from home" checkbox instead of a map.
5. "instead of dark mode can we call it dog mode? and maybe it goes dark and also adds paw prints and poop emojis and dogs and things?"
6. "for the dog mode, it could show some dog stores that only show on that mode" → secret "treat stop" place type.
7. Name: first draft was "Sniff Spots"; I caught that **Sniffspot is an existing app**, and we renamed it **Yayas** ("get your yayas out").

Agent then drafted PLAN.md from these decisions; I reviewed it before merging.

---

## Agent responses on the sitter link (added Nov 4 from the chat transcript, for my reflection)

After my prompt *"a public share link could be cool to share with other dog people (like my dog sitter)? I'm often sending suggestions to my dog sitters…"*, the agent replied:

> "A lot of these combine neatly, and the dog sitter idea is the strongest one so far because it's a real problem you have."

> "**The share link is the riskiest of the three.** It must show only what you shared and never anyone else's data. I'd put it in section 7, 'Risks and cuts.'"

Its proposed version was only *"a read-only page you can text to your dog sitter… The sitter doesn't need an account."* It never mentioned which name would appear on the page. The heading "taylor_dahlgren's dog-approved spots" (from my email address) was decided later, in code, in PR #22, without being discussed.
