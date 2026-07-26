const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

const pkg = require("./package.json");
const BASE_URL = process.env.BASE_URL || pkg.homepage;

// Add a new language by adding an entry here and adding its translations to
// translations.json. If the default language changes, update the root redirect
// files (index.html, calculator.html, 404.html) accordingly.
const LANGUAGES = [
	{ code: "uk", name: "UA", locale: "uk_UA" },
	{ code: "en", name: "EN", locale: "en_US" },
];
const DEFAULT_LANG = LANGUAGES[0].code;

const ROOT = __dirname;
const TEMPLATES = path.join(ROOT, "templates");
const OUT = ROOT;

/**
 * Turn a flat translation object like { "nav.about": "..." }
 * into a nested object like { nav: { about: "..." } }.
 * Uses Object.create(null) and skips dangerous keys to avoid prototype pollution.
 */
function nestTranslations(flat) {
	const nested = Object.create(null);
	const dangerous = new Set(["__proto__", "constructor", "prototype"]);
	for (const [key, value] of Object.entries(flat)) {
		const parts = key.split(".");
		let current = nested;
		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (dangerous.has(part)) break;
			if (
				!Object.hasOwn(current, part) ||
				typeof current[part] !== "object" ||
				current[part] === null
			) {
				current[part] = {};
			}
			current = current[part];
		}
		const last = parts.at(-1);
		if (!dangerous.has(last)) {
			current[last] = value;
		}
	}
	return nested;
}

function loadTranslations() {
	try {
		return JSON.parse(
			fs.readFileSync(path.join(ROOT, "translations.json"), "utf-8"),
		);
	} catch (err) {
		console.error("Error: failed to load translations.json", err.message);
		process.exit(1);
	}
}

function renderPage(templatePath, lang, page, translations) {
	const template = fs.readFileSync(templatePath, "utf-8");
	const langMeta = LANGUAGES.find((l) => l.code === lang);
	if (!langMeta) {
		throw new Error(`Unknown language: ${lang}`);
	}

	const languages = LANGUAGES.map((l) => ({
		code: l.code,
		name: l.name,
		active: l.code === lang,
	}));

	const view = {
		lang,
		default_lang: DEFAULT_LANG,
		base: "..",
		page,
		base_url: BASE_URL,
		og_locale: langMeta.locale,
		languages,
		t: nestTranslations(translations[lang]),
	};

	return mustache.render(template, view);
}

function build() {
	const translations = loadTranslations();
	const pages = fs
		.readdirSync(TEMPLATES)
		.filter((f) => f.endsWith(".html"))
		.sort();
	const langCodes = LANGUAGES.map((l) => l.code);

	for (const lang of langCodes) {
		if (!translations[lang]) {
			throw new Error(`missing translations for language "${lang}"`);
		}
		const outDir = path.join(OUT, lang);
		fs.mkdirSync(outDir, { recursive: true });
		for (const page of pages) {
			const html = renderPage(
				path.join(TEMPLATES, page),
				lang,
				page,
				translations,
			);
			fs.writeFileSync(path.join(outDir, page), html, "utf-8");
		}
	}
}

build();
