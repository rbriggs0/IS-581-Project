# Runbook: Live site smoke test failure

**Severity:** SEV1 until the live site is confirmed healthy  
**Alert path:** `.github/workflows/smoke.yml` opens or comments on a GitHub issue titled `SEV1: Live site smoke test failed` when the smoke job fails.

## SLO

Key Pages URLs (`/`, `/pages/quiz.html`, `/pages/results.html`, catalog JSON, `js/match.js`, `js/errors.js`, `styles.css`) return HTTP 200 within about two minutes after a successful `main` deploy. Catalog `gear.json` stays at least 27 guitars.

## First checks (5 minutes)

1. Open the failing Actions run linked from the issue and note which step failed.
2. Check [GitHub Status](https://www.githubstatus.com/) for Pages / Actions outages.
3. Hard-refresh the live site: https://rbriggs0.github.io/IS-581-Project/
4. Hit the failing path directly (for example `/data/gear.json`) and confirm status/body.

## Likely causes

| Symptom                                  | Likely cause                                                  | Action                                                             |
| ---------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------------ |
| 404 on a page or asset right after merge | Pages CDN still propagating                                   | Re-run the smoke workflow in 2–3 minutes                           |
| 404 that persists                        | Bad path, renamed/deleted file, or Pages not deploying `main` | Confirm “pages build and deployment” on `main`; fix path or revert |
| `gear.json` count below 27               | Catalog edit removed entries                                  | Restore guitars on a `fix/` branch; do not leave production thin   |
| JSON parse error                         | Invalid JSON in `data/`                                       | Fix JSON; `npm test` locally before merge                          |
| Intermittent curl failure                | Transient network                                             | Re-run workflow once; escalate only if it repeats                  |

## Recovery

1. If a recent merge caused the break, **revert first** via PR (`git revert`), merge, wait for Pages, then re-run smoke.
2. Otherwise fix forward on a `fix/` branch with a regression test when logic/data broke.
3. After green smoke, comment on the SEV1 issue with what happened and close it.
4. Add a short note to `brand-notes.md` (impact, fix, prevention).

## On-call

Default: repository owner. Confirm the live quiz → results path after any SEV1 close.
