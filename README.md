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
npm install
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

Live at: **<https://mypodaiops.github.io/hannaivannikova/>**  
Custom domain (`hannaivannikova.com`) — will be enabled later.

## License

All rights reserved.
