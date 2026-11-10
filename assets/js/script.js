/**
 * HMT Aqua - Premium Vanilla JS Engine
 * Mobile-first · 60fps animations · Conversion & trust features
 * Respects prefers-reduced-motion
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  /* ── 0. Reduced-motion flag ── */
  const PRM = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ── 1. Lucide icons ── */
  function refreshIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
  refreshIcons();

  /* ── 2. Scroll progress bar ── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ── 3. Sticky header shadow ── */
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── 4. Mobile menu drawer ── */
  const hamburgerBtn  = document.getElementById('hamburger-btn');
  const closeMenuBtn  = document.getElementById('mobile-menu-close');
  const mobileMenu    = document.getElementById('mobile-menu');
  const menuOverlay   = document.getElementById('mobile-menu-overlay');
  const mobileLinks   = document.querySelectorAll('.mobile-menu-link');

  function openMenu() {
    if (!mobileMenu || !menuOverlay) return;
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!mobileMenu || !menuOverlay) return;
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
  }

  hamburgerBtn?.addEventListener('click', openMenu);
  closeMenuBtn?.addEventListener('click', closeMenu);
  menuOverlay?.addEventListener('click', closeMenu);
  mobileLinks.forEach(l => l.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu?.classList.contains('open')) closeMenu();
  });

  /* ── 5. Count-up animation ── */
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (statNumbers.length) {
    function animateCount(el, target, suffix, duration = 1600) {
      if (PRM) { el.textContent = target.toLocaleString() + suffix; return; }
      const start = performance.now();
      (function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        el.textContent = Math.round(ease * target).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = target.toLocaleString() + suffix;
      })(start);
    }

    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          animateCount(el, parseInt(el.dataset.count, 10), el.dataset.suffix || '');
          statsObs.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(el => statsObs.observe(el));
  }

  /* ── 6. Ripple effect ── */
  document.querySelectorAll('.btn, .sticky-action-item').forEach(btn => {
    btn.addEventListener('pointerdown', function(e) {
      const rect = this.getBoundingClientRect();
      const d = Math.max(rect.width, rect.height);
      const r = d / 2;
      const span = document.createElement('span');
      span.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - r}px;top:${e.clientY - rect.top - r}px`;
      span.className = 'ripple' + (this.classList.contains('btn-call') || this.classList.contains('sticky-action-item') ? ' dark' : '');
      this.querySelector('.ripple')?.remove();
      this.appendChild(span);
      setTimeout(() => span.remove(), 600);
    });
  });

  /* ── 7. Swipe carousel dots ── */
  function setupCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track || !dotsWrap) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;

    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.carousel-dot');
    track.addEventListener('scroll', () => {
      const w = cards[0].offsetWidth + parseInt(getComputedStyle(track).gap || 16);
      const idx = Math.round(track.scrollLeft / w);
      dots.forEach((d, i) => d.classList.toggle('active', i === idx));
    }, { passive: true });
  }

  setupCarousel('services-track', 'services-dots');
  setupCarousel('reviews-track', 'reviews-dots');

  /* ── 8. Scroll reveal ── */
  const revealEls = document.querySelectorAll('.reveal-on-scroll');
  if (revealEls.length) {
    if (PRM) {
      revealEls.forEach(el => el.classList.add('visible'));
    } else {
      const obs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      revealEls.forEach(el => obs.observe(el));
    }
  }

  /* ── 9. Inline booking form → WhatsApp ── */
  const bookingForm    = document.getElementById('inline-booking-form');
  const formWrap       = document.getElementById('booking-form-wrap');
  const successBox     = document.getElementById('booking-success-box');
  const resetBtn       = document.getElementById('booking-reset-btn');

  if (bookingForm) {
    const nameInput  = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const brandInput = document.getElementById('form-brand');
    const issueInput = document.getElementById('form-issue');
    const timeInput  = document.getElementById('form-time');

    function validateField(input, errorId, ok, msg) {
      const errEl = document.getElementById(errorId);
      input.classList.toggle('is-invalid', !ok);
      if (errEl) {
        errEl.textContent = msg;
        errEl.classList.toggle('visible', !ok);
      }
      return ok;
    }

    nameInput?.addEventListener('input',  () => validateField(nameInput,  'err-name',  nameInput.value.trim().length >= 2,       'Please enter your full name'));
    phoneInput?.addEventListener('input', () => validateField(phoneInput, 'err-phone', /^[6-9]\d{9}$/.test(phoneInput.value.trim()), 'Enter a valid 10-digit number'));
    brandInput?.addEventListener('change',() => validateField(brandInput, 'err-brand', brandInput.value !== '',                  'Please select your purifier brand'));

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();
      const v1 = validateField(nameInput,  'err-name',  nameInput.value.trim().length >= 2,         'Please enter your full name');
      const v2 = validateField(phoneInput, 'err-phone', /^[6-9]\d{9}$/.test(phoneInput.value.trim()),'Enter a valid 10-digit number');
      const v3 = validateField(brandInput, 'err-brand', brandInput.value !== '',                    'Please select your purifier brand');
      if (!v1 || !v2 || !v3) return;

      const msg = encodeURIComponent(
        `Hi, I need RO service for my ${brandInput.value}.\n` +
        `• Name: ${nameInput.value.trim()}\n` +
        `• Phone: ${phoneInput.value.trim()}\n` +
        `• Issue: ${issueInput?.value || 'General RO Service'}\n` +
        `• Preferred Time: ${timeInput?.value || 'As Soon as Possible (30-60 min)'}\n` +
        `• Location: Visakhapatnam`
      );

      window.open(`https://wa.me/919845331753?text=${msg}`, '_blank', 'noopener,noreferrer');

      if (formWrap && successBox) {
        formWrap.style.display = 'none';
        successBox.classList.add('show');
        refreshIcons();
      }
    });

    resetBtn?.addEventListener('click', () => {
      bookingForm.reset();
      if (formWrap && successBox) {
        successBox.classList.remove('show');
        formWrap.style.display = 'block';
      }
    });
  }

  /* ── 10. FAQ accordion ── */
  document.querySelectorAll('.faq-question-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item  = btn.closest('.faq-item');
      const panel = item?.querySelector('.faq-answer-panel');
      const isOpen = item?.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
        open.querySelector('.faq-answer-panel')?.classList.remove('open');
        open.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
      });

      if (!isOpen && item && panel) {
        item.classList.add('open');
        panel.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  /* ── 11. SEO collapsible "Read more" ── */
  const seoBtn  = document.getElementById('seo-read-more-btn');
  const seoBody = document.getElementById('seo-collapsible-content');
  if (seoBtn && seoBody) {
    seoBtn.addEventListener('click', () => {
      const expanded = seoBtn.getAttribute('aria-expanded') === 'true';
      seoBtn.setAttribute('aria-expanded', String(!expanded));
      seoBody.classList.toggle('open', !expanded);
      const span = seoBtn.querySelector('span');
      if (span) span.textContent = expanded ? 'Read more about our services in Visakhapatnam' : 'Show less';
    });
  }

  /* ── 12. Lazy-load Google Maps ── */
  const mapPlaceholder = document.getElementById('map-placeholder-trigger');
  const mapIframeWrap  = document.getElementById('map-iframe-wrapper');
  const contactSection = document.getElementById('contact');

  function loadMap() {
    if (!mapIframeWrap || mapIframeWrap.classList.contains('loaded')) return;
    mapIframeWrap.classList.add('loaded');
    mapPlaceholder && (mapPlaceholder.style.display = 'none');
    const iframe = mapIframeWrap.querySelector('iframe[data-src]');
    if (iframe) { iframe.src = iframe.getAttribute('data-src'); iframe.removeAttribute('data-src'); }
  }

  mapPlaceholder?.addEventListener('click', loadMap);
  mapPlaceholder?.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') loadMap(); });

  if (contactSection) {
    const mapObs = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { setTimeout(loadMap, 1000); mapObs.disconnect(); }
    }, { threshold: 0.1 });
    mapObs.observe(contactSection);
  }

  /* ── 13. Footer mobile accordion ── */
  document.querySelectorAll('.footer-col-title').forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 767) {
        btn.closest('.footer-collapsible-col')?.classList.toggle('open');
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
      }
    });
  });

  /* ── 14. Smooth scroll with header offset ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = (header?.offsetHeight || 70) + 8;
        window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' });
        closeMenu();
      }
    });
  });

  /* ── 15. Brand marquee: pause on touch/hover (CSS handles hover, JS handles touch) ── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('touchstart', () => marqueeTrack.style.animationPlayState = 'paused', { passive: true });
    marqueeTrack.addEventListener('touchend',   () => marqueeTrack.style.animationPlayState = 'running');
  }
});

