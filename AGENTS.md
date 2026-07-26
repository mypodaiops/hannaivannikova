# Agent Notes — hannaivannikova.com

Essential context for future sessions on this repository.

## Project

Static personal website for Hanna Ivannikova (Ганна Іваннікова).
Ukrainian and English. Hosted on GitHub Pages with a planned custom domain
`hannaivannikova.com`.

Live URL: `https://mypodaiops.github.io/hannaivannikova/`

## Stack

- HTML5, CSS3, vanilla JavaScript
- Mobile-first responsive CSS
- Google Fonts: Inter + Playfair Display
- Mustache-style templates rendered to static files by `build.js` (Node)
- Multi-language ready: add a language in `build.js` and `translations.json`
- Python HTTP server for local verification
- npm dependency: `mustache`

## Key files

| File | Purpose |
| ------ | --------- |
| `templates/index.html` | Source landing page template |
| `templates/calculator.html` | Source calculator page template |
| `translations.json` | UA/EN translation dictionary |
| `build.js` | Static site generator |
| `package.json` | npm manifest (build dependency) |
| `css/styles.css` | All styles |
| `js/main.js` | Mobile nav, scroll reveal, calculator logic |
| `img/prifile.jpeg` | Profile photo |
| `img/favicon.svg` | Favicon |
| `website-content-uk.md` | Source content in Ukrainian |
| `AGENTS.md` | This file |

## Internationalization

- Default language: Ukrainian (`uk`).
- Languages live in separate paths: `/uk/` and `/en/`.
- Root `/index.html` redirects to `/uk/`; `/calculator.html` redirects to
  `/uk/calculator.html`. These are hardcoded files at the repository root.
- Root `404.html` is the universal fallback page served by GitHub Pages for any
  missing path. It links back to `/uk/`.
- Translations are read from `translations.json` at build time.
- Templates use Mustache placeholders: `{{t.nav.about}}`, `{{lang}}`,
  `{{base}}`, etc.
- `{{{base_url}}}` is used unescaped for URLs.
- `{{#languages}}...{{/languages}}` renders the language switcher; adding a new
  language only requires adding an entry in `build.js` and translations in
  `translations.json`.
- Generated pages are plain static HTML and do not load `js/translations.js`
  or `js/i18n.js`.

### i18n constraints

- Do not put HTML inside translation strings. Rendered values are escaped by
  Mustache.
- Keep static HTML structure separate from translated text.
- Avoid mixing languages inside the same element.

## Build workflow

1. Edit `templates/*.html` or `translations.json`.
2. Run `npm run build`.
3. Commit both sources and generated files (`uk/`, `en/`). Root redirect
   files (`index.html`, `calculator.html`, `404.html`) are hardcoded and only
   need to be edited manually.
4. Verify locally with `python3 -m http.server 8765 --bind 0.0.0.0`.

## Calculator

- Compound interest with monthly capitalization (30/365 days).
- Monthly contribution is added starting from month 2, before interest is
  applied.
- Term input supports months or years (default: years).
- Detailed table is collapsed by default; user expands it via a toggle button.
- Currency signs are intentionally removed from the calculator.
- Table values are rounded to whole numbers; summary results show two decimals.
- Number formatting uses `document.documentElement.lang` locale.

## Design & content decisions

- Color scheme: Navy + Gold (`#162033`, `#d4af37`).
- Single CTA per group: gold `.btn--primary` with Telegram link.
- All `iplan.ua` references removed; all booking CTAs point to
  `https://t.me/hannaivannikova`.
- 250€ price removed from all pages and content.
- Vertical connector lines were intentionally re-added for the services and
  pricing sections.
- Hero sections animate in via the scroll reveal observer.
- Profile photo is `img/prifile.jpeg`, lazy-loaded, rounded with border.

## Local verification

```bash
npm install
npm run build
python3 -m http.server 8765 --bind 0.0.0.0
```

Then open `http://0.0.0.0:8765/`.

## Things to avoid

- Editing generated files directly — always edit `templates/` and rerun
  `npm run build`.
- Putting currency symbols back into the calculator.
- Re-adding the 250€ price or `iplan` references.
