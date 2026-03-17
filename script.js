document.addEventListener('DOMContentLoaded', () => {

    // ─── Theme (dark-first) ────────────────────────────────────────────
    // :root = dark, [data-theme="light"] = light
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    function setTheme(theme) {
        if (theme === 'light') {
            html.setAttribute('data-theme', 'light');
        } else {
            html.removeAttribute('data-theme');
        }
        const icon = themeToggle && themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }

    const savedTheme = localStorage.getItem('theme') || 'dark';
    setTheme(savedTheme);

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = html.getAttribute('data-theme') === 'light';
            const newTheme = isLight ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            setTheme(newTheme);
        });
    }

    // ─── Dynamic year ──────────────────────────────────────────────────
    document.querySelectorAll('.year').forEach(el => {
        el.textContent = new Date().getFullYear();
    });

    // ─── Mobile menu ───────────────────────────────────────────────────
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('nav ul');
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (navMenu) navMenu.classList.toggle('active', isMenuOpen);
        if (menuToggle) {
            menuToggle.innerHTML = isMenuOpen
                ? '<i class="fas fa-times"></i>'
                : '<i class="fas fa-bars"></i>';
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', e => {
            e.stopPropagation();
            toggleMenu();
        });
    }

    document.addEventListener('click', e => {
        if (isMenuOpen && navMenu && !navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
            toggleMenu();
        }
    });

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', () => { if (isMenuOpen) toggleMenu(); });
    });

    // ─── Smooth scroll ─────────────────────────────────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Fade-in on scroll ─────────────────────────────────────────────
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-out');
        observer.observe(section);
    });

    // ─── Scroll-spy ────────────────────────────────────────────────────
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('nav a[href^="#"]');

    function updateActiveNav() {
        let current = '';
        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - 160) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    }

    window.addEventListener('scroll', updateActiveNav, { passive: true });
    updateActiveNav();

    // ─── Back to Top ───────────────────────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 400);
        }, { passive: true });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Blog filters ──────────────────────────────────────────────────
    const filterBtns = document.querySelectorAll('.filter-btn');
    const blogCards = document.querySelectorAll('.blog-card[data-category]');

    if (filterBtns.length) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const filter = btn.dataset.filter;
                blogCards.forEach(card => {
                    const show = filter === 'all' || card.dataset.category === filter;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }

    // ─── Typewriter effect ─────────────────────────────────────────────
    const typewriterEl = document.getElementById('typewriter');
    if (typewriterEl) {
        const phrases = ['AI Researcher', 'Builder', 'Problem Solver'];
        let phraseIdx = 0;
        let charIdx = 0;
        let deleting = false;
        const TYPING_SPEED = 90;
        const DELETING_SPEED = 50;
        const PAUSE_AFTER = 1800;

        function typeLoop() {
            const current = phrases[phraseIdx];
            if (!deleting) {
                typewriterEl.textContent = current.slice(0, ++charIdx);
                if (charIdx === current.length) {
                    deleting = true;
                    setTimeout(typeLoop, PAUSE_AFTER);
                    return;
                }
            } else {
                typewriterEl.textContent = current.slice(0, --charIdx);
                if (charIdx === 0) {
                    deleting = false;
                    phraseIdx = (phraseIdx + 1) % phrases.length;
                }
            }
            setTimeout(typeLoop, deleting ? DELETING_SPEED : TYPING_SPEED);
        }

        typeLoop();
    }

    // ─── Project cards click-through ───────────────────────────────────
    document.querySelectorAll('.project-card[data-blog-url]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', function (e) {
            // Don't navigate if clicking a link inside the card
            if (e.target.closest('a')) return;
            window.location.href = this.dataset.blogUrl;
        });
    });

});
