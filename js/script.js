/* =========================================================
   Himmat Prajapati — Portfolio
   Interactivity
   ========================================================= */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- AOS init ---------- */
  if (window.AOS) {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgressBar');
  const nav = document.getElementById('mainNav');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = pct + '%';

    if (nav) nav.classList.toggle('scrolled', scrollTop > 40);
    if (backToTop) backToTop.classList.toggle('show', scrollTop > 500);
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop && backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- Collapse mobile nav after link click ---------- */
  document.querySelectorAll('#navMenu .nav-link').forEach(link => {
    link.addEventListener('click', () => {
      const menu = document.getElementById('navMenu');
      if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  /* ---------- Theme toggle (dark/light) ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;
  const savedTheme = localStorageSafeGet('theme') || 'dark';
  root.setAttribute('data-theme', savedTheme);

  themeToggle && themeToggle.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    localStorageSafeSet('theme', next);
  });

  // Safe wrappers in case storage is unavailable (e.g. sandboxed preview)
  function localStorageSafeGet(key) {
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function localStorageSafeSet(key, val) {
    try { localStorage.setItem(key, val); } catch (e) { /* no-op */ }
  }

  /* ---------- Typing animation ---------- */
  const roles = [
    'Full Stack Web Developer',
    'Laravel Developer',
    'Software Support Engineer',
    'ERP Systems Builder'
  ];
  const typedEl = document.getElementById('typedRole');
  if (typedEl) {
    let roleIndex = 0, charIndex = 0, deleting = false;

    function typeLoop() {
      const current = roles[roleIndex];
      if (!deleting) {
        charIndex++;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1400);
          return;
        }
      } else {
        charIndex--;
        typedEl.textContent = current.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 35 : 65);
    }
    typeLoop();
  }

  /* ---------- Counter animation (dashboard stats) ---------- */
  const counters = document.querySelectorAll('.dash-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach(c => counterObserver.observe(c));

  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'), 10) || 0;
    const duration = 1200;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  /* ---------- Project filtering ---------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectItems = document.querySelectorAll('.project-item');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const match = filter === 'all' || item.getAttribute('data-cat') === filter;
        item.classList.toggle('hide', !match);
      });
    });
  });

  /* ---------- Contact form (client-side validation, mailto fallback) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('cf-status');

  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      if (status) { status.textContent = 'Please fill in all required fields.'; status.style.color = '#F87171'; }
      return;
    }

    const name = document.getElementById('cf-name').value.trim();
    const email = document.getElementById('cf-email').value.trim();
    const phone = document.getElementById('cf-phone').value.trim();
    const subject = document.getElementById('cf-subject').value.trim() || 'New enquiry from portfolio site';
    const message = document.getElementById('cf-message').value.trim();

    const body = `Name: ${name}%0AEmail: ${email}%0APhone: ${phone}%0A%0A${encodeURIComponent(message)}`;
    const mailto = `mailto:himmatjprajapati@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    window.location.href = mailto;

    if (status) { status.textContent = 'Opening your email app to send this message…'; status.style.color = '#34D399'; }
    form.reset();
    form.classList.remove('was-validated');
  });

});
