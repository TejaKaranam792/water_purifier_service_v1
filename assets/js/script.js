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

  /* ── 2. Dynamic footer year ── */
  const yearEl = document.getElementById('footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ── 3. Scroll progress bar ── */
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const total = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      progressBar.style.width = total > 0 ? (window.scrollY / total * 100) + '%' : '0%';
    }, { passive: true });
  }

  /* ── 4. Sticky header shadow ── */
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 30);
    }, { passive: true });
  }

  /* ── 5. Mobile menu drawer ── */
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('mobile-menu-close');
  const mobileMenu   = document.getElementById('mobile-menu');
  const menuOverlay  = document.getElementById('mobile-menu-overlay');
  const mobileLinks  = document.querySelectorAll('.mobile-nav-link, [data-close-menu]');

  function openMenu() {
    if (!mobileMenu || !menuOverlay) return;
    mobileMenu.classList.add('open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    if (!mobileMenu || !menuOverlay) return;
    mobileMenu.classList.remove('open');
    mobileMenu.setAttribute('aria-hidden', 'true');
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

  /* ── 6. Count-up animation for stats ── */
  const statNumbers = document.querySelectorAll('.stat-number[data-target], .stat-number[data-count]');
  if (statNumbers.length) {
    function animateCount(el, target, suffix, duration = 1600) {
      const isFloat = String(target).includes('.');
      if (PRM) {
        el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
        return;
      }
      el.textContent = (isFloat ? '0.0' : '0') + suffix;
      const start = performance.now();
      (function update(now) {
        const p = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - p, 4);
        if (isFloat) {
          const current = (ease * target).toFixed(1);
          el.textContent = current + suffix;
        } else {
          const current = Math.round(ease * target);
          el.textContent = current.toLocaleString() + suffix;
        }
        if (p < 1) requestAnimationFrame(update);
        else el.textContent = (isFloat ? target.toFixed(1) : target.toLocaleString()) + suffix;
      })(start);
    }

    const statsObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const raw = el.dataset.target || el.dataset.count || '';
          const target = raw.includes('.') ? parseFloat(raw) : parseInt(raw, 10);
          if (!isNaN(target)) {
            animateCount(el, target, el.dataset.suffix || '');
          }
          statsObs.unobserve(el);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => statsObs.observe(el));
  }

  /* ── 7. Touch & click ripple effect ── */
  document.querySelectorAll('.btn, .sticky-btn').forEach(btn => {
    btn.addEventListener('pointerdown', function(e) {
      const rect = this.getBoundingClientRect();
      const d = Math.max(rect.width, rect.height);
      const r = d / 2;
      const span = document.createElement('span');
      span.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - r}px;top:${e.clientY - rect.top - r}px`;
      span.className = 'ripple';
      this.querySelector('.ripple')?.remove();
      this.appendChild(span);
      setTimeout(() => span.remove(), 600);
    });
  });

  /* ── 8. Swipe carousels with sync dots (Services & Reviews) ── */
  function setupCarousel(trackId, dotsId) {
    const track = document.getElementById(trackId);
    const dotsWrap = document.getElementById(dotsId);
    if (!track || !dotsWrap) return;
    const cards = Array.from(track.children);
    if (!cards.length) return;

    dotsWrap.innerHTML = '';
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'dot' + (i === 0 ? ' dot-active' : '');
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
      dot.addEventListener('click', () => {
        cards[i].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsWrap.appendChild(dot);
    });

    const dots = dotsWrap.querySelectorAll('.dot');
    track.addEventListener('scroll', () => {
      const firstCard = cards[0];
      const w = firstCard ? firstCard.offsetWidth + 16 : 280;
      const idx = Math.min(cards.length - 1, Math.max(0, Math.round(track.scrollLeft / w)));
      dots.forEach((d, i) => {
        const active = i === idx;
        d.classList.toggle('dot-active', active);
        d.setAttribute('aria-selected', active ? 'true' : 'false');
      });
    }, { passive: true });
  }

  setupCarousel('services-carousel', 'services-dots');
  setupCarousel('reviews-carousel', 'reviews-dots');

  /* ── 9. Scroll reveal animations ── */
  const revealEls = document.querySelectorAll('.service-card, .why-tile, .step-box, .review-card, .faq-item');
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
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
      revealEls.forEach(el => obs.observe(el));
    }
  }

  /* ── 10. Booking form → Prefilled WhatsApp ── */
  const bookingForm = document.getElementById('booking-form');
  const formWrap    = document.getElementById('booking-form-wrap');
  const successBox  = document.getElementById('booking-success');
  const resetBtn    = document.getElementById('booking-reset');

  if (bookingForm) {
    const nameInput  = document.getElementById('f-name');
    const phoneInput = document.getElementById('f-phone');
    const brandInput = document.getElementById('f-brand');
    const issueInput = document.getElementById('f-issue');
    const timeInput  = document.getElementById('f-time');

    bookingForm.addEventListener('submit', e => {
      e.preventDefault();

      const nameVal  = nameInput ? nameInput.value.trim() : '';
      const phoneVal = phoneInput ? phoneInput.value.trim() : '';
      const brandVal = brandInput && brandInput.value ? brandInput.value : 'Water Purifier';
      const issueVal = issueInput && issueInput.value ? issueInput.value : 'General Service';
      const timeVal  = timeInput && timeInput.value ? timeInput.value : 'As soon as possible (30-60 min)';

      if (!nameVal || nameVal.length < 2) {
        nameInput?.focus();
        nameInput?.classList.add('input-error');
        return;
      }
      nameInput?.classList.remove('input-error');

      if (!phoneVal || !/^[6-9]\d{9}$/.test(phoneVal)) {
        phoneInput?.focus();
        phoneInput?.classList.add('input-error');
        return;
      }
      phoneInput?.classList.remove('input-error');

      const whatsappText =
        `Hi HMT Aqua, I want to book RO service.\n\n` +
        `• Name: ${nameVal}\n` +
        `• Mobile: ${phoneVal}\n` +
        `• Brand: ${brandVal}\n` +
        `• Issue: ${issueVal}\n` +
        `• Preferred Time: ${timeVal}\n` +
        `• City: Visakhapatnam`;

      const whatsappUrl = `https://wa.me/919180106453?text=${encodeURIComponent(whatsappText)}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');

      if (formWrap && successBox) {
        formWrap.hidden = true;
        successBox.hidden = false;
        refreshIcons();
      }
    });

    resetBtn?.addEventListener('click', e => {
      e.preventDefault();
      bookingForm.reset();
      if (formWrap && successBox) {
        successBox.hidden = true;
        formWrap.hidden = false;
      }
    });
  }

  /* ── 11. FAQ accordion ── */
  const faqButtons = document.querySelectorAll('.faq-question');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item?.querySelector('.faq-answer');
      const isExpanded = btn.getAttribute('aria-expanded') === 'true';

      // Close all others
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) {
          other.classList.remove('faq-open');
          const otherBtn = other.querySelector('.faq-question');
          const otherAns = other.querySelector('.faq-answer');
          otherBtn?.setAttribute('aria-expanded', 'false');
          if (otherAns) otherAns.hidden = true;
        }
      });

      // Toggle current
      if (isExpanded) {
        btn.setAttribute('aria-expanded', 'false');
        item?.classList.remove('faq-open');
        if (answer) answer.hidden = true;
      } else {
        btn.setAttribute('aria-expanded', 'true');
        item?.classList.add('faq-open');
        if (answer) answer.hidden = false;
      }
    });
  });

  /* ── 12. SEO Collapsible "Read more" ── */
  const seoToggle = document.getElementById('seo-toggle');
  const seoContent = document.getElementById('seo-content');
  if (seoToggle && seoContent) {
    seoToggle.addEventListener('click', () => {
      const expanded = seoToggle.getAttribute('aria-expanded') === 'true';
      seoToggle.setAttribute('aria-expanded', String(!expanded));
      seoContent.hidden = expanded;
      const label = seoToggle.querySelector('span');
      if (label) {
        label.textContent = expanded
          ? 'Read more about our service coverage'
          : 'Show less about our service coverage';
      }
    });
  }

  /* ── 13. Mobile Footer Collapsible Columns ── */
  const footerToggles = document.querySelectorAll('.footer-col-toggle');
  footerToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 768) {
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!expanded));
        const list = btn.nextElementSibling;
        if (list) {
          list.classList.toggle('footer-col-open', !expanded);
        }
      }
    });
  });

  /* ── 14. Smooth scroll with sticky header compensation ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function(e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector(hash);
      if (target) {
        e.preventDefault();
        const offset = (header?.offsetHeight || 70) + 8;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - offset,
          behavior: 'smooth'
        });
        closeMenu();
      }
    });
  });

  /* ── 15. Brand marquee hover/touch pause ── */
  const marqueeTrack = document.querySelector('.marquee-track');
  if (marqueeTrack) {
    marqueeTrack.addEventListener('touchstart', () => marqueeTrack.style.animationPlayState = 'paused', { passive: true });
    marqueeTrack.addEventListener('touchend', () => marqueeTrack.style.animationPlayState = 'running');
  }

  /* ── 16. Before / After Filter Comparison Slider ── */
  const baContainer = document.getElementById('ba-comparison-slider');
  const baBeforeLayer = document.getElementById('ba-before-layer');
  const baHandle = document.getElementById('ba-handle');

  if (baContainer && baBeforeLayer && baHandle) {
    let isDragging = false;

    function setSliderPos(clientX) {
      const rect = baContainer.getBoundingClientRect();
      const pos = Math.max(0, Math.min(clientX - rect.left, rect.width));
      const pct = Math.max(0, Math.min((pos / rect.width) * 100, 100));
      baBeforeLayer.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      baBeforeLayer.style.webkitClipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      baHandle.style.left = pct + '%';
      baHandle.setAttribute('aria-valuenow', Math.round(pct));
      baHandle.setAttribute('aria-valuetext', `${Math.round(pct)}% before filter comparison`);
    }

    baHandle.addEventListener('pointerdown', e => {
      isDragging = true;
      baHandle.setPointerCapture(e.pointerId);
      e.preventDefault();
    });

    baHandle.addEventListener('pointermove', e => {
      if (!isDragging) return;
      setSliderPos(e.clientX);
    });

    baHandle.addEventListener('pointerup', e => {
      isDragging = false;
      try { baHandle.releasePointerCapture(e.pointerId); } catch (_) {}
    });

    baHandle.addEventListener('pointercancel', () => {
      isDragging = false;
    });

    // Click anywhere on container to move handle
    baContainer.addEventListener('click', e => {
      setSliderPos(e.clientX);
    });

    // Keyboard accessibility
    baHandle.addEventListener('keydown', e => {
      let cur = parseFloat(baHandle.getAttribute('aria-valuenow') || '50');
      if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
        cur = Math.max(0, cur - 5);
        setSliderPct(cur);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
        cur = Math.min(100, cur + 5);
        setSliderPct(cur);
        e.preventDefault();
      } else if (e.key === 'Home') {
        setSliderPct(0);
        e.preventDefault();
      } else if (e.key === 'End') {
        setSliderPct(100);
        e.preventDefault();
      }
    });

    function setSliderPct(pct) {
      baBeforeLayer.style.clipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      baBeforeLayer.style.webkitClipPath = `polygon(0 0, ${pct}% 0, ${pct}% 100%, 0 100%)`;
      baHandle.style.left = pct + '%';
      baHandle.setAttribute('aria-valuenow', Math.round(pct));
      baHandle.setAttribute('aria-valuetext', `${Math.round(pct)}% before filter comparison`);
    }
  }
});
