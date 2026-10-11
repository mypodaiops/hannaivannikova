# hannaivannikova.com

Персональний сайт Ганни Іваннікової — фінансова незалежність через системне інвестування.

## Stack

- HTML5 / CSS3 / JavaScript (vanilla)
- Mobile-first responsive design
- Mustache-style templates rendered to static files
- Hosted on GitHub Pages

## Local Development

Install the build dependency once:

```bash
npm ci
```

Generate the static site:

```bash
npm run build
```

Serve locally:

```bash
python3 -m http.server 8765 --bind 0.0.0.0
```

Then open `http://0.0.0.0:8765/`.

## Project Layout

- `templates/` — source HTML templates with Mustache placeholders
- `translations.json` — UA/EN translation dictionary
- `build.js` — static site generator
- `uk/`, `en/` — generated language sites
- `index.html`, `calculator.html`, `404.html` — root redirects

## Deployment

Live at **<https://hannaivannikova.com/>**. GitHub Pages publishes the repository root from `master`.

1. Make changes on a branch.
2. Run `npm run build` and commit sources plus generated `uk/` and `en/` pages.
3. Push the branch and open a pull request into `master`.
4. Keep the branch up to date with `master` and ensure **Validate generated pages** passes.
5. Merge to deploy automatically.

Direct pushes to `master` are blocked by the branch ruleset.

## License

All rights reserved.
