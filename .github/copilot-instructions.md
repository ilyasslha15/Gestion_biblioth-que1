# Copilot / AI agent guidance — Gestion_bib (Library demo)

Short README for AI coding agents to be immediately productive.

## Big picture
- Pure client-side static web app (no backend). Pages live under `html/`; related scripts are in `js/` and loaded by `<script>` in HTML. The app uses localStorage for persistence.
- Roles: `user` and `admin`. Many pages redirect non-authenticated users to the login page (look for `currentUser` in `localStorage`).
- UI libs: Bootstrap (via CDN) and Chart.js (via CDN) — no bundler/build step.

## Runtime / developer workflow
- No build step. To run locally: open `html/*.html` in a browser or serve the folder with any static server (e.g., `python -m http.server` from the repo root or use VSCode Live Server).
- Manual testing is the default; there is no test harness or CI configured.

## Key files & where to start
- `html/dashboard.html` + `js/dashboard.js` — admin overview and charts
- `html/Liste_livres.html` + `js/Liste_livres.js` — listing, filtering, add-to-order, translations
- `html/Ajout._livre_admin.html` + `js/Ajout_livre.js` — form for creating books (includes validation)
- `html/login.html` + `js/login.js` — authentication using `localStorage.users`
- `js/*` — general patterns and helpers are embedded in page scripts (no central utility module)

## Data shapes (discoverable in code)
- users: array `[{ email, password, role }]` stored as `localStorage.users`
- books: array `[{ title, author, year, type, prix, available }]` stored as `localStorage.books`
- orders: array `[{ user, items: [{title, price}], total, status, date }]` stored as `localStorage.orders`
- language: `localStorage.lang` stores `'fr'` or `'en'` (some pages use `'French'/'English'` strings internally)

Example read pattern: `const books = JSON.parse(localStorage.getItem('books') || '[]');`
Example write pattern: `localStorage.setItem('books', JSON.stringify(books));`

## i18n / translation pattern
- Two common approaches appear:
  - HTML elements carry `data-fr` / `data-en` attributes and a generic `applyLanguage(lang)` reads these (see `Liste_livres.js`).
  - Some pages use per-script objects (`textes` in `login.js`) or ad-hoc functions (`translatePage()` in `Ajout_livre.js`).
- Save translations to `localStorage.lang`. Be aware of inconsistencies in language naming across scripts.

## Conventions & notable quirks (important for automation)
- Lots of French/English mixed identifiers, comments, and filenames (e.g., `page d'accueil.html`, `Catégorie.html`), and some filenames contain spaces or punctuation — prefer matching exact filenames when editing or refactoring.
- Paths vary across files (`../html/login.html` vs `../login/login.html`), and there are typos (e.g., `../html/login.hml` in `dashboard.js`). Watch for inconsistent redirects and fix URL bugs.
- Data and auth live in `localStorage` and passwords are stored in plaintext — treat it as a demo app (do not promote this for production without security fixes).

## External deps
- Bootstrap (CSS + JS) via CDN in HTML files
- Chart.js via CDN (used from `dashboard.js`)

## Safe, actionable tasks an AI agent can do right away
- Fix typos and inconsistent path redirects (search for `.hml`, `../login/login.html`, `../html/login.html`) and unify login redirect behavior.
- Consolidate i18n approach: choose one translation pattern (prefer `data-fr`/`data-en` attributes and `applyLanguage`) and migrate smaller ad-hoc implementations.
- Add a small static dev script to README (e.g., `python -m http.server 8000`) and a brief `npm` script or `.vscode/launch.json` snippet for quick start.
- Add linting (ESLint) and simple pre-commit checks to enforce consistent naming and path pattern fixes.
- Add small unit-style tests (e.g., using Jest against helper functions after refactoring them into modules) — requires introducing a minimal build/dev setup.

## How to report back / ask for guidance
- When making behavior changes, include: affected file(s), failing scenario, steps to reproduce in a browser, and a short patch summary.
- If unsure about a business rule (e.g., what makes a book "available"), create a short issue and add a proposed test that codifies expected behavior.

---
If you want, I can (pick one):
- open a PR that fixes the known redirect and filename inconsistencies (quick patch), or
- standardize the i18n approach across 3 example pages and show the pattern.

Please tell me which you'd prefer or point me to any higher-priority tasks. — Copilot
