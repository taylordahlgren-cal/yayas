# Prompt log: iPhone date box fix

**My prompt:** "the date box is still a little off" (with a screenshot from my iPhone after PR #36)

**What the agent found:** iPhone Safari gives `<input type="date">` a built-in minimum width, so the box stuck out past the right edge of the card. Desktop browsers and the agent's simulated phone screenshots did not show it; **only a real iPhone did.**

**Fix:** reset Safari's native styling on date inputs and cap the width at 100%.
