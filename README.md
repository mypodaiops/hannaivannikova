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

Live at: **<https://hannaivannikova.com/>**

Hosted on GitHub Pages, publishing the repository root from `master`. The repository fallback URL is <https://mypodaiops.github.io/hannaivannikova/>.

Recommended workflow: make changes on a branch, rebuild, commit the sources and generated `uk/` and `en/` pages, then open a pull request into `master`.

The **Validate site** GitHub Actions workflow runs on pull requests into `master` and pushes to `master`, using Node.js 24 and `npm ci`. It rebuilds the site and fails if generated pages differ from the committed files or new generated pages are untracked.

To prevent unchecked changes reaching production, configure a branch ruleset for `master` requiring pull requests and the **Validate generated pages** status check. CI alone does not block direct pushes or the existing GitHub Pages deployment.

## License

All rights reserved.
