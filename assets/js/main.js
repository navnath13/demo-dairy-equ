/* =====================================================
   EUP Dairy Systems — Main JavaScript
   Premium interactions, GSAP, counters, UI extras
   ===================================================== */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initLoader();
  initCustomCursor();
  initNavbar();
  initParticles();
  initCounters();
  initRipple();
  initThemeToggle();
  initBackToTop();
  initSearchPopup();
  initCookieConsent();
  initNewsletterPopup();
  initLightbox();
  initFilters();
  initProductThumbs();
  initSmoothAnchors();
  initAOS();
  initGSAP();
  initSwipers();
  initParallax();
});

/* ---------- Loader ---------- */
function initLoader() {
  const loader = document.querySelector('.page-loader');
  if (!loader) {
    document.body.classList.add('loaded');
    return;
  }

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.add('loaded');
    }, 1400);
  });

  // Fallback
  setTimeout(() => {
    loader.classList.add('hidden');
    document.body.classList.add('loaded');
  }, 3500);
}

/* ---------- Custom Cursor ---------- */
function initCustomCursor() {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.querySelector('.custom-cursor');
  const follower = document.querySelector('.cursor-follower');
  if (!cursor || !follower) return;

  let mouseX = 0, mouseY = 0;
  let followerX = 0, followerY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
  });

  function animateFollower() {
    followerX += (mouseX - followerX) * 0.15;
    followerY += (mouseY - followerY) * 0.15;
    follower.style.left = followerX + 'px';
    follower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
  }
  animateFollower();

  const hoverTargets = 'a, button, .product-card, .industry-card, .project-item, .filter-btn, input, textarea, select';
  document.querySelectorAll(hoverTargets).forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursor.classList.add('hover');
      follower.classList.add('hover');
    });
    el.addEventListener('mouseleave', () => {
      cursor.classList.remove('hover');
      follower.classList.remove('hover');
    });
  });
}

/* ---------- Navbar ---------- */
function initNavbar() {
  const navbar = document.querySelector('.main-navbar');
  if (!navbar) return;

  const onScroll = () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Close mobile menu on link click
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const collapse = document.querySelector('.navbar-collapse');
      if (collapse && collapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(collapse);
        if (bsCollapse) bsCollapse.hide();
      }
    });
  });

  // Active link based on page
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === path || (path === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });
}

/* ---------- Hero Particles ---------- */
function initParticles() {
  const container = document.querySelector('.hero-particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    p.style.left = Math.random() * 100 + '%';
    p.style.animationDuration = Math.random() * 12 + 8 + 's';
    p.style.animationDelay = Math.random() * 8 + 's';
    container.appendChild(p);
  }
}

/* ---------- Animated Counters ---------- */
function initCounters() {
  const counters = document.querySelectorAll('[data-count]');
  if (!counters.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-count'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 2000;
    const start = performance.now();

    const update = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target) + suffix;
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  };

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.counted) {
          entry.target.dataset.counted = 'true';
          animateCounter(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach((c) => observer.observe(c));
}

/* ---------- Button Ripple ---------- */
function initRipple() {
  document.querySelectorAll('.btn-primary-custom, .btn-accent-custom, .nav-quote-btn').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
      ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

/* ---------- Dark Mode ---------- */
function initThemeToggle() {
  const toggle = document.querySelector('.theme-toggle');
  const saved = localStorage.getItem('eup-theme');

  if (saved === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    updateThemeIcon(true);
  }

  if (!toggle) return;

  toggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('eup-theme', 'light');
      updateThemeIcon(false);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('eup-theme', 'dark');
      updateThemeIcon(true);
    }
  });
}

function updateThemeIcon(isDark) {
  document.querySelectorAll('.theme-toggle i').forEach((icon) => {
    icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  });
}

/* ---------- Back to Top ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener(
    'scroll',
    () => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    },
    { passive: true }
  );

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ---------- Search Popup ---------- */
function initSearchPopup() {
  const popup = document.querySelector('.search-popup');
  const openBtns = document.querySelectorAll('[data-search-open]');
  const closeBtn = document.querySelector('.search-close');

  if (!popup) return;

  openBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      popup.classList.add('active');
      const input = popup.querySelector('input');
      if (input) setTimeout(() => input.focus(), 300);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => popup.classList.remove('active'));
  }

  popup.addEventListener('click', (e) => {
    if (e.target === popup) popup.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') popup.classList.remove('active');
  });
}

/* ---------- Cookie Consent ---------- */
function initCookieConsent() {
  const banner = document.querySelector('.cookie-consent');
  if (!banner) return;

  if (localStorage.getItem('eup-cookies')) return;

  setTimeout(() => banner.classList.add('show'), 2000);

  const accept = banner.querySelector('.cookie-accept');
  const decline = banner.querySelector('.cookie-decline');

  if (accept) {
    accept.addEventListener('click', () => {
      localStorage.setItem('eup-cookies', 'accepted');
      banner.classList.remove('show');
    });
  }

  if (decline) {
    decline.addEventListener('click', () => {
      localStorage.setItem('eup-cookies', 'declined');
      banner.classList.remove('show');
    });
  }
}

/* ---------- Newsletter Popup ---------- */
function initNewsletterPopup() {
  const overlay = document.querySelector('.newsletter-popup-overlay');
  if (!overlay) return;
  if (localStorage.getItem('eup-newsletter')) return;

  setTimeout(() => {
    if (!localStorage.getItem('eup-newsletter')) {
      overlay.classList.add('active');
    }
  }, 8000);

  const close = overlay.querySelector('.newsletter-popup-close');
  if (close) {
    close.addEventListener('click', () => {
      overlay.classList.remove('active');
      localStorage.setItem('eup-newsletter', 'closed');
    });
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      localStorage.setItem('eup-newsletter', 'closed');
    }
  });

  const form = overlay.querySelector('form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      localStorage.setItem('eup-newsletter', 'subscribed');
      overlay.classList.remove('active');
      showToast('Thank you for subscribing!');
    });
  }
}

/* ---------- Lightbox ---------- */
function initLightbox() {
  const overlay = document.querySelector('.lightbox-overlay');
  if (!overlay) return;

  const img = overlay.querySelector('img');
  const closeBtn = overlay.querySelector('.lightbox-close');

  document.querySelectorAll('[data-lightbox]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      const src = el.getAttribute('data-lightbox') || el.querySelector('img')?.src;
      if (src && img) {
        img.src = src;
        overlay.classList.add('active');
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => overlay.classList.remove('active'));
  }

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.classList.remove('active');
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') overlay.classList.remove('active');
  });
}

/* ---------- Gallery / Project Filters ---------- */
function initFilters() {
  document.querySelectorAll('.filter-btns').forEach((group) => {
    const btns = group.querySelectorAll('.filter-btn');
    const targetSel = group.getAttribute('data-filter-target') || '.filterable';
    const items = document.querySelectorAll(targetSel);

    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');

        items.forEach((item) => {
          if (filter === 'all' || item.classList.contains(filter)) {
            item.style.display = '';
            item.style.opacity = '0';
            setTimeout(() => {
              item.style.transition = 'opacity 0.4s';
              item.style.opacity = '1';
            }, 50);
          } else {
            item.style.display = 'none';
          }
        });
      });
    });
  });
}

/* ---------- Product Thumbs ---------- */
function initProductThumbs() {
  const main = document.querySelector('.product-gallery-main img');
  const thumbs = document.querySelectorAll('.product-thumb');
  if (!main || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      thumbs.forEach((t) => t.classList.remove('active'));
      thumb.classList.add('active');
      const src = thumb.querySelector('img')?.src;
      if (src) {
        main.style.opacity = '0';
        setTimeout(() => {
          main.src = src;
          main.style.opacity = '1';
        }, 200);
      }
    });
  });

  if (main) main.style.transition = 'opacity 0.2s';
}

/* ---------- Smooth Anchors ---------- */
function initSmoothAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

/* ---------- AOS ---------- */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
      offset: 80,
      disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches
    });
  }
}

/* ---------- GSAP ScrollTrigger ---------- */
function initGSAP() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  // Hero title reveal
  const heroTitle = document.querySelector('.hero-title');
  if (heroTitle) {
    gsap.from(heroTitle, {
      y: 60,
      opacity: 0,
      duration: 1.1,
      delay: 1.5,
      ease: 'power3.out'
    });
  }

  const heroSub = document.querySelector('.hero-subtitle');
  if (heroSub) {
    gsap.from(heroSub, {
      y: 40,
      opacity: 0,
      duration: 1,
      delay: 1.75,
      ease: 'power3.out'
    });
  }

  const heroBtns = document.querySelector('.hero-btns');
  if (heroBtns) {
    gsap.from(heroBtns, {
      y: 30,
      opacity: 0,
      duration: 0.9,
      delay: 2,
      ease: 'power3.out'
    });
  }

  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    gsap.from(heroVisual, {
      x: 80,
      opacity: 0,
      duration: 1.2,
      delay: 1.8,
      ease: 'power3.out'
    });
  }

  // Section title reveals
  gsap.utils.toArray('.section-title').forEach((title) => {
    gsap.from(title, {
      scrollTrigger: { trigger: title, start: 'top 85%' },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: 'power2.out'
    });
  });

  // Process line animation
  const processLine = document.querySelector('.process-timeline');
  if (processLine) {
    gsap.from(processLine.querySelectorAll('.process-step'), {
      scrollTrigger: { trigger: processLine, start: 'top 75%' },
      y: 30,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      ease: 'power2.out'
    });
  }

  // Image reveal
  document.querySelectorAll('.img-reveal').forEach((img) => {
    ScrollTrigger.create({
      trigger: img,
      start: 'top 80%',
      onEnter: () => img.classList.add('revealed')
    });
  });

  // Parallax floating shapes
  gsap.utils.toArray('.blob').forEach((blob, i) => {
    gsap.to(blob, {
      y: (i % 2 === 0 ? 60 : -60),
      x: (i % 2 === 0 ? -30 : 30),
      scrollTrigger: {
        trigger: blob.parentElement,
        scrub: 1.5
      }
    });
  });
}

/* ---------- Swiper Sliders ---------- */
function initSwipers() {
  if (typeof Swiper === 'undefined') return;

  if (document.querySelector('.testimonials-swiper')) {
    new Swiper('.testimonials-swiper', {
      slidesPerView: 1,
      spaceBetween: 24,
      loop: true,
      autoplay: { delay: 4500, disableOnInteraction: false },
      pagination: { el: '.testimonials-pagination', clickable: true },
      breakpoints: {
        768: { slidesPerView: 2 },
        1100: { slidesPerView: 3 }
      }
    });
  }

  if (document.querySelector('.clients-swiper')) {
    new Swiper('.clients-swiper', {
      slidesPerView: 2,
      spaceBetween: 30,
      loop: true,
      autoplay: { delay: 2500, disableOnInteraction: false },
      breakpoints: {
        576: { slidesPerView: 3 },
        768: { slidesPerView: 4 },
        992: { slidesPerView: 5 }
      }
    });
  }
}

/* ---------- Mouse Parallax (Hero) ---------- */
function initParallax() {
  const hero = document.querySelector('.hero-section');
  const plant = document.querySelector('.hero-plant');
  if (!hero || !plant || window.matchMedia('(pointer: coarse)').matches) return;

  hero.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 20;
    const y = (e.clientY / window.innerHeight - 0.5) * 20;
    plant.style.transform = `translate(${x}px, ${y}px)`;
  });

  // Hero bg parallax on scroll
  const heroBg = document.querySelector('.hero-bg');
  if (heroBg) {
    window.addEventListener(
      'scroll',
      () => {
        const scrolled = window.scrollY;
        if (scrolled < window.innerHeight) {
          heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.35}px)`;
        }
      },
      { passive: true }
    );
  }
}

/* ---------- Toast Helper ---------- */
function showToast(message) {
  let toast = document.querySelector('.eup-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'eup-toast';
    toast.style.cssText =
      'position:fixed;bottom:100px;left:50%;transform:translateX(-50%) translateY(20px);background:#0F172A;color:#fff;padding:14px 28px;border-radius:10px;font-size:0.9rem;z-index:9999;opacity:0;transition:0.4s;box-shadow:0 8px 30px rgba(0,0,0,0.2);';
    document.body.appendChild(toast);
  }
  toast.textContent = message;
  requestAnimationFrame(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(-50%) translateY(0)';
  });
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(-50%) translateY(20px)';
  }, 3000);
}

/* ---------- Form Handlers ---------- */
document.querySelectorAll('.contact-form, .quote-form, .newsletter-form').forEach((form) => {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Thank you! We will get back to you shortly.');
    form.reset();
  });
});
