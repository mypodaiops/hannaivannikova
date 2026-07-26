/* ===========================================
   Hanna Ivannikova — Simple i18n
   =========================================== */

(() => {
	const translations = window.hannaTranslations || {};

	function getLang() {
		const params = new URLSearchParams(window.location.search);
		const param = params.get("lang");
		if (param === "uk" || param === "en") return param;
		const stored = localStorage.getItem("hanna-lang");
		if (stored === "uk" || stored === "en") return stored;
		return "uk";
	}

	function changeLanguage(lang) {
		localStorage.setItem("hanna-lang", lang);
		applyLang(lang);
		updateLinks(lang);
		const params = new URLSearchParams(window.location.search);
		params.set("lang", lang);
		const url =
			window.location.pathname + "?" + params.toString() + window.location.hash;
		history.replaceState({}, "", url);
	}

	function applyLang(lang) {
		const dict = translations[lang];
		if (!dict) return;

		document.documentElement.lang = lang === "uk" ? "uk" : "en";

		if (dict["page.title"]) document.title = dict["page.title"];

		const metaDescription = document.querySelector('meta[name="description"]');
		if (metaDescription && dict["page.description"]) {
			metaDescription.setAttribute("content", dict["page.description"]);
		}
		const ogTitle = document.querySelector('meta[property="og:title"]');
		if (ogTitle && dict["page.title"]) {
			ogTitle.setAttribute("content", dict["page.title"]);
		}
		const ogDescription = document.querySelector(
			'meta[property="og:description"]',
		);
		if (ogDescription && dict["page.description"]) {
			ogDescription.setAttribute("content", dict["page.description"]);
		}
		const ogLocale = document.querySelector('meta[property="og:locale"]');
		if (ogLocale) {
			ogLocale.setAttribute("content", lang === "uk" ? "uk_UA" : "en_US");
		}

		document.querySelectorAll("[data-i18n]").forEach((el) => {
			const key = el.getAttribute("data-i18n");
			const value = dict[key];
			if (value === undefined) return;
			el.textContent = value;
		});

		document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
			const [key, attr] = el.getAttribute("data-i18n-attr").split("|");
			const value = dict[key];
			if (value !== undefined) el.setAttribute(attr, value);
		});

		document
			.querySelectorAll('[data-lang="uk"], [data-lang="en"]')
			.forEach((btn) => {
				const active = btn.getAttribute("data-lang") === lang;
				btn.classList.toggle("nav__link--current", active);
				if (active) {
					btn.setAttribute("aria-current", "true");
					btn.removeAttribute("href");
				} else {
					btn.removeAttribute("aria-current");
					const params = new URLSearchParams(window.location.search);
					params.set("lang", btn.getAttribute("data-lang"));
					btn.setAttribute("href", "?" + params.toString());
				}
			});
	}

	function updateLinks(lang) {
		document.querySelectorAll("a[href]").forEach((link) => {
			const href = link.getAttribute("href");
			if (
				!href ||
				href.startsWith("http") ||
				href.startsWith("#") ||
				link.hasAttribute("data-lang")
			) {
				return;
			}
			try {
				const url = new URL(href, window.location.href);
				if (url.origin !== window.location.origin) return;
				if (lang === "uk") {
					url.searchParams.delete("lang");
				} else {
					url.searchParams.set("lang", lang);
				}
				link.setAttribute("href", url.pathname + url.search + url.hash);
			} catch {
				// ignore malformed URLs
			}
		});
	}

	const lang = getLang();
	applyLang(lang);
	updateLinks(lang);
	document.documentElement.classList.remove("is-translating");

	document
		.querySelectorAll('[data-lang="uk"], [data-lang="en"]')
		.forEach((btn) => {
			btn.addEventListener("click", (e) => {
				if (btn.classList.contains("nav__link--current")) return;
				e.preventDefault();
				changeLanguage(btn.getAttribute("data-lang"));
			});
		});

	window.hannaI18n = { changeLanguage };
})();
