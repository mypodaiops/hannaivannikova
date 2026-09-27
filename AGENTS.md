# Agent Notes — hannaivannikova.com

## Source of truth and build

- `templates/*.html` and `translations.json` are build inputs. `build.js` renders the static pages in `uk/` and `en/`.
- `website-content-uk.md` is the authoritative Ukrainian copy; keep it aligned with the Ukrainian translations. English copy is maintained in `translations.json`.
- Edit source files, run `npm run build`, and commit generated `uk/` and `en/` pages with their sources.
- Ukrainian (`uk`) is the default language. Root redirects (`index.html`, `calculator.html`, `404.html`) are maintained by hand and must be updated if the default changes.
- Keep translations as plain text because Mustache escapes their values. Put markup in templates and keep each text element in one language.

## Offer and CTA decisions

- Keep the offer framed as three one-to-one educational investing sessions. Teach practical investing, account-opening steps, and asset evaluation through examples; learners make their own account and investment decisions.
- Hero and final contact buttons link directly to Telegram. Pricing and calculator CTAs lead to the current language's homepage contact section (`index.html#contact`).
- Keep outbound Telegram links on `https://t.me/hannaivannikova`, and keep the site free of `iplan.ua` references and the removed `250€` price.

## Calculator behavior

- Preserve monthly capitalization using the monthly rate `annual rate × 30/365`.
- Add monthly contributions beginning in month 2, before interest is applied.
- Term inputs support months or years; years are the default.
- Keep currency symbols out of the calculator. Table values are rounded to whole numbers; summary values show two decimals and use the document language's locale.
- The detailed table is collapsed by default and opens through its toggle.

## Workflow references

- For GitHub issue operations, follow `docs/agents/issue-tracker.md`.
- When triaging GitHub issues, use labels from `docs/agents/triage-labels.md`.
- When creating or editing domain context documents, follow `docs/agents/domain.md`.
