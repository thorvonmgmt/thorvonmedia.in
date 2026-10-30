/**
 * THORVON MEDIA — Ultra-Minimal Interactions
 */

(function () {
  'use strict';

  const header = document.getElementById('header');
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const contactModal = document.getElementById('contactModal');
  const modalClose = document.getElementById('modalClose');

  /* 1. Mobile Drawer */
  function setDrawer(isOpen) {
    if (!mobileDrawer || !mobileToggle) return;
    mobileToggle.classList.toggle('active', isOpen);
    mobileDrawer.classList.toggle('open', isOpen);
    mobileToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    mobileDrawer.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (mobileToggle) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.contains('open');
      setDrawer(!isOpen);
    });
  }

  document.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => setDrawer(false));
  });

  /* 2. Header Scroll Effect */
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 24) {
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.95)';
    } else {
      header.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* 3. Modal Dialog (Let's Talk) */
  function openModal() {
    if (!contactModal) return;
    setDrawer(false);
    contactModal.classList.add('open');
    contactModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const input = contactModal.querySelector('input');
    if (input) setTimeout(() => input.focus(), 100);
  }

  function closeModal() {
    if (!contactModal) return;
    contactModal.classList.remove('open');
    contactModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-action="open-modal"]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (contactModal && contactModal.classList.contains('open')) closeModal();
      if (mobileDrawer && mobileDrawer.classList.contains('open')) setDrawer(false);
    }
  });

  /* 4. Form Submission */
  window.ThorvonApp = {
    openModal: openModal,
    closeModal: closeModal,

    submitForm: function (form) {
      const name = form.name ? form.name.value.trim() : '';
      const email = form.email ? form.email.value.trim() : '';
      const link = form.link ? form.link.value.trim() : '';

      const subject = encodeURIComponent(`Thorvon Media — Let's talk (${name})`);
      const body = encodeURIComponent(
        `Hi Thorvon,\n\nI'd like to talk about distribution for my content.\n\n` +
        `• Name: ${name}\n` +
        `• Email: ${email}\n` +
        `• Content Link: ${link}\n\n` +
        `Talk soon.`
      );

      window.location.href = `mailto:zonack@thorvonmedia.in?subject=${subject}&body=${body}`;

      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        btn.textContent = 'Redirecting...';
        btn.disabled = true;
      }

      setTimeout(() => {
        closeModal();
        form.reset();
        if (btn) {
          btn.textContent = "Let's talk →";
          btn.disabled = false;
        }
      }, 1500);
    }
  };

})();
