/* ===========================================
   Ганна Іваннікова — Main Script
   Mobile nav, scroll effects, animations
   v2.0 — Refined scroll-reveal with stagger
   =========================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Elements ---- */
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav__link');
    const hero = document.getElementById('hero');

    /* ---- Mobile Nav Toggle ---- */
    if (navToggle && nav) {
        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'nav-overlay';
        document.body.appendChild(overlay);

        function openNav() {
            nav.classList.add('open');
            navToggle.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeNav() {
            nav.classList.remove('open');
            navToggle.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }

        navToggle.addEventListener('click', () => {
            if (nav.classList.contains('open')) {
                closeNav();
            } else {
                openNav();
            }
        });

        overlay.addEventListener('click', closeNav);

        // Close nav on link click
        navLinks.forEach(link => {
            link.addEventListener('click', closeNav);
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && nav.classList.contains('open')) {
                closeNav();
            }
        });
    }

    /* ---- Header scroll effect ---- */
    function handleScroll() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check

    /* ---- Scroll Reveal Animations ---- */
    // Individual reveal elements
    const revealElements = document.querySelectorAll(
        '.section__header, .step, .help__card, .result__card, .meeting, ' +
        '.about__content > *, .philosophy__inner > *, ' +
        '.pricing__card > *, .about__emphasis'
    );

    // Elements inside reveal-groups
    const revealGroups = document.querySelectorAll('.reveal-group');

    const allReveal = [...revealElements];

    // Configure IntersectionObserver
    let observer;
    if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px'
        });

        // Observe individual elements
        allReveal.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });

        // Also observe children of reveal-groups for stagger
        revealGroups.forEach(group => {
            const children = group.children;
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                // Only add reveal if not already targeted individually
                if (!child.classList.contains('reveal')) {
                    child.classList.add('reveal');
                    observer.observe(child);
                }
            }
        });
    } else {
        // Fallback: make everything visible immediately
        allReveal.forEach(el => el.classList.add('visible'));
        revealGroups.forEach(group => {
            [...group.children].forEach(child => child.classList.add('visible'));
        });
    }

    /* ---- Active nav link highlight on scroll ---- */
    const sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        let current = '';
        sections.forEach(section => {
            const top = section.offsetTop - 120;
            if (window.scrollY >= top) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('nav__link--active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('nav__link--active');
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
    highlightNav();

});
