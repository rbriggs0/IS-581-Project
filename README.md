# FindYourSound

A guitar-matching quiz: answer style, type, experience, handedness, primary use, an optional favorite artist, and a budget, and get matched to real guitars from a curated catalog.

- Live site: https://rbriggs0.github.io/IS-581-Project/
- Quiz: https://rbriggs0.github.io/IS-581-Project/pages/quiz.html
- Team playbook: [docs/PLAYBOOK.md](docs/PLAYBOOK.md)

## Quick start

Requires [Node.js 22+](https://nodejs.org/) (for dev tools only; the site itself has no build step).

```bash
git clone https://github.com/rbriggs0/IS-581-Project.git
cd IS-581-Project
npm install        # installs ESLint, Prettier, test hooks
npm start          # serves the site at http://localhost:8080/pages/quiz.html
```

Opening the HTML files directly (`file://`) will not work: the pages load JSON with `fetch`, which browsers block on `file://`.

## Commands

| Command                 | What it does                                   |
| ----------------------- | ---------------------------------------------- |
| `npm start`             | Local server with caching off                  |
| `npm run lint`          | ESLint on `js/`, `tests/`, and HTML pages      |
| `npm run format`        | Prettier rewrite of all files                  |
| `npm run format:check`  | Prettier check (what CI runs)                  |
| `npm test`              | `node --test` unit and data-integrity tests    |
| `npm run test:coverage` | Tests with an 80% line-coverage floor on `js/` |
| `npm run check`         | Lint + format check + tests (run before PR)    |

## Project layout

```
pages/     quiz.html, results.html, and landing sub-pages
js/        match.js (matching logic), visuals.js (fallback silhouettes)
data/      gear.json, gear-extras.json, artists.json
images/    gear photos named images/gear/<gear-id>.png
tests/     node:test suites for matching logic and catalog data
.github/   CI, CodeQL, smoke test, Dependabot, templates, CODEOWNERS
```
