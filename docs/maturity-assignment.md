# Start Maturing Your Product — FindYourSound

**Product:** FindYourSound (Option 1 — own MVP)  
**Live site:** https://rbriggs0.github.io/IS-581-Project/  
**Repo:** https://github.com/rbriggs0/IS-581-Project  
**Maturity model:** [Technology Maturity Model](https://playbook.jeffreyjenkins.me/)  
**Date:** November 2026

## How we chose the three steps

FindYourSound already had solid tooling and delivery (ESLint, Prettier, Husky, `node:test`, CI, CodeQL, gitleaks, Dependabot, live smoke). The [maturity questionnaire](https://playbook.jeffreyjenkins.me/questionnaire) asks first whether you know quickly when customers hit errors or the system is down. For this static GitHub Pages app the honest answer was **no** — that is the first gap (**Observability**).

The next high-impact gaps for scale/reliability on this stack were:

- **Testing** — unit tests cover matching logic, but not the real browser path (form → URL → DOM/layout).
- **Infrastructure → Networking and security** — escaping lived only inside one page, and there was no browser Content-Security-Policy layer.

No new runtime browser dependencies were added (Playwright is dev/CI only).

---

## 1. Observability — frontend errors + smoke alerts + runbook

**Model domain:** Observability → Error monitoring, Alerting, Incident response

### Why this is most important

Without visibility, a broken quiz/results page or a bad Pages deploy can sit unnoticed until a user complains. The questionnaire’s first gap is exactly this. Closing it matures reliability: detect failures, alert someone, and have a runbook.

### What we implemented

- `js/errors.js` — `error` / `unhandledrejection` handlers that show a dismissible on-page banner (no third-party SDK, no PII)
- Wired on `pages/quiz.html` and `pages/results.html`
- `.github/workflows/smoke.yml` — on failure, opens or comments on a GitHub issue titled `SEV1: Live site smoke test failed`
- `docs/RUNBOOK-smoke.md` — diagnose/recover steps
- SLO note in `docs/PLAYBOOK.md` (key URLs return 200 soon after deploy)

### Evidence (screenshots to capture)

1. Quiz or results page with the error banner visible (force a test error in DevTools console, e.g. `throw new Error("demo")` after the handlers install, or temporarily break a fetch).
2. Smoke workflow YAML showing the “Open or update smoke-failure issue” step.
3. `docs/RUNBOOK-smoke.md` open in the repo / browser.

---

## 2. Testing — Playwright E2E for quiz → results

**Model domain:** Testing → Test types, Automation and quality gates

### Why this is most important

`js/match.js` unit tests never click the quiz or assert layout. Regressions like “Popular in Style stuck beside the cards” slip through. Browser E2E makes deploys less scary and is the playbook’s stated next testing step.

### What we implemented

- `@playwright/test` (devDependency) with `npm run test:e2e` / `npm run test:e2e:ui`
- `e2e/quiz-results.spec.js`:
  - Happy path: Rock / Acoustic / budget → match cards; Popular section **below** the grid
  - Hardening: odd query params do not inject raw HTML
  - Security meta tags present on `/` and `/pages/quiz.html`
- CI job “Playwright E2E” in `.github/workflows/ci.yml` (local `http-server` + Chromium)

### Evidence (screenshots to capture)

1. Local terminal output: `npm run test:e2e` with **3 passed**.
2. GitHub Actions run showing the Playwright E2E job green.
3. Optional: Playwright HTML/list reporter output.

---

## 3. Infrastructure / security — CSP + shared sanitize

**Model domain:** Infrastructure → Networking and security

### Why this is most important

Static sites still face XSS if untrusted text is interpolated into HTML. Escaping existed only inside `results.html`, and the browser had no policy restricting script/font sources. CSP + a shared sanitize helper mature security without adding a backend.

### What we implemented

- `js/sanitize.js` — shared `escapeHtml` used by results rendering (+ unit tests in `tests/sanitize.test.js`)
- Security meta tags on HTML pages: Content-Security-Policy, Referrer-Policy, Permissions-Policy (camera/mic/geo off)
- Smoke asserts CSP / referrer / permissions meta on `/` and `/pages/quiz.html`
- `SECURITY.md` updated

### Evidence (screenshots to capture)

1. Chrome DevTools → Elements → `<head>` on quiz showing the three security meta tags.
2. `js/sanitize.js` and import in `pages/results.html`.
3. Smoke workflow step “Security meta tags present on home and quiz”.

---

## Summary table

| #   | Change                                    | Maturity domain           | Primary files                                        |
| --- | ----------------------------------------- | ------------------------- | ---------------------------------------------------- |
| 1   | Error banner + smoke SEV1 issue + runbook | Observability             | `js/errors.js`, `smoke.yml`, `docs/RUNBOOK-smoke.md` |
| 2   | Playwright quiz→results E2E in CI         | Testing                   | `e2e/`, `playwright.config.js`, `ci.yml`             |
| 3   | CSP meta + shared `escapeHtml`            | Infrastructure / security | `js/sanitize.js`, HTML heads, `SECURITY.md`          |

## How to verify locally

```bash
npm ci
npm run check
npx playwright install chromium   # first time only
npm run test:e2e
npm start                         # then open quiz / results
```
