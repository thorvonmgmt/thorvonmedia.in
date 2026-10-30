/**
 * THORVON MEDIA — Premium Short-Form Distribution House
 * Core Interaction & UI Scripts
 */

(function () {
  'use strict';

  // DOM Elements
  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const bookingModal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('modalClose');
  const faqItems = document.querySelectorAll('.faq-item');
  const revealElements = document.querySelectorAll('.reveal');

  /* --------------------------------------------------------------------------
     1. Mobile Drawer Navigation
     -------------------------------------------------------------------------- */
  function toggleMobileDrawer(forceState) {
    if (!mobileDrawer || !mobileToggle) return;
    const isOpen = typeof forceState === 'boolean' 
      ? forceState 
      : !mobileDrawer.classList.contains('open');

    mobileToggle.classList.toggle('active', isOpen);
    mobileDrawer.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

    // Prevent body scrolling when mobile drawer is open
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => toggleMobileDrawer());
  }

  // Close mobile drawer when clicking internal links
  const mobileLinks = document.querySelectorAll('.mobile-nav-item');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleMobileDrawer(false);
    });
  });

  /* --------------------------------------------------------------------------
     2. Header Elevation on Scroll
     -------------------------------------------------------------------------- */
  function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 20) {
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.94)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.12)';
    } else {
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
      header.style.borderBottomColor = 'rgba(255, 255, 255, 0.08)';
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });

  /* --------------------------------------------------------------------------
     3. FAQ Accordion Interaction
     -------------------------------------------------------------------------- */
  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const answer = item.querySelector('.faq-answer');

    if (!trigger || !answer) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close all other accordions for luxury editorial restraint
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
          if (otherAnswer) otherAnswer.hidden = true;
        }
      });

      // Toggle current item
      if (isExpanded) {
        item.classList.remove('active');
        trigger.setAttribute('aria-expanded', 'false');
        answer.hidden = true;
      } else {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        answer.hidden = false;
      }
    });
  });

  /* --------------------------------------------------------------------------
     4. Booking Modal Controls
     -------------------------------------------------------------------------- */
  function openBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.add('open');
    bookingModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Auto-focus first input
    const firstInput = bookingModal.querySelector('input');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }

  function closeBookingModal() {
    if (!bookingModal) return;
    bookingModal.classList.remove('open');
    bookingModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-action="open-booking"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      // Close mobile drawer if open
      toggleMobileDrawer(false);
      openBookingModal();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeBookingModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeBookingModal();
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (bookingModal && bookingModal.classList.contains('open')) {
        closeBookingModal();
      }
      if (mobileDrawer && mobileDrawer.classList.contains('open')) {
        toggleMobileDrawer(false);
      }
    }
  });

  /* --------------------------------------------------------------------------
     5. Scroll Reveal Animations (IntersectionObserver)
     -------------------------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback if IntersectionObserver not supported
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* --------------------------------------------------------------------------
     6. Form Handlers & Dispatch to zonack@thorvonmedia.in
     -------------------------------------------------------------------------- */
  window.ThorvonApp = {
    openBooking: openBookingModal,
    closeBooking: closeBookingModal,

    handleBookingSubmit: function (form) {
      const name = form.name ? form.name.value.trim() : '';
      const email = form.email ? form.email.value.trim() : '';
      const link = form.link ? form.link.value.trim() : '';
      const volume = form.volume ? form.volume.value : '';

      const subject = encodeURIComponent(`Thorvon Media — Call Request: ${name}`);
      const body = encodeURIComponent(
        `Hello Thorvon Team,\n\nI would like to schedule a call to discuss dedicated short-form distribution.\n\n` +
        `• Name: ${name}\n` +
        `• Work Email: ${email}\n` +
        `• Content/Channel Link: ${link}\n` +
        `• Monthly Content Volume: ${volume}\n\n` +
        `Looking forward to connecting.`
      );

      // Trigger user's mail client targeted at zonack@thorvonmedia.in
      window.location.href = `mailto:zonack@thorvonmedia.in?subject=${subject}&body=${body}`;

      // User feedback
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Redirecting to email...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        closeBookingModal();
        form.reset();
        if (submitBtn) {
          submitBtn.textContent = 'Submit & Schedule →';
          submitBtn.disabled = false;
        }
      }, 1500);
    },

    handleContactSubmit: function (form) {
      const name = form.name ? form.name.value.trim() : '';
      const email = form.email ? form.email.value.trim() : '';
      const channel = form.channel ? form.channel.value.trim() : '';
      const type = form.type ? form.type.value : '';
      const message = form.message ? form.message.value.trim() : '';

      const subject = encodeURIComponent(`Thorvon Media — Direct Inquiry from ${name} (${type})`);
      const body = encodeURIComponent(
        `Hello Thorvon Team,\n\n` +
        `• Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Category: ${type}\n` +
        `• Channel / Podcast Link: ${channel}\n\n` +
        `Notes on content & goals:\n${message}\n\n` +
        `Thank you.`
      );

      // Trigger user's mail client targeted at zonack@thorvonmedia.in
      window.location.href = `mailto:zonack@thorvonmedia.in?subject=${subject}&body=${body}`;

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.textContent = 'Opening email client...';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        form.reset();
        if (submitBtn) {
          submitBtn.textContent = 'Send Inquiry →';
          submitBtn.disabled = false;
        }
      }, 2000);
    }
  };

})();
