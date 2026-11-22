const assert = require("node:assert/strict");
const { execFileSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");
const { before, test } = require("node:test");

const ROOT = path.join(__dirname, "..");
const ORIGIN = "https://hannaivannikova.com";
const PAGE_PAIRS = [
	["/uk/", "/en/"],
	["/uk/calculator.html", "/en/calculator.html"],
	["/uk/book.html", "/en/book.html"],
];

before(() => {
	execFileSync(process.execPath, ["build.js"], { cwd: ROOT, stdio: "inherit" });
});

function readPublishedFile(route) {
	return fs.readFileSync(path.join(ROOT, route), "utf-8");
}

function linksWithRel(html, rel) {
	return Array.from(html.matchAll(/<link\b([^>]+)>/g), ([, attrs]) =>
		Object.fromEntries(
			Array.from(attrs.matchAll(/([\w-]+)="([^"]*)"/g), ([, name, value]) => [name, value]),
		),
	).filter((link) => link.rel === rel);
}

function readPage(route) {
	return readPublishedFile(route.endsWith("/") ? `${route}index.html` : route);
}

test("each localized page points to its own canonical URL", () => {
	for (const route of PAGE_PAIRS.flat()) {
		assert.deepEqual(
			linksWithRel(readPage(route), "canonical").map((link) => link.href),
			[`${ORIGIN}${route}`],
			route,
		);
	}
});

test("each localized page lists both language versions and the Ukrainian fallback", () => {
	for (const [uk, en] of PAGE_PAIRS) {
		for (const route of [uk, en]) {
			const alternates = linksWithRel(readPage(route), "alternate");
			assert.equal(alternates.length, 3, route);
			assert.deepEqual(
				Object.fromEntries(alternates.map(({ hreflang, href }) => [hreflang, href])),
				{ uk: `${ORIGIN}${uk}`, en: `${ORIGIN}${en}`, "x-default": `${ORIGIN}${uk}` },
				route,
			);
		}
	}
});

test("the sitemap lists exactly the six canonical pages, not redirects or the 404", () => {
	const sitemap = readPublishedFile("/sitemap.xml");
	const urls = Array.from(sitemap.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/g), ([, loc]) => loc);
	assert.deepEqual(urls.sort(), PAGE_PAIRS.flat().map((route) => `${ORIGIN}${route}`).sort());
});

test("robots.txt announces the sitemap and leaves crawling open", () => {
	const robots = readPublishedFile("/robots.txt");
	assert.match(robots, /^User-agent:\s*\*$/m);
	assert.match(robots, /^Sitemap:\s*https:\/\/hannaivannikova\.com\/sitemap\.xml$/m);
	assert.doesNotMatch(robots, /^Disallow:[ \t]*\S/im);
});
