# Security policy

FindYourSound is a static site (HTML, CSS, JavaScript, JSON) hosted on GitHub Pages. It has no backend, no accounts, and stores no user data.

## Reporting a vulnerability

Report privately through [GitHub private vulnerability reporting](https://github.com/rbriggs0/IS-581-Project/security/advisories/new). Do not open a public issue.

You can expect an acknowledgement within 2 business days and a fix or mitigation plan within 7 days for confirmed issues.

## Controls in place

- ESLint security-relevant rules (`no-eval`, `no-implied-eval`, `no-new-func`)
- All dynamic HTML in `pages/results.html` passes through `escapeHtml`
- CodeQL analysis on every PR and weekly (`.github/workflows/codeql.yml`)
- gitleaks secret scan on every PR (`.github/workflows/ci.yml`)
- `npm audit` gate and weekly Dependabot updates
