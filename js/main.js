/* ===========================================
   Ганна Іваннікова — Main Script
   Mobile nav, header scroll state, reveal
   =========================================== */

document.addEventListener("DOMContentLoaded", () => {
	const header = document.getElementById("header");
	const navToggle = document.getElementById("navToggle");
	const nav = document.getElementById("nav");
	const navLinks = document.querySelectorAll(".nav__link");

	/* ---- Mobile Nav Toggle ---- */
	if (navToggle && nav) {
		const overlay = document.createElement("div");
		overlay.className = "nav-overlay";
		document.body.appendChild(overlay);

		function toggleNav(open) {
			nav.classList.toggle("open", open);
			navToggle.classList.toggle("active", open);
			overlay.classList.toggle("active", open);
			document.body.style.overflow = open ? "hidden" : "";
		}

		navToggle.addEventListener("click", () =>
			toggleNav(!nav.classList.contains("open")),
		);
		overlay.addEventListener("click", () => toggleNav(false));
		navLinks.forEach((link) =>
			link.addEventListener("click", () => toggleNav(false)),
		);
		document.addEventListener("keydown", (e) => {
			if (e.key === "Escape") toggleNav(false);
		});
	}

	/* ---- Scroll-driven updates ---- */
	const revealSelectors = [
		".section__header",
		".step",
		".help__card",
		".result__card",
		".meeting",
		".about__content > *",
		".philosophy__inner > *",
		".pricing__card > *",
		".about__emphasis",
		".reveal-group > *",
	];
	const revealElements = [
		...new Set(
			revealSelectors.flatMap((sel) => [...document.querySelectorAll(sel)]),
		),
	];

	revealElements.forEach((el) => {
		el.classList.add("reveal");
	});

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					entry.target.classList.add("visible");
					observer.unobserve(entry.target);
				}
			});
		},
		{ threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
	);

	revealElements.forEach((el) => observer.observe(el));

	let ticking = false;
	function onScroll() {
		if (!ticking) {
			requestAnimationFrame(() => {
				header.classList.toggle("scrolled", window.scrollY > 50);
				ticking = false;
			});
			ticking = true;
		}
	}

	window.addEventListener("scroll", onScroll, { passive: true });
	header.classList.toggle("scrolled", window.scrollY > 50);
});
