const fs = require("fs");
const path = require("path");
const mustache = require("mustache");

const pkg = require("./package.json");
const BASE_URL = pkg.homepage;

// Add a new language by adding an entry here and adding its translations to
// translations.json. If the default language changes, update the root redirect
// files (index.html, calculator.html, book.html, 404.html) accordingly.
const LANGUAGES = [
	{ code: "uk", name: "UA", locale: "uk_UA" },
	{ code: "en", name: "EN", locale: "en_US" },
];
const DEFAULT_LANG = LANGUAGES[0].code;

const ROOT = __dirname;
const TEMPLATES = path.join(ROOT, "templates");
const OUT = ROOT;
const METADATA_PREFIXES = {
	"index.html": "page",
	"calculator.html": "calc",
	"book.html": "book",
};

/**
 * Turn a flat translation object like { "nav.about": "..." }
 * into a nested object like { nav: { about: "..." } }.
 */
function nestTranslations(flat) {
	const nested = Object.create(null);
	for (const [key, value] of Object.entries(flat)) {
		const parts = key.split(".");
		let current = nested;
		for (let i = 0; i < parts.length - 1; i++) {
			const part = parts[i];
			if (
				!Object.hasOwn(current, part) ||
				typeof current[part] !== "object" ||
				current[part] === null
			) {
				current[part] = {};
			}
			current = current[part];
		}
		current[parts.at(-1)] = value;
	}
	return nested;
}

function loadTranslations() {
	return JSON.parse(
		fs.readFileSync(path.join(ROOT, "translations.json"), "utf-8"),
	);
}

function loadPartials() {
	const directory = path.join(TEMPLATES, "partials");
	return Object.fromEntries(
		fs.readdirSync(directory)
			.filter((file) => file.endsWith(".html"))
			.map((file) => [
				path.basename(file, ".html"),
				fs.readFileSync(path.join(directory, file), "utf-8"),
			]),
	);
}

function pageUrl(lang, page) {
	const filename = page === "index.html" ? "" : encodeURIComponent(page);
	return new URL(`/${lang}/${filename}`, BASE_URL).href;
}

function renderPage(templatePath, lang, page, translations, partials) {
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

	const isHome = page === "index.html";
	const metadataPrefix = METADATA_PREFIXES[page];
	const copy = translations[lang];

	const view = {
		lang,
		base: "..",
		page,
		og_locale: langMeta.locale,
		languages,
		metadata: {
			title: copy[`${metadataPrefix}.title`],
			description: copy[`${metadataPrefix}.description`],
			keywords: isHome ? copy["page.keywords"] : undefined,
			url: pageUrl(lang, page),
			alternates: [
				...LANGUAGES.map(({ code }) => ({ code, url: pageUrl(code, page) })),
				{ code: "x-default", url: pageUrl(DEFAULT_LANG, page) },
			],
		},
		navigation: {
			logo: isHome ? "#" : "index.html",
			home: isHome ? "" : "index.html",
			bookCurrent: page === "book.html" ? "page" : "false",
		},
		t: nestTranslations(copy),
	};

	return mustache.render(template, view, (name) => {
		if (!Object.hasOwn(partials, name)) {
			throw new Error(`Missing partial "${name}" in ${page}`);
		}
		return partials[name];
	});
}

function writeSitemap(pages) {
	const entries = LANGUAGES.flatMap(({ code }) =>
		pages.map((page) => `  <url><loc>${pageUrl(code, page)}</loc></url>`),
	);
	const xml = [
		'<?xml version="1.0" encoding="UTF-8"?>',
		'<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
		...entries,
		"</urlset>",
		"",
	].join("\n");
	fs.writeFileSync(path.join(OUT, "sitemap.xml"), xml, "utf-8");
}

function build() {
	const translations = loadTranslations();
	const partials = loadPartials();
	const pages = fs
		.readdirSync(TEMPLATES)
		.filter((f) => f.endsWith(".html"))
		.sort();
	for (const lang of LANGUAGES.map((l) => l.code)) {
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
				partials,
			);
			fs.writeFileSync(path.join(outDir, page), html, "utf-8");
		}
	}
	writeSitemap(pages);
}

build();
