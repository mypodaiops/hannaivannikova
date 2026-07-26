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
		".hero__title",
		".hero__subtitle",
		".hero__actions",
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
		".calculator__card",
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

	/* ---- Compound Interest Calculator ---- */
	const tableToggle = document.querySelector(".calculator__toggle");
	if (tableToggle) {
		const amountInput = document.getElementById("calc-amount");
		const rateInput = document.getElementById("calc-rate");
		const termInput = document.getElementById("calc-term");
		const termTypeInput = document.getElementById("calc-term-type");
		const contributionInput = document.getElementById("calc-contribution");
		const finalEl = document.getElementById("calc-final");
		const profitEl = document.getElementById("calc-profit");
		const contributionsEl = document.getElementById("calc-contributions");
		const tableWrapper = document.getElementById("calc-table-wrapper");
		const tableBody = document.getElementById("calc-table-body");

		function formatMoney(value) {
			return value.toLocaleString("uk-UA", {
				minimumFractionDigits: 2,
				maximumFractionDigits: 2,
			});
		}

		function formatTableMoney(value) {
			return Math.round(value).toLocaleString("uk-UA");
		}

		function calculate() {
			const amount = Number(amountInput.value) || 0;
			const rate = Number(rateInput.value) || 0;
			const termInputValue = Math.max(
				1,
				Math.floor(Number(termInput.value) || 0),
			);
			const termMonths =
				termTypeInput.value === "years" ? termInputValue * 12 : termInputValue;
			const contribution = Number(contributionInput.value) || 0;
			const monthlyRate = ((rate / 100) * 30) / 365;

			let balance = amount;
			let totalContributions = 0;
			const rows = [];

			for (let month = 1; month <= termMonths; month++) {
				if (month >= 2) {
					balance += contribution;
					totalContributions += contribution;
				}
				const interest = balance * monthlyRate;
				balance += interest;
				rows.push({
					month,
					principal: balance - interest,
					interest,
					balance,
				});
			}

			const profit = balance - amount - totalContributions;
			finalEl.textContent = formatMoney(balance);
			profitEl.textContent = formatMoney(profit);
			contributionsEl.textContent = formatMoney(totalContributions);

			tableBody.replaceChildren();
			rows.forEach((row) => {
				const tr = document.createElement("tr");
				[
					row.month,
					formatTableMoney(row.principal),
					formatTableMoney(row.interest),
					formatTableMoney(row.balance),
				].forEach((text) => {
					const td = document.createElement("td");
					td.textContent = text;
					tr.appendChild(td);
				});
				tableBody.appendChild(tr);
			});
		}

		tableToggle.addEventListener("click", () => {
			const expanded = tableWrapper.hidden;
			tableWrapper.hidden = !expanded;
			tableToggle.setAttribute("aria-expanded", String(expanded));
		});
		[
			amountInput,
			rateInput,
			termInput,
			termTypeInput,
			contributionInput,
		].forEach((input) => input.addEventListener("input", calculate));
		calculate();
	}
});
