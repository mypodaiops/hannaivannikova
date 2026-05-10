/* ===========================================
   Ганна Іваннікова — Main Script
   Mobile nav, scroll effects, animations
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
    const revealElements = document.querySelectorAll(
        '.section__header, .step, .help__card, .result__card, .meeting, ' +
        '.about__content > *, .why__content > *, .philosophy__inner > *, ' +
        '.pricing__card > *'
    );

    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal', 'visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -40px 0px'
        });

        revealElements.forEach(el => {
            el.classList.add('reveal');
            observer.observe(el);
        });
    } else {
        // Fallback: make everything visible immediately
        revealElements.forEach(el => {
            el.classList.add('visible');
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
