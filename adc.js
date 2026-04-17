/* ============================================================
   ASSEMBLÉES DE DIEU DE CENTRAFRIQUE — SCRIPT PROFESSIONNEL
   Version Premium — Avril 2026
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── LOADER ─────────────────────────────────────────────── */
  const loader = document.getElementById('loader');
  if (loader) {
    window.addEventListener('load', () => {
      loader.style.opacity = '0';
      setTimeout(() => loader.style.display = 'none', 500);
    });
  }

  /* ── BARRE DE PROGRESSION DE LECTURE ────────────────────── */
  const bar = document.getElementById('reading-bar');
  if (bar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      const pct   = total > 0 ? (window.scrollY / total) * 100 : 0;
      bar.style.width = pct + '%';
    });
  }

  /* ── HEADER SHRINK AU SCROLL ────────────────────────────── */
  const header = document.querySelector('.header');
  const marqueeBar = document.querySelector('.marquee-bar');
  if (header) {
    window.addEventListener('scroll', () => {
      const shrink = window.scrollY > 80;
      header.classList.toggle('shrink', shrink);
      if (marqueeBar) {
        marqueeBar.style.top = shrink ? '54px' : '68px';
      }
    });
  }

  /* ── MENU HAMBURGER ─────────────────────────────────────── */
  const toggle = document.querySelector('.menu-toggle');
  const nav    = document.querySelector('nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      nav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', nav.classList.contains('active'));
    });
    document.addEventListener('click', (e) => {
      if (!header.contains(e.target)) nav.classList.remove('active');
    });
  }

  /* ── DROPDOWN ───────────────────────────────────────────── */
  document.querySelectorAll('.dropdown').forEach(dd => {
    const btn  = dd.querySelector('.dropdown-toggle');
    const menu = dd.querySelector('.dropdown-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
      if (!isOpen) menu.classList.add('show');
    });
    document.addEventListener('click', () => menu.classList.remove('show'));
  });

  /* ── DARK MODE ──────────────────────────────────────────── */
  const darkBtn  = document.getElementById('dark-toggle');
  const saved    = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', saved);
  if (darkBtn) {
    updateDarkIcon(saved);
    darkBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next    = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      updateDarkIcon(next);
    });
  }
  function updateDarkIcon(theme) {
    if (!darkBtn) return;
    const icon = darkBtn.querySelector('i');
    const span = darkBtn.querySelector('span');
    if (icon) icon.className = theme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    if (span) span.textContent = theme === 'dark' ? 'Clair' : 'Sombre';
  }

  /* ── SLIDER ─────────────────────────────────────────────── */
  const wrapper = document.querySelector('.slider-wrapper');
  const slides  = document.querySelectorAll('.slide');
  const dots    = document.querySelectorAll('.slider-dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  let current = 0, autoTimer = null;

  function goTo(idx) {
    slides[current]?.classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current]?.classList.add('active');
    dots[current]?.classList.add('active');
    if (wrapper) wrapper.style.transform = `translateX(-${current * 100}%)`;
  }

  if (slides.length > 0) {
    goTo(0);
    autoTimer = setInterval(() => goTo(current + 1), 5000);
    prevBtn?.addEventListener('click', () => { clearInterval(autoTimer); goTo(current - 1); autoTimer = setInterval(() => goTo(current + 1), 5000); });
    nextBtn?.addEventListener('click', () => { clearInterval(autoTimer); goTo(current + 1); autoTimer = setInterval(() => goTo(current + 1), 5000); });
    dots.forEach((d, i) => d.addEventListener('click', () => { clearInterval(autoTimer); goTo(i); autoTimer = setInterval(() => goTo(current + 1), 5000); }));

    /* Swipe mobile */
    let startX = 0;
    wrapper?.addEventListener('touchstart', e => startX = e.touches[0].clientX, { passive: true });
    wrapper?.addEventListener('touchend', e => {
      const diff = startX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) { clearInterval(autoTimer); goTo(diff > 0 ? current + 1 : current - 1); autoTimer = setInterval(() => goTo(current + 1), 5000); }
    });
  }

  /* ── COMPTEUR ANIMÉ ─────────────────────────────────────── */
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = el.dataset.suffix || '';
      let count = 0;
      const step = Math.ceil(target / 60);
      const timer = setInterval(() => {
        count = Math.min(count + step, target);
        el.textContent = count + suffix;
        if (count >= target) clearInterval(timer);
      }, 25);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(c => countObserver.observe(c));

  /* ── FADE-IN AU SCROLL ──────────────────────────────────── */
  const fadeEls = document.querySelectorAll('.fade-in');
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); fadeObserver.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => fadeObserver.observe(el));

  /* ── LAZY LOADING IMAGES ────────────────────────────────── */
  const lazyImgs = document.querySelectorAll('img[data-src]');
  if ('IntersectionObserver' in window) {
    const lazyObserver = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const img = e.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          lazyObserver.unobserve(img);
        }
      });
    }, { rootMargin: '200px' });
    lazyImgs.forEach(img => lazyObserver.observe(img));
  } else {
    lazyImgs.forEach(img => { img.src = img.dataset.src; });
  }

  /* ── LIGHTBOX ───────────────────────────────────────────── */
  const lightbox     = document.getElementById('lightbox');
  const lbImg        = document.getElementById('lightbox-img');
  const lbClose      = document.getElementById('lightbox-close');
  const lbPrev       = document.getElementById('lightbox-prev');
  const lbNext       = document.getElementById('lightbox-next');
  let lbItems = [], lbIndex = 0;

  function openLightbox(items, idx) {
    lbItems = items; lbIndex = idx;
    if (lbImg) lbImg.src = lbItems[lbIndex];
    lightbox?.classList.add('open');
    document.documentElement.classList.add('lb-open');
    document.body.classList.add('lb-open');
  }
  function closeLightbox() {
    lightbox?.classList.remove('open');
    document.documentElement.classList.remove('lb-open');
    document.body.classList.remove('lb-open');
  }
  function lbGo(dir) {
    lbIndex = (lbIndex + dir + lbItems.length) % lbItems.length;
    if (lbImg) lbImg.src = lbItems[lbIndex];
  }

  lbClose?.addEventListener('click', closeLightbox);
  lbPrev?.addEventListener('click', () => lbGo(-1));
  lbNext?.addEventListener('click', () => lbGo(1));
  lightbox?.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (!lightbox?.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lbGo(-1);
    if (e.key === 'ArrowRight') lbGo(1);
  });

  /* ── Lightbox : galerie principale (.galerie-item) et autres ── */
  const galItems = document.querySelectorAll('.galerie-item, .actu-photos-grid img, .promo-card img');
  const galSrcs  = [];
  galItems.forEach((item, i) => {
    const img = item.tagName === 'IMG' ? item : item.querySelector('img');
    if (img) {
      galSrcs.push(img.src || img.dataset.src);
      item.addEventListener('click', () => openLightbox(galSrcs, i));
      item.style.cursor = 'pointer';
    }
  });

  /* ── Lightbox : galeries de départements (.dept-gallery-item) ── */
  /* Regrouper par grille parente pour navigation cohérente dans chaque section */
  document.querySelectorAll('.dept-gallery-grid').forEach(grid => {
    const items = grid.querySelectorAll('.dept-gallery-item');
    const srcs  = [];
    items.forEach(item => {
      const img = item.querySelector('img');
      if (img) srcs.push(img.src || img.dataset.src || '');
    });
    items.forEach((item, i) => {
      item.style.cursor = 'pointer';
      item.addEventListener('click', () => openLightbox(srcs, i));
    });
  });

  /* ── Lightbox : images isolées avec data-lightbox (hors dept-gallery-grid) ── */
  const lbDirectImgs = document.querySelectorAll('img[data-lightbox]:not(.dept-gallery-img)');
  const lbDirectSrcs = Array.from(lbDirectImgs).map(img => img.src);
  lbDirectImgs.forEach((img, i) => {
    img.style.cursor = 'pointer';
    img.addEventListener('click', () => openLightbox(lbDirectSrcs, i));
  });

  /* ── BOUTON RETOUR EN HAUT ──────────────────────────────── */
  const backTop = document.getElementById('back-to-top');
  if (backTop) {
    window.addEventListener('scroll', () => {
      backTop.classList.toggle('visible', window.scrollY > 400);
    });
    backTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ── LIEN ACTIF DANS LE MENU ────────────────────────────── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && (href === page || (page === '' && href === 'index.html'))) {
      a.classList.add('active');
    }
  });

  /* ── FORMULAIRE CONTACT ─────────────────────────────────── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      if (btn) { btn.textContent = '✅ Message envoyé !'; btn.disabled = true; }
      setTimeout(() => { if (btn) { btn.innerHTML = '<i class="fa-solid fa-paper-plane"></i> Envoyer'; btn.disabled = false; } contactForm.reset(); }, 3000);
    });
  }

});
