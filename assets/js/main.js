/**
 * HMT Aqua - Premium Vanilla JS Engine
 * Mobile-first • 60fps animations • Conversion & trust features
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // ── 0. Check prefers-reduced-motion ──
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Lucide Icons Initialization ──
  function refreshIcons() {
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
      lucide.createIcons();
    }
  }
  refreshIcons();

  // ── 2. Scroll Progress Bar ──
  const progressBar = document.getElementById('scroll-progress');
  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollCurrent = window.scrollY;
      const percentage = scrollTotal > 0 ? (scrollCurrent / scrollTotal) * 100 : 0;
      progressBar.style.width = percentage + '%';
    }, { passive: true });
  }

  // ── 3. Slim Sticky Header State ──
  const header = document.getElementById('main-header');
  if (header) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ── 4. Mobile Menu Drawer ──
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const closeMenuBtn = document.getElementById('mobile-menu-close');
  const mobileMenu = document.getElementById('mobile-menu');
  const menuOverlay = document.getElementById('mobile-menu-overlay');
  const mobileLinks = document.querySelectorAll('.mobile-menu-link');

  function openMobileMenu() {
    if (!mobileMenu || !menuOverlay) return;
    mobileMenu.classList.add('open');
    menuOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    hamburgerBtn?.setAttribute('aria-expanded', 'true');
  }

  function closeMobileMenu() {
    if (!mobileMenu || !menuOverlay) return;
    mobileMenu.classList.remove('open');
    menuOverlay.classList.remove('open');
    document.body.style.overflow = '';
    hamburgerBtn?.setAttribute('aria-expanded', 'false');
  }

  if (hamburgerBtn) hamburgerBtn.addEventListener('click', openMobileMenu);
  if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMobileMenu);
  if (menuOverlay) menuOverlay.addEventListener('click', closeMobileMenu);

  mobileLinks.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    }
  });

  // ── 5. Trust Stats Count-Up Animation ──
  const statNumbers = document.querySelectorAll('.stat-number[data-count]');
  if (statNumbers.length > 0) {
    function animateCount(el, target, suffix, duration = 1600) {
      if (prefersReducedMotion) {
        el.textContent = target.toLocaleString() + suffix;
        return;
      }
      const startTime = performance.now();
      function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out quart
        const ease = 1 - Math.pow(1 - progress, 4);
        const currentVal = Math.round(ease * target);
        el.textContent = currentVal.toLocaleString() + suffix;
        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          el.textContent = target.toLocaleString() + suffix;
        }
      }
      requestAnimationFrame(update);
    }

    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-count'), 10);
          const suffix = el.getAttribute('data-suffix') || '';
          animateCount(el, target, suffix);
          statsObserver.unobserve(el);
        }
      });
    }, { threshold: 0.4 });

    statNumbers.forEach(item => statsObserver.observe(item));
  }

  // ── 6. Ripple Effect for Buttons ──
  const rippleTargets = document.querySelectorAll('.btn, .sticky-action-item');
  rippleTargets.forEach(btn => {
    btn.addEventListener('pointerdown', function (e) {
      const rect = this.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      if (this.classList.contains('btn-call') || this.classList.contains('sticky-action-item')) {
        circle.classList.add('dark');
      }

      const existingRipple = this.querySelector('.ripple');
      if (existingRipple) {
        existingRipple.remove();
      }

      this.appendChild(circle);
      setTimeout(() => circle.remove(), 600);
    });
  });

  // ── 7. Carousel Dots Synchronization (Services & Reviews) ──
  function setupCarousel(trackId, dotsContainerId) {
    const track = document.getElementById(trackId);
    const dotsContainer = document.getElementById(dotsContainerId);
    if (!track || !dotsContainer) return;

    const cards = track.children;
    if (cards.length === 0) return;

    dotsContainer.innerHTML = '';
    Array.from(cards).forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
      dot.addEventListener('click', () => {
        cards[idx].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      });
      dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.carousel-dot');

    function onScrollTrack() {
      const cardWidth = cards[0].offsetWidth + 16;
      const scrollIndex = Math.round(track.scrollLeft / cardWidth);
      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === scrollIndex);
      });
    }

    track.addEventListener('scroll', onScrollTrack, { passive: true });
  }

  setupCarousel('services-track', 'services-dots');
  setupCarousel('reviews-track', 'reviews-dots');

  // ── 8. Scroll Reveal (IntersectionObserver) ──
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (revealElements.length > 0) {
    if (prefersReducedMotion) {
      revealElements.forEach(el => el.classList.add('visible'));
    } else {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

      revealElements.forEach(el => revealObserver.observe(el));
    }
  }

  // ── 9. Inline Booking Form with Floating Labels & Live Validation ──
  const bookingForm = document.getElementById('inline-booking-form');
  const bookingFormWrap = document.getElementById('booking-form-wrap');
  const bookingSuccessBox = document.getElementById('booking-success-box');
  const bookingResetBtn = document.getElementById('booking-reset-btn');

  if (bookingForm) {
    const nameInput = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const brandInput = document.getElementById('form-brand');
    const issueInput = document.getElementById('form-issue');
    const timeInput = document.getElementById('form-time');

    function validateField(input, errorId, condition, msg) {
      const errEl = document.getElementById(errorId);
      if (!condition) {
        input.classList.add('is-invalid');
        if (errEl) {
          errEl.textContent = msg;
          errEl.classList.add('visible');
        }
        return false;
      } else {
        input.classList.remove('is-invalid');
        if (errEl) {
          errEl.classList.remove('visible');
        }
        return true;
      }
    }

    // Live validation on blur & input
    nameInput?.addEventListener('input', () => {
      validateField(nameInput, 'err-name', nameInput.value.trim().length >= 2, 'Please enter your full name');
    });

    phoneInput?.addEventListener('input', () => {
      const phoneVal = phoneInput.value.trim();
      validateField(phoneInput, 'err-phone', /^[6-9]\d{9}$/.test(phoneVal), 'Enter a valid 10-digit mobile number');
    });

    brandInput?.addEventListener('change', () => {
      validateField(brandInput, 'err-brand', brandInput.value !== '', 'Please select your purifier brand');
    });

    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const isNameValid = validateField(nameInput, 'err-name', nameInput.value.trim().length >= 2, 'Please enter your full name');
      const isPhoneValid = validateField(phoneInput, 'err-phone', /^[6-9]\d{9}$/.test(phoneInput.value.trim()), 'Enter a valid 10-digit mobile number');
      const isBrandValid = validateField(brandInput, 'err-brand', brandInput.value !== '', 'Please select your purifier brand');

      if (!isNameValid || !isPhoneValid || !isBrandValid) {
        return;
      }

      const clientName = nameInput.value.trim();
      const clientPhone = phoneInput.value.trim();
      const clientBrand = brandInput.value;
      const clientIssue = issueInput.value || 'General RO Service';
      const clientTime = timeInput.value || 'Earliest Available (30-60 min)';

      // Prefilled WhatsApp message
      const whatsappMsg = `Hi, I need RO service for my ${clientBrand}.\n` +
        `• Name: ${clientName}\n` +
        `• Phone: ${clientPhone}\n` +
        `• Issue: ${clientIssue}\n` +
        `• Preferred Time: ${clientTime}\n` +
        `• Location: Visakhapatnam`;

      const encodedMsg = encodeURIComponent(whatsappMsg);
      const whatsappURL = `https://wa.me/919845331753?text=${encodedMsg}`;

      // Open WhatsApp in new tab
      window.open(whatsappURL, '_blank', 'noopener,noreferrer');

      // Trigger success animation
      if (bookingFormWrap && bookingSuccessBox) {
        bookingFormWrap.style.display = 'none';
        bookingSuccessBox.classList.add('show');
        refreshIcons();
      }
    });

    if (bookingResetBtn) {
      bookingResetBtn.addEventListener('click', () => {
        bookingForm.reset();
        if (bookingFormWrap && bookingSuccessBox) {
          bookingSuccessBox.classList.remove('show');
          bookingFormWrap.style.display = 'block';
        }
      });
    }
  }

  // ── 10. FAQ Accordion ──
  const faqButtons = document.querySelectorAll('.faq-question-btn');
  faqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const panel = item?.querySelector('.faq-answer-panel');
      const isOpen = item?.classList.contains('open');

      // Close all other panels
      document.querySelectorAll('.faq-item.open').forEach(openItem => {
        openItem.classList.remove('open');
        openItem.querySelector('.faq-answer-panel')?.classList.remove('open');
        openItem.querySelector('.faq-question-btn')?.setAttribute('aria-expanded', 'false');
      });

      // Toggle current panel
      if (!isOpen && item && panel) {
        item.classList.add('open');
        panel.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // ── 11. SEO Collapsible ("Read More") ──
  const seoToggleBtn = document.getElementById('seo-read-more-btn');
  const seoBody = document.getElementById('seo-collapsible-content');
  if (seoToggleBtn && seoBody) {
    seoToggleBtn.addEventListener('click', () => {
      const isExpanded = seoToggleBtn.getAttribute('aria-expanded') === 'true';
      seoToggleBtn.setAttribute('aria-expanded', !isExpanded);
      seoBody.classList.toggle('open');
      const labelSpan = seoToggleBtn.querySelector('span');
      if (labelSpan) {
        labelSpan.textContent = !isExpanded
          ? 'Show less about our Visakhapatnam services'
          : 'Read more about our services in Visakhapatnam';
      }
    });
  }

  // ── 12. Lazy Load Google Maps Iframe ──
  const mapPlaceholder = document.getElementById('map-placeholder-trigger');
  const mapIframeHolder = document.getElementById('map-iframe-wrapper');
  const contactSection = document.getElementById('contact');

  function loadGoogleMap() {
    if (!mapIframeHolder || mapIframeHolder.classList.contains('loaded')) return;
    mapIframeHolder.classList.add('loaded');
    if (mapPlaceholder) mapPlaceholder.style.display = 'none';

    const iframe = mapIframeHolder.querySelector('iframe[data-src]');
    if (iframe) {
      iframe.src = iframe.getAttribute('data-src');
      iframe.removeAttribute('data-src');
    }
  }

  if (mapPlaceholder) {
    mapPlaceholder.addEventListener('click', loadGoogleMap);
  }

  if (contactSection) {
    const mapObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(loadGoogleMap, 1000);
        mapObserver.disconnect();
      }
    }, { threshold: 0.1 });
    mapObserver.observe(contactSection);
  }

  // ── 13. Mobile Footer Collapsible Accordion ──
  const footerAccordionButtons = document.querySelectorAll('.footer-col-title');
  footerAccordionButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      if (window.innerWidth <= 767) {
        const parentCol = btn.closest('.footer-collapsible-col');
        if (parentCol) {
          parentCol.classList.toggle('open');
        }
      }
    });
  });

  // ── 14. Smooth Hash Scrolling with Sticky Header Compensation ──
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const hash = this.getAttribute('href');
      if (!hash || hash === '#') return;
      const targetElement = document.querySelector(hash);
      if (targetElement) {
        e.preventDefault();
        const headerOffset = 76;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerOffset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
});
