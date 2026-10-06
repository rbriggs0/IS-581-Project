# FindYourSound Tech Employee Playbook

**Version:** 1.0 · **Last updated:** October 6, 2026 · **Owner:** Ryan (GitHub [@rbriggs0](https://github.com/rbriggs0))

This playbook is how we build and ship FindYourSound, a guitar-matching quiz that pairs players and gift shoppers with real guitars from a curated catalog. Read it on day one. Everything it describes is already set up in the repository; links go to the real files and pages.

## Quick links

| What                                 | Where                                                                 |
| ------------------------------------ | --------------------------------------------------------------------- |
| Live site                            | https://rbriggs0.github.io/IS-581-Project/                            |
| Quiz (main product page)             | https://rbriggs0.github.io/IS-581-Project/pages/quiz.html             |
| Source code                          | https://github.com/rbriggs0/IS-581-Project                            |
| Issues                               | https://github.com/rbriggs0/IS-581-Project/issues                     |
| Kanban board                         | https://github.com/rbriggs0/IS-581-Project/projects                   |
| CI runs (GitHub Actions)             | https://github.com/rbriggs0/IS-581-Project/actions                    |
| Security alerts (CodeQL, Dependabot) | https://github.com/rbriggs0/IS-581-Project/security                   |
| This playbook (source)               | https://github.com/rbriggs0/IS-581-Project/blob/main/docs/PLAYBOOK.md |

## Contents

1. Language Selection
2. IDE Selection and Setup
3. Development Strategy
4. Git Strategy and Controls
5. Issue Tracking
6. AI Agents and Controls
7. Code Quality
8. Testing Frameworks
9. Other Controls, Tools, and Procedures
10. Day-One Checklist

## 1. Language Selection

### What we use

| Layer       | Language / format                                    | Where it lives                                                           |
| ----------- | ---------------------------------------------------- | ------------------------------------------------------------------------ |
| Markup      | HTML5                                                | `index.html`, `pages/*.html`                                             |
| Styling     | CSS3 (custom properties, no preprocessor)            | `styles.css`                                                             |
| Logic       | JavaScript (ES2022, native ES modules, no framework) | `js/match.js`, `js/visuals.js`, inline `<script type="module">` in pages |
| Data        | JSON                                                 | `data/gear.json`, `data/gear-extras.json`, `data/artists.json`           |
| Dev tooling | Node.js 22 LTS (tools only, never shipped to users)  | `package.json`, `tests/`                                                 |

### Why

- **No build step.** GitHub Pages serves our files exactly as written. What you review in a PR is what users get, and there is no bundler to configure or break.
- **Zero runtime dependencies.** The browser loads only our own code, so there is nothing third-party to patch on the live site.
- **The problem fits.** The catalog is 27 guitars and 19 artists. JSON files are easy to review in a PR, and a database would add cost and risk with no benefit.
- **Testable logic.** `js/match.js` is plain functions with no DOM access, so the same file runs in the browser and in Node's test runner.
- **Team familiarity.** Everyone on the team already writes JavaScript; there is no framework learning curve before shipping a slice.

### What we considered and rejected

- **React / Next.js:** adds a build pipeline and hundreds of dependencies for two interactive pages.
- **TypeScript:** worth revisiting if the codebase grows. For now, exported functions in `js/match.js` carry JSDoc type comments.
- **A backend (Python/Flask, Node/Express):** GitHub Pages cannot run server code, and we store no user data. If we add accounts, saved results, or live prices, we will write a decision record and revisit.

### Rules

- Use ES modules (`import` / `export`) only. No global scripts.
- Use `const` and `let`, never `var` (ESLint enforces this).
- Do not add a library that the browser loads without an approved issue.
- Support the latest two versions of Chrome, Edge, Firefox, and Safari.

## 2. IDE Selection and Setup

### Standard IDE: Cursor

We use **Cursor** ([download](https://cursor.com/download)), an editor built on VS Code with an AI agent that reads our project rules in `.cursor/rules/`. Those rules carry our AI guardrails (section 6), so using Cursor means the guardrails apply automatically.

**Approved alternative:** Visual Studio Code ([download](https://code.visualstudio.com/download)). Our `.vscode/` settings and extension list work the same way. AI guardrails in section 6 still apply to any AI tool you use.

### Setup steps (about 20 minutes)

1. Install **Git**: https://git-scm.com/downloads. Then set your identity:
   `git config --global user.name "Your Name"` and `git config --global user.email "you@example.com"`
2. Install **Node.js 22 LTS**: https://nodejs.org/en/download. Check with `node -v` (should print v22 or higher).
3. Install **Cursor** from https://cursor.com/download and sign in.
4. Turn on **Privacy Mode**: Cursor Settings → General → Privacy Mode → On. This is required (see section 6).
5. Clone the repo: in Cursor, open the Command Palette (`Ctrl+Shift+P`) → "Git: Clone" → paste `https://github.com/rbriggs0/IS-581-Project.git`. Or in a terminal:
   `git clone https://github.com/rbriggs0/IS-581-Project.git`
6. Open the folder. When Cursor asks **"Install recommended extensions?"**, click **Install**. The list comes from `.vscode/extensions.json`:
   - ESLint (`dbaeumer.vscode-eslint`)
   - Prettier (`esbenp.prettier-vscode`)
   - EditorConfig (`editorconfig.editorconfig`)
   - GitHub Actions (`github.vscode-github-actions`)
   - GitHub Pull Requests (`github.vscode-pull-request-github`)
   - Live Server (`ritwickdey.liveserver`)
7. In the integrated terminal (`` Ctrl+` ``), run `npm install`. This installs the dev tools and the pre-commit hook.
8. Run `npm start`. The quiz opens at http://localhost:8080/pages/quiz.html.
9. Run `npm run check`. You are set up when lint, format check, and all tests pass.
10. Confirm the AI rules loaded: Cursor Settings → Rules should list `project-guardrails` (always on) and `data-conventions`.

### Workspace settings already in the repo

| File                      | What it does                                                                                      |
| ------------------------- | ------------------------------------------------------------------------------------------------- |
| `.vscode/settings.json`   | Format on save with Prettier, ESLint auto-fix on save, LF line endings, trims trailing whitespace |
| `.vscode/extensions.json` | Recommended extension list shown on first open                                                    |
| `.editorconfig`           | 2-space indent, UTF-8, LF, final newline (works in any editor)                                    |
| `.gitattributes`          | Normalizes line endings to LF so Windows and Mac diffs stay clean                                 |
| `.cursor/rules/*.mdc`     | AI agent guardrails (section 6)                                                                   |

### Troubleshooting

- **Quiz shows "Loading matches…" forever:** you opened the HTML file directly (`file://`). Browsers block `fetch` of JSON on `file://`. Use `npm start` instead.
- **PowerShell says `npm.ps1 cannot be loaded`:** run `Set-ExecutionPolicy -Scope CurrentUser RemoteSigned` once, then reopen the terminal.
- **Live site looks stale after a merge:** hard refresh with `Ctrl+F5` (Windows) or `Cmd+Shift+R` (Mac). Pages takes about a minute to redeploy.

## 3. Development Strategy

### Kanban, not Scrum

We use **Kanban**. Work flows continuously as small vertical slices, and each one ships to the live site as soon as it is merged. We chose Kanban over Scrum because:

- The team is small, and fixed two-week sprints added ceremony without improving delivery.
- Every merged PR deploys immediately, so there is no reason to batch work into sprint releases.
- Course deadlines already act as milestones; we use GitHub milestones for those instead of sprints.

### What a vertical slice is

A slice is one user-visible capability that cuts through every layer it needs (quiz question, matching logic, results display, data, tests) and can ship on its own. Our history shows the size we aim for:

| Slice                    | What shipped                                                                           |
| ------------------------ | -------------------------------------------------------------------------------------- |
| Slice 5: Handedness      | Left/right question, `hands` on every guitar, lefty badge on results                   |
| Slice 6: Favorite artist | Optional artist picker, signature guitars sorted first, "Because you selected…" badges |
| Phase 3, Slice A         | Real product photos and spec tables for all 27 guitars                                 |
| Phase 3, Slice B         | Primary-use question (practice, songwriting, recording, live, travel) as a soft sort   |

If a slice would take more than about a day, split it.

### Board columns and limits

| Column      | Means                                           | Limit                      |
| ----------- | ----------------------------------------------- | -------------------------- |
| Backlog     | Captured idea, not yet refined                  | none                       |
| Ready       | Meets Definition of Ready; anyone can pull it   | 5 (keeps priorities sharp) |
| In Progress | Someone is actively building it on a branch     | 2 per person               |
| In Review   | PR is open and waiting on review or CI          | 3 total                    |
| Done        | Merged, deployed, and verified on the live site | none                       |

**Definition of Ready:** uses an issue template, has checkable acceptance criteria, sized S or M, and has an `area:` label.

**Definition of Done:** PR merged with green CI, every acceptance criterion checked, verified on the live site after a hard refresh, and `brand-notes.md` updated if product behavior changed.

### Day to day

1. **Async standup by 10:00 AM** in the team chat: what you finished, what you are doing today, anything blocking you.
2. **Pull work from the top of Ready.** Assign yourself and drag the card to In Progress. Do not start new work while you are at your WIP limit; help review instead.
3. **Branch and build** (section 4). Commit small, run `npm run check` before you push.
4. **Open a draft PR early** so others can see progress. Mark it Ready for review when done; the card moves to In Review.
5. **Review others' PRs within one business day.** Reviews beat starting new work.
6. **After merge,** check the live site, then move the card to Done.

### Weekly rhythm

- **Monday, 30 minutes: replenishment.** Order the backlog, refine the top five items to Ready, review Dependabot PRs.
- **Friday, 15 minutes: retro.** What helped, what slowed us down, one change to try. Record the outcome in `brand-notes.md`.

We watch two numbers: **cycle time** (In Progress to Done, target under 3 days) and **WIP** (stay within limits).

## 4. Git Strategy and Controls

### Branching model: GitHub Flow

- `main` is production. GitHub Pages deploys from `main`, so `main` must always work.
- All work happens on short-lived branches cut from the latest `main` and merged back by pull request.
- Nobody pushes directly to `main`, including AI agents. Branch protection enforces this.

**Branch names:** `<type>/<issue-number>-<short-description>`, lowercase with hyphens.

| Example                         | Use for                  |
| ------------------------------- | ------------------------ |
| `feat/42-aesthetic-filter`      | New user-facing behavior |
| `fix/57-budget-dial-fill`       | Bug fixes                |
| `docs/60-update-playbook`       | Documentation only       |
| `test/61-artist-fallback-tests` | Tests only               |
| `chore/63-bump-eslint`          | Tooling, dependencies    |
| `ci/64-add-smoke-test`          | GitHub Actions changes   |

Branches are deleted automatically after merge.

### Commit messages: Conventional Commits

We follow [Conventional Commits 1.0](https://www.conventionalcommits.org/en/v1.0.0/):

```
<type>(<scope>): <imperative summary, 72 characters or fewer>

<optional body: why the change was needed>

Closes #<issue>
```

- **Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`, `ci`, `perf`
- **Scopes:** `quiz`, `results`, `match`, `data`, `ui`, `ci`, `deps`
- **Breaking change:** add `!`, for example `feat(match)!: make budget a soft filter`

Examples from this project:

```
feat(quiz): add primary-use question before budget
fix(ui): show brown active range on budget dial
test(match): cover Rzeznik rock + advanced regression
chore(deps): bump eslint to 10.12
```

### Pre-commit hook

When you run `npm install`, Husky installs a Git hook (`.husky/pre-commit`). On every commit it:

1. Runs **lint-staged**: `eslint --fix` and `prettier --write` on the files you staged.
2. Runs **`npm test`**.

If either step fails, the commit is blocked. Do not bypass it with `--no-verify`. In a real emergency you may, but say so in the PR description.

### Pull request process

1. Push your branch and open a PR into `main`. The PR template (`.github/pull_request_template.md`) loads automatically.
2. Fill it in: link the issue (`Closes #42`), tick how you tested, and disclose AI use.
3. **Required checks** must pass:
   - `Lint, format, test, audit` (ESLint, Prettier, tests with coverage floor, `npm audit`)
   - `Secret scan (gitleaks)`
   - `Analyze JavaScript` (CodeQL)
4. **One approving review** from a code owner (`.github/CODEOWNERS`) is required.
5. All review conversations must be resolved, and the branch must be up to date with `main`.
6. Merge with **Squash and merge**. The PR title becomes the commit on `main`, so it must follow Conventional Commits.

### Review guidelines

Reviewers check, in order:

1. **Scope:** does the PR do what the issue asks, and nothing unrelated?
2. **Correctness:** do the tests cover the new behavior? Would they fail if the code were wrong?
3. **Security:** any HTML built from data goes through `escapeHtml`; no `eval`; no secrets.
4. **Data accuracy:** guitar specs, prices, and artist links have a source. Only official signature models go in `signatureGearIds`.
5. **UI:** a screenshot is attached for visual changes.

Use **Request changes** for blockers. Prefix optional suggestions with `nit:`.

### Branch protection on `main`

Configured under **Settings → Branches → Branch protection rules → `main`**:

- Require a pull request before merging, with **1 approval**
- Dismiss stale approvals when new commits are pushed
- Require review from Code Owners
- Require status checks to pass: `Lint, format, test, audit`, `Secret scan (gitleaks)`, `Analyze JavaScript`
- Require branches to be up to date before merging
- Require conversation resolution before merging
- Block force pushes and deletions
- Also, under **Settings → General → Pull Requests:** allow squash merging only, and turn on "Automatically delete head branches"

When only one developer is active, GitHub does not let you approve your own PR. In that case the repo admin may merge after all required checks pass, and must note "self-merged, no second reviewer available" in the PR.

### Releases and rollbacks

- Tag each course milestone on `main` using semantic versions (`v1.0.0`, `v1.1.0`) with release notes from merged PR titles.
- **To roll back a bad deploy,** open a PR that runs `git revert <commit-sha>` on the bad commit. Never rewrite `main` history.

## 5. Issue Tracking

### Tool: GitHub Issues + GitHub Projects

All work is tracked in **GitHub Issues** and visualized on a **GitHub Projects** board.

- **Issues:** https://github.com/rbriggs0/IS-581-Project/issues
- **Kanban board:** https://github.com/rbriggs0/IS-581-Project/projects

We chose GitHub over Jira or Trello because issues, code, PRs, and CI live in one place. Writing `Closes #42` in a PR closes the issue and moves its card to Done automatically.

### Issue templates

Blank issues are turned off. Use one of these templates (`.github/ISSUE_TEMPLATE/`):

| Template                   | Collects                                                             |
| -------------------------- | -------------------------------------------------------------------- |
| **Feature slice**          | User story, acceptance criteria, area, size (S/M/L)                  |
| **Bug report**             | Page URL, steps to reproduce, expected vs. actual, severity, browser |
| **Security vulnerability** | Routes to a private GitHub security advisory, never a public issue   |

### Labels

| Group    | Labels                                                                             |
| -------- | ---------------------------------------------------------------------------------- |
| Type     | `type: feature`, `type: bug`, `type: chore`, `type: docs`                          |
| Area     | `area: quiz`, `area: results`, `area: match`, `area: data`, `area: ui`, `area: ci` |
| Priority | `P1` (this week), `P2` (next), `P3` (someday)                                      |
| Other    | `good first issue`                                                                 |

Status is tracked by the board column, not by labels.

### Board automation

The project uses GitHub Projects' built-in workflows:

- New issue added → **Backlog**
- Linked PR opened → **In Review**
- Issue closed or PR merged → **Done**

### Bug severity and response times

| Severity | Example                                      | Respond within     | Resolve                 |
| -------- | -------------------------------------------- | ------------------ | ----------------------- |
| SEV1     | Site down, quiz cannot submit, results blank | 4 hours            | Same day (revert first) |
| SEV2     | Wrong matches, broken filter, missing photos | 1 business day     | Within the week         |
| SEV3     | Typo, spacing, cosmetic                      | Next replenishment | Prioritized in backlog  |

## 6. AI Agents and Controls

### Approved tools

| Tool                                      | Approved for                                               | Required setting                         |
| ----------------------------------------- | ---------------------------------------------------------- | ---------------------------------------- |
| **Cursor Agent, Chat, and Tab**           | Writing and refactoring code, tests, docs; explaining code | Privacy Mode on; project rules loaded    |
| **ChatGPT / Claude (web)**                | Brainstorming copy, naming, research questions             | Never paste repo secrets or private data |
| **GitHub Copilot code review** (optional) | Second-opinion review comments on PRs                      | A human still approves                   |

**Not approved:** browser extensions that read the repository, MCP servers or plugins not reviewed by the repo owner, any agent configured to push to `main` or merge PRs, and any tool that trains on our code without a privacy setting turned on.

### Guardrails that are enforced, not just written down

| Guardrail                                  | How it is enforced                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------- |
| Agents follow project rules every session  | `.cursor/rules/project-guardrails.mdc` (`alwaysApply: true`)                          |
| Data edits follow catalog conventions      | `.cursor/rules/data-conventions.mdc` auto-attaches for `data/**` and `images/gear/**` |
| AI cannot ship directly to production      | Branch protection on `main`; PR plus approval required                                |
| AI code gets the same checks as human code | CI (ESLint, Prettier, tests, coverage, `npm audit`), CodeQL, gitleaks on every PR     |
| AI use is visible to reviewers             | PR template has a required AI-disclosure checkbox                                     |
| No secrets reach the AI or the repo        | Privacy Mode, `.gitignore` blocks `.env`/keys, gitleaks scan, GitHub push protection  |

The always-on rule tells every agent session:

- The stack is HTML/CSS/vanilla JS modules/JSON; do not add frameworks or runtime dependencies.
- Never generate, paste, or commit secrets.
- Never push to `main`; work on a typed branch and open a PR.
- Never use `eval`, `new Function`, or `innerHTML` with user input.
- Never invent guitar specs, prices, or artist endorsements.
- Run `npm run check` and report the result before handing work back.

### Human-in-the-loop rules

1. **You own every line you commit,** whoever or whatever typed it.
2. **Read every diff** before accepting it. No "accept all" on changes you have not read.
3. **Check AI-written tests:** break the code on purpose and confirm the test fails.
4. **Keep terminal command approval on** (Cursor Settings → Agents: do not auto-run commands). Never approve `git push --force`, history rewrites, mass deletes, or publishing commands from an agent.
5. **Verify facts against sources.** Signature models must be confirmed on the manufacturer's site (for example, PRS for the Silver Sky, Martin for the 000-28EC) and recorded in `sourceNote` in `data/artists.json`.
6. **Log significant AI-driven decisions** in the decision log in `brand-notes.md`.

### Data you may never put in a prompt

Passwords, API keys, tokens, `.env` contents, personal information about real people beyond public artist facts, and anything marked confidential by the course or a partner.

## 7. Code Quality

### Tools and where they are configured

| Tool                                         | Purpose                                                            | Config file                           | Runs where                       |
| -------------------------------------------- | ------------------------------------------------------------------ | ------------------------------------- | -------------------------------- |
| **ESLint 10**                                | Finds bugs and unsafe patterns in JS and inline `<script>` in HTML | `eslint.config.js`                    | On save, pre-commit, CI          |
| **eslint-plugin-html**                       | Lets ESLint check scripts inside `pages/*.html`                    | `eslint.config.js`                    | Same as ESLint                   |
| **Prettier 3**                               | One consistent format for JS, HTML, CSS, JSON, Markdown, YAML      | `.prettierrc.json`, `.prettierignore` | On save, pre-commit, CI          |
| **EditorConfig**                             | Indent, charset, line endings in any editor                        | `.editorconfig`                       | Editor                           |
| **Husky + lint-staged**                      | Runs ESLint, Prettier, and tests before each commit                | `.husky/pre-commit`, `package.json`   | Local commits                    |
| **CodeQL**                                   | Static security analysis (`security-and-quality` queries)          | `.github/workflows/codeql.yml`        | Every PR, push to `main`, weekly |
| **gitleaks**                                 | Blocks committed secrets                                           | `.github/workflows/ci.yml`            | Every PR and push to `main`      |
| **npm audit**                                | Fails CI on high or critical dependency vulnerabilities            | `.github/workflows/ci.yml`            | Every PR and push to `main`      |
| **Dependabot**                               | Weekly update PRs for npm packages and GitHub Actions              | `.github/dependabot.yml`              | Mondays                          |
| **GitHub secret scanning + push protection** | Rejects pushes that contain known token formats                    | Settings → Code security              | Every push                       |

### ESLint rules beyond the recommended set

| Rule                                        | Why                                      |
| ------------------------------------------- | ---------------------------------------- |
| `eqeqeq`                                    | Avoid type-coercion bugs (`==` vs `===`) |
| `no-var`, `prefer-const`                    | Predictable scoping                      |
| `no-eval`, `no-implied-eval`, `no-new-func` | Block code-injection patterns            |
| `no-unused-vars`                            | Dead code gets removed, not left behind  |
| `no-console` (warn; `warn`/`error` allowed) | No debug logging shipped to users        |

### Prettier settings

80-character lines, 2-space indent, semicolons, double quotes, trailing commas where valid in ES5, LF line endings.

### Coding standards

- **Matching logic stays pure.** `js/match.js` never touches the DOM, so it can be tested in Node.
- **Escape before you inject.** Any HTML built from data uses `escapeHtml` (see `pages/results.html`); plain text uses `textContent`.
- **Document exports.** Exported functions get a JSDoc comment with parameter and return types.
- **Accessibility is a quality bar.** Every input has a label, radio groups use `fieldset`/`legend`, every gear photo has alt text ("Brand Model"), sliders are keyboard-operable. Run Lighthouse (Chrome DevTools → Lighthouse → Accessibility) on changed pages and keep the score at 90 or higher.

### Commands

| Command                | Does                                 |
| ---------------------- | ------------------------------------ |
| `npm run lint`         | ESLint, report only                  |
| `npm run lint:fix`     | ESLint, auto-fix what it can         |
| `npm run format`       | Prettier, rewrite files              |
| `npm run format:check` | Prettier, report only (what CI runs) |
| `npm run check`        | Lint + format check + tests          |

## 8. Testing Frameworks

### Unit and data tests: Node's built-in test runner

We use **`node:test`** with **`node:assert/strict`**, both built into Node.js 22. We chose it over Jest or Vitest because it needs no extra dependencies, runs our native ES modules without configuration, and includes coverage reporting.

| Suite                 | What it protects                                                                                                                                                                                                                                    |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `tests/match.test.js` | Hard filters (style, type, handedness, budget, inverted budget); soft experience and primary use; signature-first sorting (John Mayer, John Rzeznik); over-budget signatures dropped; genre fallback notice; gift-friendly notice; helper functions |
| `tests/data.test.js`  | Catalog integrity: unique IDs, allowed values for style/type/level/hand/use, a photo file on disk for every guitar, artists link only to real guitars, signature lists consistent between `gear.json` and `artists.json`                            |
| `tests/helpers.js`    | Loads and merges the real JSON catalog the same way the site does                                                                                                                                                                                   |

**Current status:** 98 tests passing; 83% line coverage on `js/match.js`. The uncovered lines are mainly the browser-only `fetch` loaders and the artist fallback for when no guitar in the selected style fits.

### How to run

| Command                           | When                                                         |
| --------------------------------- | ------------------------------------------------------------ |
| `npm test`                        | Any time; also runs in the pre-commit hook                   |
| `npm run test:coverage`           | Before a PR; CI fails if `js/` line coverage drops below 80% |
| `node --test tests/match.test.js` | One file                                                     |
| `node --test --watch`             | Re-run on save while you work                                |

### Rules for writing tests

- Test files go in `tests/` and end in `.test.js`.
- **Every bug fix adds a regression test.** Example: when "rock + John Rzeznik + advanced + $3,900" returned only two guitars, the fix shipped with the test "puts Rzeznik's Taylors first for rock + advanced + $3,900" that asserts more than two results.
- Test against the real catalog through `tests/helpers.js`, so data changes that break matching are caught.
- Assert behavior users would notice (order, counts, messages), not private implementation details.

### Automated live-site smoke test

`.github/workflows/smoke.yml` runs after every GitHub Pages build, daily at 14:00 UTC, and on demand. It checks that the home page, quiz, results, all three JSON files, `match.js`, and `styles.css` return HTTP 200, and that `gear.json` still has at least 27 guitars.

### Manual smoke checklist (before moving a card to Done)

On the live site, after a hard refresh:

1. Rock → Electric → Beginner → Right → Practice → no artist → $0–$1,500: results load with photos.
2. Folk → Acoustic → Advanced → Left → Songwriting: every result shows "Lefty available" or "Left-handed".
3. Rock → Either → Advanced → Either → Any → John Rzeznik → $0–$3,900: Taylor 314ce is first with a signature badge.
4. Blues → Electric → any → John Mayer → $0–$1,000: PRS SE Silver Sky appears; core Silver Sky does not.
5. Budget dial: dragging either handle moves the brown active range and updates the dollar readout.

### Planned next

Browser end-to-end tests with **Playwright** for the quiz-to-results flow once the UI adds more pages.

## 9. Other Controls, Tools, and Procedures

### Deployment

- **Host:** GitHub Pages, "Deploy from a branch," branch `main`, folder `/` (root).
- **Deploying = merging to `main`.** Pages rebuilds in about a minute. There is no manual deploy step.
- **After merging:** confirm "pages build and deployment" is green in Actions, confirm the smoke test is green, then hard refresh the live site and run the manual checklist.
- **Environments:** local (`npm start`, http://localhost:8080) and production (Pages). PR review plus a local run serves as staging.
- **Rollback:** revert the bad commit through a PR (section 4). Pages redeploys the previous state.

### Secrets management

- **Today the site needs no secrets.** There are no API keys, databases, or accounts.
- **Never commit secrets.** `.gitignore` blocks `.env`, `.env.*`, `*.pem`, and `*.key`. gitleaks and GitHub push protection catch what slips through.
- **Browser code is public.** Anything in `js/`, `pages/`, or `data/` is readable by every visitor, so a future API key must live behind a server-side proxy, never in front-end code.
- **CI secrets** go in Settings → Secrets and variables → Actions, referenced as `${{ secrets.NAME }}`.
- **If a secret leaks:** revoke and rotate it immediately, open a SEV1 issue, and only then clean it from history. Rotation comes first because a pushed secret should be treated as already copied.

### Dependency policy

- Zero runtime dependencies. Dev tools only, listed in `devDependencies`.
- `package-lock.json` is committed; CI installs with `npm ci` for reproducible builds.
- Dependabot PRs are reviewed every Monday. Merge when CI is green; read the changelog for major versions.

### Incident response and on-call

- **On-call:** the repo owner by default. With multiple developers, rotate weekly every Monday and post the name in the team chat.
- **Check first:** is GitHub itself down? https://www.githubstatus.com/
- **Steps:**
  1. Confirm the problem on the live site and note the URL and steps.
  2. If a recent merge caused it, **revert first** (PR with `git revert`), then investigate.
  3. Open a Bug report issue with the right severity.
  4. Fix forward on a `fix/` branch with a regression test.
  5. Add a short post-incident note to `brand-notes.md`: what happened, impact, fix, and prevention.

### Adding catalog data

**New guitar:**

1. Add the core entry to `data/gear.json` (id in `lowercase-with-hyphens`).
2. Add `visual`, `specs`, `image`, and `uses` under the same id in `data/gear-extras.json`.
3. Save the product photo as `images/gear/<id>.png` (clean or white background, guitar fully in frame).
4. Run `npm test`. The data tests fail if any piece is missing or mislabeled.

**New artist:** add to `data/artists.json` with `reason` and `sourceNote`. Put a guitar in `signatureGearIds` only if it is an official signature or artist-partnership model; everything else goes in `gearIds` and displays as "Because you selected [artist]."

### Access control

- Repo owner is the only **Admin**. Team members get **Write** access.
- Two-factor authentication is required on every GitHub account with access.
- Remove access the same day someone leaves the team.

### Documentation map

| Document           | Purpose                                          |
| ------------------ | ------------------------------------------------ |
| `README.md`        | Quick start and commands                         |
| `docs/PLAYBOOK.md` | This playbook                                    |
| `brand-notes.md`   | Product decision log and retro notes             |
| `SECURITY.md`      | How to report vulnerabilities; security controls |

## 10. Day-One Checklist

- [ ] GitHub account has two-factor authentication on, and you have Write access to the repo
- [ ] Git, Node.js 22, and Cursor installed (section 2)
- [ ] Cursor Privacy Mode on; project rules visible
- [ ] Repo cloned, `npm install` run, recommended extensions installed
- [ ] `npm start` shows the quiz locally; `npm run check` passes
- [ ] Read sections 4 (Git) and 6 (AI) twice
- [ ] Pick a `good first issue` from the board, branch, and open your first PR
