# Prompt log: Dashboard test

**Prompt:** "Write a test for PLAN.md test #2: given 3 outings rated 5, 4 and 3, the dashboard's average dog rating is 4.0 and the count is 3. Then temporarily break the average so the test fails, show it failing, revert, and show it passing."

**What the agent did:** added Vitest, `tests/dashboard.test.js`, and a GitHub Actions workflow that runs the tests on every PR. Then it pushed three commits so the red → green trail is visible on the PR:
1. Test added → ✅
2. **RED:** `lib/stats.js` changed to divide by `count + 1` → ❌ "expected 3 to be 4"
3. **GREEN:** break reverted → ✅
