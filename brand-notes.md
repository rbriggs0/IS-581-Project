# FindYourSound — brand notes

## Mission statement (approved — not on site yet)

> FindYourSound helps you discover your unique tone and build your instrument around it without the overwhelm of endless options.

**Status:** Logged for future implementation. Do not add to the landing page until requested.

## Related brand lock-in

- **Business name:** FindYourSound
- **Domain (proposed):** getfindyoursound.com
- **Tagline:** Find your sound. Build your instrument.

## Product positioning (future direction)

Approved intent for upcoming work (not fully reflected on the live landing page yet):

- Recommend **pre-made guitars and equipment** that fit the user’s sound
- **Not** custom-from-the-ground-up (yet); full custom building stays a later-phase idea
- Matching can be **inspired by the player’s heroes** (favorite artists / their gear) to help users find their own unique sound

**Copy tension to watch:** The live tagline and some page copy still say “Build your instrument” / custom-build language. When implementing Phase 1, prefer pre-made match language so we don’t promise ground-up custom builds before that exists.

## Build roadmap (source of truth)

Refer to this whenever building features.

### Phase 0 — Foundation (done)

Brand, domain, landing page, hosting all live.

### Phase 1 — Build the MVP, one vertical slice at a time (Weeks 1–2)

Each slice = one input question, wired all the way through matching logic to a visible result, deployed and clickable before starting the next. Order follows what’s foundational first:

1. **Slice 1 — Music style:** quiz question → filters curated dataset by style → shows a result (even a rough one) → deployed. You now have an end-to-end working quiz, just narrow.
2. **Slice 2 — Acoustic/electric:** add the question → extend matching logic → confirm results update correctly → deploy.
3. **Slice 3 — Experience level:** same pattern — question, logic, results, deploy.
4. **Slice 4 — Budget:** same pattern.
5. **Slice 5 — Handedness:** same pattern.
6. **Slice 6 — Favorite artist (optional) + artist-gear reasoning:** this is the most complex slice (needs the verified artist-gear dataset), so it comes last even though it’s must-have — build it as its own complete pass: question → lookup → fallback-to-genre logic → results copy → deploy.

**Why this order:** each slice ends with something you could show a classmate and get real reactions to, rather than a broken app until week 2 is over. If you run short on time, you still have a working (just narrower) MVP instead of an unfinished one.

### Phase 2 — Validate (Weeks 3–4)

Test the whole sliced-together MVP with classmates and Reddit; track completion + trust feedback.

### Phase 3 — Layer in nice-to-haves, also as slices (Weeks 5–8)

Same slice discipline — pick one at a time based on what Phase 2 feedback actually asks for, not all three at once:

- Guitar images/specs slice
- Primary use context slice
- Aesthetic/color preference slice

Each one: add question (if needed) → extend logic/display → deploy → confirm it works before starting the next.

### Phase 4 — Package for the bigger pitch (Weeks 9–12+)

Turn usage data into pitch material; draft the roadmap slide for won’t-haves (live pricing, B2B licensing).

## Decision log

### Slice 1 — Music style (implemented)

- **What shipped:** Style-only quiz → filters `data/gear.json` → scrollable text results on `pages/results.html`
- **Styles:** rock, blues, jazz, folk, metal, country
- **Out of slice:** images, signup-to-claim, other quiz dimensions
- **Honesty:** Copy frames matches as curated pre-made starters, not custom builds
- **Next:** Deploy/test on Pages; then Slice 2 (acoustic/electric) only after checklist passes

### Slice 2 — Acoustic / electric (implemented)

- **What shipped:** Second quiz question (acoustic / electric / either) → `getMatches` filters by style + type (`either` skips type filter)
- **Empty combos:** Results show a clear message to try Either or another style
- **Out of slice:** experience, budget, handedness, artist, images, claim
- **Next:** Test on Pages; then Slice 3 (experience level) only after checklist passes

### Slice 3 — Experience level (implemented)

- **What shipped:** Third quiz question (beginner / intermediate / advanced / any) → each gear item has `levels[]` → filter combined with style + type
- **Out of slice:** budget, handedness, artist, images, claim
- **Next:** Test on Pages; then Slice 4 (budget) only after checklist passes

### Slice 4 — Budget (implemented)

- **What shipped:** Dual budget dial ($0–$5,000, step $50) for min + max → each gear item has `approxPrice` → filter `budgetMin <= approxPrice <= budgetMax`
- **UX:** Live “$X – $Y” readout; results show approximate prices; widen-range empty state when nothing fits
- **Price refresh:** `approxPrice` values updated from Guitar Center (and nearby major retailer) listings where found; each item has a `priceNote`. Still not live API pricing—re-check before a GC pitch.
- **Out of slice:** handedness, artist, images, claim
- **Next:** Test on Pages; then Slice 5 (handedness) only after checklist passes

## Working agreements (how we build)

FindYourSound-specific rules adapted from vibe-coding best practices. Follow these whenever prompting or shipping a slice.

1. **PRD before each slice** — Before coding, write a short what / who / how (even a few bullets). Clarity first; then implementation.
2. **Outline screens and flow** — Sketch quiz → matching → result (and any new screens) before generating UI, so paths aren’t guessed.
3. **Data + Git first** — Define the curated gear dataset shape before matching logic. Commit after each reviewed change. Don’t ship hard-coded front-end data that only *looks* like a working recommender.
4. **One slice at a time** — Same as Phase 1: one question → logic → visible result → deploy → then the next. No big-bang “build the whole app” prompts.
5. **Test before the next slice** — Click through locally and on GitHub Pages after each deploy. Check regressions before stacking more features.
6. **Log decisions** — Note important prompts, rejections, and why (in this file or a simple prompt log) so future you (or a teammate) isn’t reverse-engineering choices.
7. **Secrets** — Never paste credentials or tokens into prompts. Use environment variables when APIs arrive; ask for secure defaults (validation, parameterized queries, etc.).
8. **Prototype honesty** — A polished UI is not production. Phase 0–1 stays a prototype until real matching data and logic exist.
9. **Scale later** — When you need auth, a real database, or multi-user data, move beyond static vibe-coded pages into a structured backend—not endless stacked AI patches on a landing-page codebase.
