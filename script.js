/**
 * THORVON MEDIA — SCRIPT
 * Minimalist, high-performance interactions, Apple-style configurator & brand score tool.
 */

// ==========================================================================
// 1. Contact Links Configuration
// ==========================================================================
const ContactConfig = {
  PHONE: '+916000156191',
  PHONE_DISPLAY: '+91 60001 56191',
  PHONE_LINK: 'tel:+916000156191',
  EMAIL: 'thorvonmedia@gmail.com',
  EMAIL_LINK: 'mailto:thorvonmedia@gmail.com',
  LINKEDIN_LINK: 'https://www.linkedin.com/in/drishtanta-baruah/'
};

// ==========================================================================
// 2. Centralized Pricing & Service Configuration
// Edit prices, ranges, or disable services here without modifying UI code.
// Set price or minPrice/maxPrice to numbers (in ₹) when ready.
// If null/0, the system displays "Pricing calculated after consultation".
// ==========================================================================
const PricingConfig = [
  // --- PR Requirements ($ prices) ---
  { id: 'pr_founder', label: 'Founder PR', category: 'pr', price: 450, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_brand', label: 'Brand PR', category: 'pr', price: 550, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_personal', label: 'Personal Branding', category: 'pr', price: 350, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_rep_mgmt', label: 'Reputation Management', category: 'pr', price: 400, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_rep_recov', label: 'Reputation Recovery', category: 'pr', price: 500, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_media_outreach', label: 'Media / Press Outreach', category: 'pr', price: 450, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_strategy', label: 'PR Strategy', category: 'pr', price: 300, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_smo', label: 'Social Media Optimization', category: 'pr', price: 200, minPrice: null, maxPrice: null, enabled: true },

  // --- Content Requirements ($ prices) ---
  { id: 'cnt_scriptwriting', label: 'Scriptwriting', category: 'content', price: 150, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_video_editing', label: 'Video Editing', category: 'content', price: 350, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_short_form', label: 'Short-form Content', category: 'content', price: 300, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_long_form', label: 'Long-form Content', category: 'content', price: 450, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_strategy', label: 'Content Strategy', category: 'content', price: 200, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_social_content', label: 'Social Media Content', category: 'content', price: 250, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_post_prod', label: 'Content Post-Production', category: 'content', price: 300, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_smo', label: 'Social Media Optimization', category: 'content', price: 200, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_motion_graphics', label: 'Motion Graphics', category: 'content', price: 250, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_repurposing', label: 'Content Repurposing', category: 'content', price: 200, minPrice: null, maxPrice: null, enabled: true }
];

// Category metadata
const CATEGORY_NAMES = {
  pr: 'PR',
  content: 'CONTENT'
};

// ==========================================================================
// 3. Modular Lead Submission Handler
// Sends all client submissions directly to thorvonmedia@gmail.com
// ==========================================================================
const LeadSubmissionHandler = {
  // Free access key from https://web3forms.com (takes 10 seconds to generate)
  WEB3FORMS_ACCESS_KEY: '5b5b43c9-47f0-4a4f-8508-36a60a953561',

  submit: async (planData) => {
    console.log('[Thorvon Media Lead Submitted]:', planData);

    if (LeadSubmissionHandler.WEB3FORMS_ACCESS_KEY && LeadSubmissionHandler.WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
      try {
        const contactVal = (planData.contact || '').trim();
        const clientEmail = contactVal.includes('@') ? contactVal : 'thorvonmedia@gmail.com';
        const clientPhone = !contactVal.includes('@') ? contactVal : '';

        const formattedSummary = [
          `NEW THORVON CLIENT PLAN:`,
          `-------------------------------------------`,
          `Client Name: ${planData.name || 'Anonymous Client'}`,
          `Contact: ${contactVal || 'Not provided'}`,
          `Company / Brand: ${planData.company || 'Not specified'}`,
          `Selected Services: ${planData.selectedServices.length > 0 ? planData.selectedServices.join(', ') : 'None selected'}`,
          `Custom Requirements: ${planData.customRequirement || 'None'}`,
          `Estimated Investment: ${planData.estimatedInvestment || 'Pricing calculated after consultation'}`,
          `Additional Notes: ${planData.notes || 'None'}`,
          `Submitted At: ${planData.submittedAt}`
        ].join('\n');

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: LeadSubmissionHandler.WEB3FORMS_ACCESS_KEY,
            from_name: 'Thorvon Media Website',
            name: planData.name || 'Anonymous Client',
            email: clientEmail,
            phone: clientPhone,
            subject: `New Thorvon Plan: ${planData.name || 'Anonymous'} (${planData.company || 'Direct Client'})`,
            company: planData.company || 'Not specified',
            selected_services: planData.selectedServices.join(', '),
            custom_requirements: planData.customRequirement || 'None',
            estimated_investment: planData.estimatedInvestment,
            message: formattedSummary
          })
        });

        const result = await response.json();
        return { success: result.success === true, message: result.message };
      } catch (err) {
        console.error('[Email Delivery Error]:', err);
        return { success: false, error: err };
      }
    }

    // Local / development fallback if key has not been entered yet
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, timestamp: new Date().toISOString() });
      }, 600);
    });
  }
};

// ==========================================================================
// 4. Global State
// ==========================================================================
const AppState = {
  plan: {
    step: 1,
    selectedCategories: new Set(),
    selectedRequirements: new Set(),
    customRequirement: '',
    userDetails: {
      name: '',
      contact: '',
      company: '',
      notes: ''
    }
  }
};

// ==========================================================================
// 5. Plan Configurator Controller
// ==========================================================================
function initializePlanConfigurator() {
  const planModal = document.getElementById('planModal');
  if (!planModal) return;

  // Open triggers
  document.querySelectorAll('[data-action="open-plan"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openPlanModal();
    });
  });

  // Close triggers
  document.querySelectorAll('[data-action="close-plan"]').forEach((btn) => {
    btn.addEventListener('click', () => closePlanModal());
  });

  // Backdrop click
  planModal.addEventListener('click', (e) => {
    if (e.target === planModal) closePlanModal();
  });

  // Step 1: Category Selection
  const categoryCards = planModal.querySelectorAll('.selectable-card[data-category]');
  const btnStep1Continue = document.getElementById('btnStep1Continue');

  categoryCards.forEach((card) => {
    card.addEventListener('click', () => {
      const cat = card.getAttribute('data-category');
      if (AppState.plan.selectedCategories.has(cat)) {
        AppState.plan.selectedCategories.delete(cat);
        card.classList.remove('selected');
        card.setAttribute('aria-checked', 'false');
      } else {
        AppState.plan.selectedCategories.add(cat);
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
      }

      btnStep1Continue.disabled = AppState.plan.selectedCategories.size === 0;
      updateLiveSummary();
    });
  });

  btnStep1Continue.addEventListener('click', () => {
    if (AppState.plan.selectedCategories.size > 0) {
      renderRequirements();
      goToPlanStep(2);
    }
  });

  // Step 2: Back & Continue
  const btnStep2Back = document.getElementById('btnStep2Back');
  const btnStep2Continue = document.getElementById('btnStep2Continue');
  const customRequirementInput = document.getElementById('customRequirementInput');

  btnStep2Back.addEventListener('click', () => goToPlanStep(1));
  btnStep2Continue.addEventListener('click', () => {
    AppState.plan.customRequirement = customRequirementInput.value.trim();
    goToPlanStep(3);
  });

  // Step 3: Back & Submit Form
  const btnStep3Back = document.getElementById('btnStep3Back');
  const leadForm = document.getElementById('leadForm');

  btnStep3Back.addEventListener('click', () => goToPlanStep(2));
  leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    AppState.plan.userDetails.name = document.getElementById('leadName').value.trim();
    AppState.plan.userDetails.contact = document.getElementById('leadContact').value.trim();
    AppState.plan.userDetails.company = document.getElementById('leadCompany').value.trim();
    AppState.plan.userDetails.notes = document.getElementById('leadNotes').value.trim();

    buildFinalPlanScreen();
    goToPlanStep(4);
  });

  // Step 4: Final Submission
  const btnSubmitPlan = document.getElementById('btnSubmitPlan');
  btnSubmitPlan.addEventListener('click', async () => {
    btnSubmitPlan.disabled = true;
    btnSubmitPlan.textContent = 'Submitting...';

    const payload = {
      name: AppState.plan.userDetails.name,
      contact: AppState.plan.userDetails.contact,
      company: AppState.plan.userDetails.company,
      notes: AppState.plan.userDetails.notes,
      selectedCategories: Array.from(AppState.plan.selectedCategories),
      selectedServices: Array.from(AppState.plan.selectedRequirements).map((id) => {
        const item = PricingConfig.find((p) => p.id === id);
        return item ? item.label : id;
      }),
      customRequirement: AppState.plan.customRequirement,
      estimatedInvestment: calculateInvestmentSummary().displayValue,
      brandPresenceScore: AppState.score?.overallScore > 0 ? AppState.score.overallScore : null,
      submittedAt: new Date().toISOString()
    };

    const result = await LeadSubmissionHandler.submit(payload);

    const feedback = document.getElementById('submissionFeedback');
    if (result && result.success) {
      btnSubmitPlan.textContent = 'Plan Request Sent ✓';
      if (feedback) {
        feedback.textContent = 'Plan submitted successfully. We will review your details and reach out within 24 hours.';
        feedback.style.display = 'block';
        feedback.style.color = '#ffffff';
      }
    } else {
      btnSubmitPlan.disabled = false;
      btnSubmitPlan.textContent = 'Tap to Retry →';
      if (feedback) {
        feedback.textContent = 'Direct delivery encountered an issue. Please email us directly at thorvonmedia@gmail.com.';
        feedback.style.display = 'block';
        feedback.style.color = '#ff9f0a';
      }
    }
  });
}

function openPlanModal(preselectedCategory = null) {
  const planModal = document.getElementById('planModal');
  if (!planModal) return;

  closeMobileMenu();

  if (preselectedCategory) {
    AppState.plan.selectedCategories.clear();
    AppState.plan.selectedCategories.add(preselectedCategory);

    planModal.querySelectorAll('.selectable-card[data-category]').forEach((card) => {
      const cat = card.getAttribute('data-category');
      if (cat === preselectedCategory) {
        card.classList.add('selected');
        card.setAttribute('aria-checked', 'true');
      } else {
        card.classList.remove('selected');
        card.setAttribute('aria-checked', 'false');
      }
    });

    const btnStep1Continue = document.getElementById('btnStep1Continue');
    if (btnStep1Continue) btnStep1Continue.disabled = false;
  }

  goToPlanStep(1);
  updateLiveSummary();
  planModal.classList.add('is-open');
  planModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closePlanModal() {
  const planModal = document.getElementById('planModal');
  if (!planModal) return;
  planModal.classList.remove('is-open');
  planModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function goToPlanStep(stepNum) {
  AppState.plan.step = stepNum;
  document.querySelectorAll('.configurator-step').forEach((el) => {
    el.classList.remove('active');
  });

  const targetStep = document.getElementById(`planStep${stepNum}`);
  if (targetStep) targetStep.classList.add('active');

  const planModal = document.getElementById('planModal');
  const modalContainer = planModal?.querySelector('.thorvon-modal-container');
  if (modalContainer) modalContainer.scrollTop = 0;
  if (planModal) planModal.scrollTop = 0;

  updateLiveSummary();
}

/**
 * Dynamically renders enabled requirements for selected categories
 */
function renderRequirements() {
  const container = document.getElementById('requirementsContainer');
  if (!container) return;
  container.innerHTML = '';

  AppState.plan.selectedCategories.forEach((catKey) => {
    const items = PricingConfig.filter((item) => item.category === catKey && item.enabled);
    if (items.length === 0) return;

    const groupWrap = document.createElement('div');
    groupWrap.className = 'requirements-group';

    const groupTitle = document.createElement('h4');
    groupTitle.className = 'requirements-group-title';
    groupTitle.textContent = CATEGORY_NAMES[catKey] || catKey.toUpperCase();
    groupWrap.appendChild(groupTitle);

    items.forEach((item) => {
      const row = document.createElement('div');
      row.className = 'requirement-row';
      row.setAttribute('data-req-id', item.id);
      if (AppState.plan.selectedRequirements.has(item.id)) {
        row.classList.add('selected');
      }

      // Price label formatting
      let priceLabel = '';
      if (item.price !== null && item.price > 0) {
        priceLabel = `$${item.price.toLocaleString('en-US')}`;
      } else if (item.minPrice !== null && item.maxPrice !== null) {
        priceLabel = `$${item.minPrice.toLocaleString('en-US')} – $${item.maxPrice.toLocaleString('en-US')}`;
      }

      row.innerHTML = `
        <div class="requirement-left">
          <div class="req-checkbox"></div>
          <span class="requirement-name">${item.label}</span>
        </div>
        ${priceLabel ? `<span class="requirement-price">${priceLabel}</span>` : ''}
      `;

      row.addEventListener('click', () => {
        if (AppState.plan.selectedRequirements.has(item.id)) {
          AppState.plan.selectedRequirements.delete(item.id);
          row.classList.remove('selected');
        } else {
          AppState.plan.selectedRequirements.add(item.id);
          row.classList.add('selected');
        }
        updateLiveSummary();
      });

      groupWrap.appendChild(row);
    });

    container.appendChild(groupWrap);
  });
}

/**
 * Calculates investment summary based on PricingConfig
 */
function calculateInvestmentSummary() {
  let hasSetPrices = false;
  let hasRangePrices = false;
  let singleTotal = 0;
  let minTotal = 0;
  let maxTotal = 0;

  AppState.plan.selectedRequirements.forEach((id) => {
    const item = PricingConfig.find((p) => p.id === id);
    if (!item) return;

    if (item.price !== null && item.price > 0) {
      hasSetPrices = true;
      singleTotal += item.price;
      minTotal += item.price;
      maxTotal += item.price;
    } else if (item.minPrice !== null && item.maxPrice !== null) {
      hasRangePrices = true;
      minTotal += item.minPrice;
      maxTotal += item.maxPrice;
    }
  });

  if (hasRangePrices) {
    return {
      type: 'range',
      displayValue: `$${minTotal.toLocaleString('en-US')} – $${maxTotal.toLocaleString('en-US')}`
    };
  } else if (hasSetPrices && singleTotal > 0) {
    return {
      type: 'exact',
      displayValue: `$${singleTotal.toLocaleString('en-US')}`
    };
  } else {
    return {
      type: 'consultation',
      displayValue: 'Pricing calculated after consultation'
    };
  }
}

/**
 * Updates Live Plan Summary Sidebar
 */
function updateLiveSummary() {
  const summaryList = document.getElementById('summaryItemsList');
  const summaryAmount = document.getElementById('summaryInvestmentAmount');
  if (!summaryList || !summaryAmount) return;

  if (AppState.plan.selectedCategories.size === 0) {
    summaryList.innerHTML = '<p class="summary-empty-msg">No services selected yet.</p>';
    summaryAmount.textContent = 'Pricing calculated after consultation';
    return;
  }

  summaryList.innerHTML = '';

  AppState.plan.selectedCategories.forEach((catKey) => {
    const block = document.createElement('div');
    block.className = 'summary-cat-block';

    const title = document.createElement('p');
    title.className = 'summary-cat-name';
    title.textContent = CATEGORY_NAMES[catKey] || catKey.toUpperCase();
    block.appendChild(title);

    // Selected requirements for this category
    const catReqs = PricingConfig.filter(
      (item) => item.category === catKey && AppState.plan.selectedRequirements.has(item.id)
    );

    if (catReqs.length > 0) {
      catReqs.forEach((r) => {
        const sub = document.createElement('p');
        sub.className = 'summary-subservice';
        sub.textContent = `• ${r.label}`;
        block.appendChild(sub);
      });
    } else {
      const pending = document.createElement('p');
      pending.className = 'summary-subservice';
      pending.style.color = 'var(--color-text-muted)';
      pending.textContent = 'All requirements open';
      block.appendChild(pending);
    }

    summaryList.appendChild(block);
  });

  // Calculate investment
  const investment = calculateInvestmentSummary();
  summaryAmount.textContent = investment.displayValue;
}

/**
 * Builds Step 4 Review & Prefilled WhatsApp URL
 */
function buildFinalPlanScreen() {
  const finalReviewServices = document.getElementById('finalReviewServices');
  const finalCustomReqWrap = document.getElementById('finalCustomReqWrap');
  const finalCustomReqText = document.getElementById('finalCustomReqText');
  const finalInvestmentValue = document.getElementById('finalInvestmentValue');

  if (!finalReviewServices) return;
  finalReviewServices.innerHTML = '';

  AppState.plan.selectedCategories.forEach((catKey) => {
    const group = document.createElement('div');
    group.className = 'review-cat-group';

    const catName = CATEGORY_NAMES[catKey] || catKey.toUpperCase();
    const catHeader = document.createElement('p');
    catHeader.className = 'review-cat-header';
    catHeader.textContent = catName;
    group.appendChild(catHeader);

    const catReqs = PricingConfig.filter(
      (item) => item.category === catKey && AppState.plan.selectedRequirements.has(item.id)
    );

    if (catReqs.length > 0) {
      catReqs.forEach((r) => {
        const sub = document.createElement('p');
        sub.className = 'review-subitem';
        sub.textContent = r.label;
        group.appendChild(sub);
      });
    } else {
      const sub = document.createElement('p');
      sub.className = 'review-subitem';
      sub.textContent = 'General Category Engagement';
      group.appendChild(sub);
    }

    finalReviewServices.appendChild(group);
  });

  // Custom Requirement
  if (AppState.plan.customRequirement) {
    if (finalCustomReqWrap && finalCustomReqText) {
      finalCustomReqWrap.style.display = 'block';
      finalCustomReqText.textContent = AppState.plan.customRequirement;
    }
  } else if (finalCustomReqWrap) {
    finalCustomReqWrap.style.display = 'none';
  }

  // Investment
  const investment = calculateInvestmentSummary();
  if (finalInvestmentValue) {
    finalInvestmentValue.textContent = investment.displayValue;
  }
}

// ==========================================================================
// 7. Core Site Interactions (Navigation, Smooth Scroll, Reveals)
// ==========================================================================
function initializeContactLinks() {
  const contactMap = {
    call: ContactConfig.PHONE_LINK,
    email: ContactConfig.EMAIL_LINK,
    linkedin: ContactConfig.LINKEDIN_LINK
  };

  const contactElements = document.querySelectorAll('[data-contact]');
  contactElements.forEach((el) => {
    const type = el.getAttribute('data-contact');
    if (contactMap[type]) {
      el.setAttribute('href', contactMap[type]);
    }
  });
}

function initializeSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  const header = document.querySelector('.site-header');

  links.forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMobileMenu();
        return;
      }

      if (targetId === '#team') {
        e.preventDefault();
        closeMobileMenu();
        openTeamModal();
        return;
      }

      if (targetId === '#careers') {
        e.preventDefault();
        closeMobileMenu();
        openCareersPortalModal();
        return;
      }

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });

        closeMobileMenu();
      }
    });
  });
}

let mobileToggleBtn = null;
let mobileDrawerEl = null;

function initializeMobileNav() {
  mobileToggleBtn = document.querySelector('.mobile-toggle');
  mobileDrawerEl = document.getElementById('mobileDrawer');

  if (!mobileToggleBtn || !mobileDrawerEl) return;

  mobileToggleBtn.addEventListener('click', () => {
    const isOpen = mobileDrawerEl.classList.contains('is-open');
    if (isOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (mobileDrawerEl && mobileDrawerEl.classList.contains('is-open')) closeMobileMenu();
      closePlanModal();
      closePlatformActionModal();
      closeTeamModal();
      closeCareersPortalModal();
      closeJobModal();
    }
  });
}

function openMobileMenu() {
  if (!mobileToggleBtn || !mobileDrawerEl) return;
  mobileToggleBtn.setAttribute('aria-expanded', 'true');
  mobileDrawerEl.classList.add('is-open');
  mobileDrawerEl.setAttribute('aria-hidden', 'false');
  document.body.classList.add('drawer-open');
}

function closeMobileMenu() {
  if (!mobileToggleBtn || !mobileDrawerEl) return;
  mobileToggleBtn.setAttribute('aria-expanded', 'false');
  mobileDrawerEl.classList.remove('is-open');
  mobileDrawerEl.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('drawer-open');
}

/**
 * Kinetic Reveal Animations (Gupdav.com Signature Heading & Element Reveal)
 */
function initializeRevealAnimations() {
  const kineticHeadings = document.querySelectorAll('.kinetic-heading');
  const revealElements = document.querySelectorAll('.reveal-text');

  if (!('IntersectionObserver' in window)) {
    kineticHeadings.forEach((el) => el.classList.add('is-visible'));
    revealElements.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observerOptions = {
    root: null,
    rootMargin: '0px 0px -10% 0px',
    threshold: 0.12
  };

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        entry.target.closest('section')?.classList.add('in-view');
        obs.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe kinetic headings
  kineticHeadings.forEach((el) => {
    if (el.closest('#hero')) {
      setTimeout(() => el.classList.add('is-visible'), 120);
    } else {
      observer.observe(el);
    }
  });

  // Observe general reveal elements
  revealElements.forEach((el) => {
    if (el.closest('#hero')) {
      setTimeout(() => el.classList.add('is-visible'), 220);
    } else {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight * 0.9) {
        el.classList.add('is-visible');
      } else {
        observer.observe(el);
      }
    }
  });
}

/**
 * Smooth Count-Up Animation for Numeric Displays
 */
function animateCountUp(element, target, duration = 1000) {
  if (!element) return;
  const start = 0;
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Cubic ease-out curve
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentVal = Math.round(start + (target - start) * easeProgress);
    element.textContent = currentVal;

    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      element.textContent = target;
    }
  }

  requestAnimationFrame(update);
}

/**
 * Scroll-Linked Header Transitions & Top Progress Line (RAF-throttled for 60-120fps performance)
 */
function initializeScrollEffects() {
  const progressLine = document.getElementById('scrollProgress');
  const header = document.querySelector('.site-header');
  let isTicking = false;

  window.addEventListener('scroll', () => {
    if (!isTicking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        if (progressLine) {
          progressLine.style.width = `${scrollPercent}%`;
        }

        if (header) {
          if (scrollTop > 24) {
            header.classList.add('scrolled');
          } else {
            header.classList.remove('scrolled');
          }
        }
        isTicking = false;
      });
      isTicking = true;
    }
  }, { passive: true });
}

/**
 * Professional Client Intake Form Controller
 * Submits lead to Web3Forms / thorvonmedia@gmail.com with instant validation and fallback.
 */
function initializeContactForm() {
  const form = document.getElementById('agencyContactForm');
  if (!form) return;

  const statusMsg = document.getElementById('contactFormStatus');
  const submitBtn = document.getElementById('btnSubmitContact');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fullName = (document.getElementById('contactFullName')?.value || '').trim();
    const workEmail = (document.getElementById('contactWorkEmail')?.value || '').trim();
    const company = (document.getElementById('contactCompany')?.value || '').trim();
    const budget = (document.getElementById('contactBudget')?.value || 'Flexible / Need Consultation').trim();
    const serviceRadio = document.querySelector('input[name="contactServiceChoice"]:checked');
    const serviceChoice = serviceRadio ? serviceRadio.value : 'Both Content & PR';
    const message = (document.getElementById('contactMessage')?.value || '').trim();

    // Basic validation
    if (!fullName || !workEmail) {
      if (statusMsg) {
        statusMsg.textContent = 'Please provide both your name and work email.';
        statusMsg.className = 'form-status-msg error';
      }
      return;
    }

    if (!workEmail.includes('@') || !workEmail.includes('.')) {
      if (statusMsg) {
        statusMsg.textContent = 'Please enter a valid work email address.';
        statusMsg.className = 'form-status-msg error';
      }
      return;
    }

    // UI loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending Inquiry...';
    }
    if (statusMsg) {
      statusMsg.textContent = 'Transmitting your brief...';
      statusMsg.className = 'form-status-msg';
    }

    const payload = {
      name: fullName,
      contact: workEmail,
      company: company || 'Not specified',
      selectedServices: [serviceChoice],
      customRequirement: `Retainer Scope: ${budget}`,
      notes: message || 'None provided',
      estimatedInvestment: budget,
      submittedAt: new Date().toLocaleString()
    };

    try {
      const result = await LeadSubmissionHandler.submit(payload);

      if (result && result.success) {
        if (statusMsg) {
          statusMsg.textContent = `Thank you, ${fullName}. Your inquiry has been sent. We'll reply within 4–6 business hours.`;
          statusMsg.className = 'form-status-msg success';
        }
        form.reset();
      } else {
        // Mailto fallback if Web3Forms fails or is blocked
        const subject = encodeURIComponent(`Agency Inquiry: ${fullName} (${company || 'New Client'})`);
        const body = encodeURIComponent(
          `Name: ${fullName}\n` +
          `Email: ${workEmail}\n` +
          `Company: ${company}\n` +
          `Service: ${serviceChoice}\n` +
          `Budget: ${budget}\n\n` +
          `Project Scope:\n${message}\n`
        );
        window.location.href = `mailto:thorvonmedia@gmail.com?subject=${subject}&body=${body}`;

        if (statusMsg) {
          statusMsg.textContent = 'Opening your email client to send inquiry to thorvonmedia@gmail.com...';
          statusMsg.className = 'form-status-msg success';
        }
      }
    } catch (err) {
      console.error('[Form Submit Error]:', err);
      const subject = encodeURIComponent(`Agency Inquiry: ${fullName}`);
      const body = encodeURIComponent(`Name: ${fullName}\nEmail: ${workEmail}\nService: ${serviceChoice}\nBudget: ${budget}\nMessage: ${message}`);
      window.location.href = `mailto:thorvonmedia@gmail.com?subject=${subject}&body=${body}`;

      if (statusMsg) {
        statusMsg.textContent = 'Redirecting to email client...';
        statusMsg.className = 'form-status-msg';
      }
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Inquiry <span class="arrow">→</span>';
      }
    }
  });
}

// ==========================================================================
// Careers & Job Details Modal System (Direct Email Flow)
// Target: thorvonmgmt@gmail.com | Agency Name: Thorvonmedia
// ==========================================================================

const CareerPositions = {
  'clipper': {
    title: 'Clipper (Short-Form Video Editor)',
    openings: 'URGENT HIRING',
    type: 'REMOTE · FULL-TIME / PART-TIME',
    tagline: 'High-retention video cutting, pacing, kinetic typography, and viral clip extraction.',
    desc: 'We are seeking a fast, creative Clipper who lives and breathes modern short-form video algorithms. You will extract high-impact viral moments from podcasts, long-form interviews, and raw founder footage, formatting them into retention-optimized reels, Shorts, and X clips.',
    responsibilities: [
      'Extract high-retention 30–60s clips from long-form podcasts, streams, and founder recordings.',
      'Craft captivating first 3-second hooks with dynamic pacing, motion graphics, and sound design.',
      'Add clean kinetic captions, B-roll overlays, visual zooms, and seamless jump cuts.',
      'Format and export tailored aspect ratios optimized natively for X, YouTube Shorts, and Instagram Reels.',
      'Collaborate with our creative director to maintain premier visual standards across all client deliverables.'
    ],
    requirements: [
      'Proven portfolio or links to viral short-form clips you have edited (Reels, TikTok, Shorts, X)',
      'Proficiency in Adobe Premiere Pro, After Effects, DaVinci Resolve, or CapCut Pro',
      'Sharp understanding of viral retention curves, pacing, sound effects, and hook psychology',
      'Ability to turn around fast, reliable iterations in a high-growth remote agency workflow'
    ],
    emailSubject: 'Application for Clipper — Thorvonmedia'
  },
  'social-media-manager': {
    title: 'Social Media Manager',
    openings: 'URGENT HIRING',
    type: 'REMOTE · FULL-TIME',
    tagline: 'Omnichannel feed ownership, native distribution, and high-converting audience growth.',
    desc: 'We are looking for an analytical and culturally plugged-in Social Media Manager to take full ownership of publishing, feed optimization, and audience engagement across Reddit, X, LinkedIn, YouTube, and Instagram for our founder and brand clients.',
    responsibilities: [
      'Manage and deploy native publishing schedules across Reddit, X, LinkedIn, YouTube, and Instagram.',
      'Write platform-native captions, threads, and post descriptions tailored to each platform’s unique tone.',
      'Engage in comment sections, founder communities, subreddits, and target industry discussions to drive authority.',
      'Monitor audience retention, impression analytics, and generate actionable weekly performance reports.',
      'Partner with writers and editors to continuously optimize hooks and content formats based on live data.'
    ],
    requirements: [
      'Minimum 1.5+ years of experience managing active social feeds for founders, creators, or B2B/consumer brands',
      'Deep fluency in native mechanics and etiquette across Reddit, X, LinkedIn, and Instagram',
      'Excellent written English with a sharp voice suited for executive and founder communication',
      'Organized, proactive, and proficient with scheduling suites and native analytics tools'
    ],
    emailSubject: 'Application for Social Media Manager — Thorvonmedia'
  },
  'content-creator': {
    title: 'Content Creator',
    openings: 'URGENT HIRING',
    type: 'REMOTE · FULL-TIME / PART-TIME',
    tagline: 'Charismatic on-camera storytelling, creative scripting, and viral concept development.',
    desc: 'We are looking for an engaging, on-camera Content Creator who knows how to captivate an audience. You will script, shoot, and direct original short-form and long-form video concepts that translate complex founder insights, tech innovations, and brand stories into magnetic media.',
    responsibilities: [
      'Ideate, script, and record high-retention video content for social feeds and brand campaigns.',
      'Transform complex founder ideas, case studies, and PR storylines into captivating, digestible videos.',
      'Test emerging viral formats, audio trends, visual framing, and hooks to drive exponential reach.',
      'Collaborate with our video clippers and creative directors to produce flawless final exports.',
      'Maintain an authentic, confident, and persuasive on-camera persona.'
    ],
    requirements: [
      'Demonstrated portfolio or links showcasing strong on-camera performance (YouTube, Reels, TikTok, or X)',
      'Natural charisma, articulate delivery, and strong scriptwriting / storytelling capability',
      'Clean recording setup (clean audio mic, high-resolution camera/phone, good lighting)',
      'Passionate about internet culture, creator trends, and media psychology'
    ],
    emailSubject: 'Application for Content Creator — Thorvonmedia'
  },
  'brand-acquisition-head': {
    title: 'Creator & Brand Acquisition Head',
    openings: 'LEADERSHIP ROLE',
    type: 'REMOTE · FULL-TIME',
    tagline: 'Leading creator talent scouting, strategic brand partnerships, and agency client acquisition.',
    desc: 'We are seeking a driven, commercially minded Creator & Brand Acquisition Head to accelerate Thorvonmedia’s market presence. You will spearhead outbound relationships with high-caliber creators, tech founders, and top brands, structuring high-impact content production and PR retainers.',
    responsibilities: [
      'Identify, scout, and sign top-tier digital creators and prominent founders for our talent and distribution roster.',
      'Initiate and manage outbound BD pipelines targeting venture-backed startups, brands, and executive teams.',
      'Lead introductory strategy calls, pitch Thorvonmedia’s full-suite creative infrastructure, and close retainer deals.',
      'Structure win-win brand sponsorships, content syndication agreements, and PR partnerships.',
      'Work directly with agency leadership to develop high-converting commercial packages and onboarding pipelines.'
    ],
    requirements: [
      '2+ years of proven track record in talent acquisition, brand partnerships, creator management, or agency sales',
      'Existing network of connections across digital creators, agency leaders, or founder communities',
      'Exceptional consultative sales, negotiation, and high-stakes relationship-building skills',
      'Autonomous, goal-driven mindset with a hunger to lead a high-growth business development arm'
    ],
    emailSubject: 'Application for Creator & Brand Acquisition Head — Thorvonmedia'
  },
  'content-writers': {
    title: 'Content Writers',
    openings: 'OPEN',
    type: 'REMOTE · FULL-TIME',
    tagline: 'Clear, engaging writing for modern founders and fast-growing brands.',
    desc: 'We are looking for strong writers who can turn complex ideas into simple, compelling stories. You will write founder thought pieces, articles, press pitches, and newsletters that build real credibility.',
    responsibilities: [
      'Write clear, well-researched articles, LinkedIn posts, and newsletters.',
      'Draft press releases and media pitches that catch editors’ attention.',
      'Turn messy notes and rough ideas from founders into polished, readable stories.',
      'Work directly with our design and PR team to deliver work on time.'
    ],
    requirements: [
      'Minimum 1.5 years of relevant writing or editorial experience',
      'Share your best work / portfolio (published articles, essays, or client copy)',
      'Clear communication and strong attention to detail'
    ],
    emailSubject: 'Application for Content Writer — Thorvonmedia'
  },
  'graphic-designers': {
    title: 'Graphic Designers',
    openings: 'OPEN',
    type: 'REMOTE · FULL-TIME',
    tagline: 'Clean typography and modern visual design that stops the scroll.',
    desc: 'We need a creative designer who cares about details and has a strong sense of modern aesthetics. You will create eye-catching social graphics, carousels, brand kits, and slide decks for our clients.',
    responsibilities: [
      'Design clean social media graphics, carousels, and visual posts.',
      'Build modern slide decks, media kits, and brand assets for clients.',
      'Keep visual branding consistent across all client deliverables.',
      'Work with writers and video editors to bring creative concepts to life.'
    ],
    requirements: [
      'Minimum 1.5 years of professional design experience',
      'Share your portfolio / best visual work (Figma, Behance, or web link)',
      'Strong eye for typography, layouts, and color'
    ],
    emailSubject: 'Application for Graphic Designer — Thorvonmedia'
  },
  'project-manager': {
    title: 'Project Manager',
    openings: 'OPEN',
    type: 'REMOTE · FULL-TIME',
    tagline: 'Keeping creative projects organized, on time, and stress-free.',
    desc: 'We are looking for an organized, proactive person who loves making order out of chaos. You will keep our writers, designers, and video editors aligned so client work is delivered smoothly and on schedule.',
    responsibilities: [
      'Plan project timelines and ensure daily tasks are completed on time.',
      'Coordinate communication between clients, writers, designers, and editors.',
      'Review deliverables before client handover to ensure top quality.',
      'Spot bottlenecks early and help the team solve problems quickly.'
    ],
    requirements: [
      'Minimum 1.5 years of project management or coordination experience',
      'Proven ability to manage deadlines and keep teams organized',
      'Clear, friendly communication and strong problem-solving skills'
    ],
    emailSubject: 'Application for Project Manager — Thorvonmedia'
  }
};

function openJobModal(roleId) {
  const position = CareerPositions[roleId];
  const jobModal = document.getElementById('jobModal');
  if (!position || !jobModal) return;

  const titleEl = document.getElementById('jobModalTitle');
  const badgeEl = document.getElementById('jobModalBadge');
  const typeEl = document.getElementById('jobModalType');
  const taglineEl = document.getElementById('jobModalTagline');
  const descEl = document.getElementById('jobModalDesc');
  const respEl = document.getElementById('jobModalResponsibilities');
  const reqEl = document.getElementById('jobModalRequirements');
  const applyBtn = document.getElementById('jobApplyBtn');

  if (titleEl) titleEl.textContent = position.title;
  if (badgeEl) badgeEl.textContent = position.openings;
  if (typeEl) typeEl.textContent = position.type;
  if (taglineEl) taglineEl.textContent = position.tagline;
  if (descEl) descEl.textContent = position.desc;

  if (respEl) {
    respEl.innerHTML = '';
    position.responsibilities.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="bullet-check">✓</span> <span>${item}</span>`;
      respEl.appendChild(li);
    });
  }

  if (reqEl && position.requirements) {
    reqEl.innerHTML = '';
    position.requirements.forEach((item) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="bullet-check">✓</span> <span>${item}</span>`;
      reqEl.appendChild(li);
    });
  }

  const emailBodyTemplate = `Name: \nPhone: \nYears of Experience: \nPortfolio / Best Work: \nMessage: \n\n(Please attach your CV/resume and relevant work samples before sending)`;
  const mailtoUrl = `mailto:thorvonmgmt@gmail.com?subject=${encodeURIComponent(position.emailSubject)}&body=${encodeURIComponent(emailBodyTemplate)}`;

  if (applyBtn) {
    applyBtn.href = mailtoUrl;
  }

  // Reset copy confirmation state
  const confirmMsg = document.getElementById('copyConfirmMsg');
  if (confirmMsg) confirmMsg.classList.remove('is-visible');

  jobModal.classList.add('is-open');
  jobModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeJobModal() {
  const jobModal = document.getElementById('jobModal');
  if (!jobModal) return;
  jobModal.classList.remove('is-open');
  jobModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openCareersPortalModal() {
  const portalModal = document.getElementById('careersPortalModal');
  if (!portalModal) return;
  closePlatformActionModal();
  closeTeamModal();
  portalModal.classList.add('is-open');
  portalModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeCareersPortalModal() {
  const portalModal = document.getElementById('careersPortalModal');
  if (!portalModal) return;
  portalModal.classList.remove('is-open');
  portalModal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.thorvon-modal-backdrop.is-open')) {
    document.body.classList.remove('modal-open');
  }
}

function initializeCareers() {
  // Portal open triggers (nav, mobile menu, footer, team modal)
  document.querySelectorAll('[data-action="open-careers-portal"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      openCareersPortalModal();
    });
  });

  // Portal close triggers
  document.querySelectorAll('[data-action="close-careers-portal"]').forEach((btn) => {
    btn.addEventListener('click', () => closeCareersPortalModal());
  });

  // Portal backdrop click
  const portalModal = document.getElementById('careersPortalModal');
  if (portalModal) {
    portalModal.addEventListener('click', (e) => {
      if (e.target === portalModal) {
        closeCareersPortalModal();
      }
    });
  }

  // Job cards inside portal
  document.querySelectorAll('[data-action="open-job"]').forEach((card) => {
    const roleId = card.getAttribute('data-role');
    card.addEventListener('click', () => openJobModal(roleId));
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openJobModal(roleId);
      }
    });
  });

  // Modal close buttons
  document.querySelectorAll('[data-action="close-job"]').forEach((btn) => {
    btn.addEventListener('click', () => closeJobModal());
  });

  // Modal backdrop click
  const jobModal = document.getElementById('jobModal');
  if (jobModal) {
    jobModal.addEventListener('click', (e) => {
      if (e.target === jobModal) {
        closeJobModal();
      }
    });
  }

  // Escape key support
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const jobModal = document.getElementById('jobModal');
      if (jobModal && jobModal.classList.contains('is-open')) {
        closeJobModal();
        return;
      }
      const portalModal = document.getElementById('careersPortalModal');
      if (portalModal && portalModal.classList.contains('is-open')) {
        closeCareersPortalModal();
      }
    }
  });

  // URL hash navigation support: opens portal if #careers is in the address bar
  function checkCareersHash() {
    if (window.location.hash === '#careers') {
      openCareersPortalModal();
    }
  }

  window.addEventListener('hashchange', checkCareersHash);
  if (window.location.hash === '#careers') {
    setTimeout(checkCareersHash, 250);
  }

  // Copy email fallback button
  const copyBtn = document.getElementById('btnCopyHiringEmail');
  const confirmMsg = document.getElementById('copyConfirmMsg');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'thorvonmgmt@gmail.com';
      function showSuccess() {
        if (confirmMsg) {
          confirmMsg.classList.add('is-visible');
          setTimeout(() => confirmMsg.classList.remove('is-visible'), 2500);
        }
      }

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(email)
          .then(showSuccess)
          .catch(() => {
            fallbackCopy(email);
            showSuccess();
          });
      } else {
        fallbackCopy(email);
        showSuccess();
      }
    });
  }

  function fallbackCopy(text) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.left = '-9999px';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try {
      document.execCommand('copy');
    } catch (err) {
      console.error('Fallback copy error:', err);
    }
    document.body.removeChild(ta);
  }
}

// ==========================================================================
// Initialization on DOM Ready
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initializeContactLinks();
  initializeSmoothScroll();
  initializeMobileNav();
  initializeRevealAnimations();
  initializePlanConfigurator();
  initializeCareers();
  initializeTeamModal();
  initializePlatformClick();
  initializePlatformActionModal();
  initializeContactForm();
  initializeScrollEffects();
});

// ==========================================================================
// EMBEDDED TEAM MODAL CONTROLLER
// ==========================================================================
function openTeamModal() {
  const teamModal = document.getElementById('teamModal');
  if (!teamModal) return;
  closePlatformActionModal();
  closeCareersPortalModal();
  teamModal.classList.add('is-open');
  teamModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeTeamModal() {
  const teamModal = document.getElementById('teamModal');
  if (!teamModal) return;
  teamModal.classList.remove('is-open');
  teamModal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.thorvon-modal-backdrop.is-open')) {
    document.body.classList.remove('modal-open');
  }
}

function initializeTeamModal() {
  const teamModal = document.getElementById('teamModal');
  if (!teamModal) return;

  // Open buttons across header, mobile menu, footer
  document.querySelectorAll('[data-action="open-team"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeMobileMenu();
      openTeamModal();
    });
  });

  // Close buttons
  teamModal.querySelectorAll('[data-action="close-team"]').forEach((btn) => {
    btn.addEventListener('click', () => closeTeamModal());
  });

  // Backdrop click outside
  teamModal.addEventListener('click', (e) => {
    if (e.target === teamModal) {
      closeTeamModal();
    }
  });

  // Open careers button inside team modal
  teamModal.querySelectorAll('[data-action="open-careers-portal"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      closeTeamModal();
      openCareersPortalModal();
    });
  });

  // Check URL hash on page load
  function checkTeamHash() {
    if (window.location.hash === '#team') {
      openTeamModal();
    }
  }
  checkTeamHash();
  window.addEventListener('hashchange', checkTeamHash);
}


// ==========================================================================
// INTERACTIVE PLATFORM CLICK HANDLER (Select Plan on Click)
// ==========================================================================
function initializePlatformClick() {
  document.querySelectorAll('.platform-box[data-platform]').forEach((box) => {
    const handlePlatformSelect = (e) => {
      e.preventDefault();
      const platformName = box.getAttribute('data-platform') || 'Social Media';
      const iconEl = box.querySelector('.platform-icon');
      const iconHtml = iconEl ? iconEl.outerHTML : '';
      openPlatformActionModal(platformName, iconHtml);
    };

    box.addEventListener('click', handlePlatformSelect);
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        handlePlatformSelect(e);
      }
    });
  });
}


// ==========================================================================
// PLATFORM ACTION MODAL CONFIGURATION & CONTROLLER
// Platform-Specific Packages, Deliverables & Interactive Calculators
// ==========================================================================
const PlatformPackagesConfig = {
  YouTube: {
    name: 'YouTube',
    title: 'YouTube — Video Content & Channel Growth',
    subtitle: 'High-retention creative engineered, formatted, and natively deployed for YouTube channel growth.',
    auditDesc: "Our creative and PR directors will review your brand's YouTube presence. You'll receive an in-depth breakdown of your video retention curves, thumbnail CTR, title packaging, and distribution gaps.",
    plans: {
      starter: {
        kicker: 'STARTER',
        title: 'Channel Foundation',
        price: '$450',
        freq: '/ mo',
        desc: 'Consistent video editing and Shorts production to establish an active, optimized channel foundation.',
        deliverables: [
          '8 YouTube Shorts with kinetic captions, sound design & B-roll',
          '1 Long-form video edited (up to 12 mins with retention pacing)',
          '2 Custom high-CTR thumbnail concepts & title packaging',
          '4 YouTube Community engagement posts (polls & updates)',
          'Basic channel SEO metadata, tags & end-screen setup',
          'Monthly performance analytics review'
        ]
      },
      growth: {
        kicker: 'GROWTH & PR',
        title: 'Channel Growth',
        price: '$890',
        freq: '/ mo',
        featured: true,
        desc: 'Aggressive channel scaling engineered for algorithmic reach, high retention, and subscriber conversion.',
        deliverables: [
          '18 YouTube Shorts engineered for the Shorts feed algorithm',
          '3 Long-form videos fully edited (motion graphics, sound design & zooms)',
          '4 Custom 3D/vector high-CTR thumbnails with A/B title concepts',
          '8 YouTube Community tab posts & audience engagement',
          'Comprehensive video SEO, chapter markers & tag optimization',
          'Dedicated YouTube creative director & monthly strategy review'
        ]
      },
      enterprise: {
        kicker: 'ENTERPRISE',
        title: 'Channel Authority',
        price: '$1,450',
        freq: '/ mo',
        desc: 'Turnkey studio production engine to build undisputed industry authority and scale long-term viewership.',
        deliverables: [
          '30 YouTube Shorts (daily Shorts publishing frequency)',
          '6 Flagship long-form videos with bespoke animation & storycraft',
          '8 Premium custom thumbnails with retention-tested hook packaging',
          'Full Community management, pinned comments & audience interaction',
          'Complete channel management, upload scheduling & playlist architecture',
          'Bi-weekly 1-on-1 growth strategy calls & deep analytics audits'
        ]
      },
      custom: {
        kicker: 'CUSTOM',
        title: 'Custom Channel Plan',
        price: 'Tailored',
        freq: 'Pricing',
        desc: 'Select your preferred quantities of long-form videos, Shorts, thumbnails, Community posts, and channel management.',
        deliverables: [
          'Select custom quantities of long-form videos & YouTube Shorts',
          'Add custom high-CTR thumbnails and Community tab posts',
          'Include turnkey channel management, SEO & scheduling',
          'Real-time investment calculation in $ to match your exact budget'
        ]
      }
    },
    calculatorServices: [
      { id: 'yt_longform', name: 'Long-form Video Editing (up to 15 min)', unitPrice: 180, unitLabel: '/ video', defaultQty: 2, minQty: 0, maxQty: 20, desc: 'Pacing, motion graphics, sound design & 1080p/4K master' },
      { id: 'yt_shorts', name: 'YouTube Shorts (Captions & B-roll)', unitPrice: 35, unitLabel: '/ short', defaultQty: 8, minQty: 0, maxQty: 60, desc: 'Vertical 9:16 cuts with kinetic subtitles & retention hooks' },
      { id: 'yt_thumbnails', name: 'Custom High-CTR Thumbnails', unitPrice: 40, unitLabel: '/ thumbnail', defaultQty: 4, minQty: 0, maxQty: 30, desc: 'High-contrast typography, face cutouts & A/B variants' },
      { id: 'yt_community', name: 'Community Tab Posts & Polls', unitPrice: 20, unitLabel: '/ post', defaultQty: 4, minQty: 0, maxQty: 30, desc: 'Interactive audience polls, teasers & subscriber updates' },
      { id: 'yt_seo', name: 'Channel SEO & Metadata Optimization', unitPrice: 120, unitLabel: '/ month', defaultQty: 1, minQty: 0, maxQty: 1, desc: 'Keyword research, playlist curation, tags & end-screen cards' },
      { id: 'yt_mgmt', name: 'Turnkey Channel Upload & Scheduling', unitPrice: 100, unitLabel: '/ month', defaultQty: 0, minQty: 0, maxQty: 1, desc: 'Native scheduling, description links & community comment moderation' }
    ]
  },

  LinkedIn: {
    name: 'LinkedIn',
    title: 'LinkedIn — Ghostwriting & Personal Branding',
    subtitle: 'Executive ghostwriting, founder storytelling, high-converting carousels, and authority personal branding.',
    auditDesc: "Our editorial directors will evaluate your LinkedIn personal brand or company page. You'll receive a detailed review of your profile positioning, post hooks, content resonance, and executive voice.",
    plans: {
      starter: {
        kicker: 'STARTER',
        title: 'Professional Presence',
        price: '$450',
        freq: '/ mo',
        desc: 'Consistent executive visibility to maintain credibility, engage your network, and build professional authority.',
        deliverables: [
          '4 High-impact ghostwritten posts per month (1 per week)',
          'Ghostwriting based on client’s industry expertise & interview notes',
          'Hook optimization, scannable formatting & headline refinement',
          'Strategic hashtag & tag positioning',
          'Basic monthly content calendar & publishing support',
          'Monthly reach, impressions & engagement report'
        ]
      },
      growth: {
        kicker: 'GROWTH & PR',
        title: 'Authority Building',
        price: '$890',
        freq: '/ mo',
        featured: true,
        desc: 'Rapidly establish top-of-mind industry authority and attract high-value inbound business through thought leadership.',
        deliverables: [
          '14 Strategic ghostwritten posts per month (3–4 per week)',
          'Deep founder storytelling, contrarian insights & frameworks',
          '2 Custom-designed PDF document / carousel slide decks',
          'Executive personal branding & headline/bio positioning overhaul',
          'Proactive comment engagement playbook to spark executive discussions',
          'Bi-weekly performance review & content refinement calls'
        ]
      },
      enterprise: {
        kicker: 'ENTERPRISE',
        title: 'Industry Authority',
        price: '$1,450',
        freq: '/ mo',
        desc: 'Category-defining thought leadership campaigns for founders, CEOs, and venture-backed leadership teams.',
        deliverables: [
          '22 Ghostwritten posts per month (daily publishing Monday–Friday)',
          'Advanced thought leadership campaigns & executive op-eds',
          '4 Premium branded PDF carousels & infographic slide decks',
          '2 Monthly long-form LinkedIn newsletter / article editions',
          'Outbound executive PR positioning & creator tag syndication',
          'Turnkey profile management, connection strategy & comprehensive analytics'
        ]
      },
      custom: {
        kicker: 'CUSTOM',
        title: 'Custom LinkedIn Plan',
        price: 'Tailored',
        freq: 'Pricing',
        desc: 'Select your preferred volume of written posts, carousels, newsletters, and personal branding services.',
        deliverables: [
          'Choose exact monthly volume of ghostwritten posts',
          'Add custom branded PDF carousels & newsletters',
          'Include executive bio positioning & comment engagement',
          'Real-time investment calculation in $ tailored to your goals'
        ]
      }
    },
    calculatorServices: [
      { id: 'li_posts', name: 'Ghostwritten Thought Leadership Posts', unitPrice: 45, unitLabel: '/ post', defaultQty: 8, minQty: 0, maxQty: 40, desc: 'Scannable copy, strong first-line hooks & founder voice' },
      { id: 'li_carousels', name: 'Branded PDF Document / Carousel Decks', unitPrice: 80, unitLabel: '/ carousel', defaultQty: 2, minQty: 0, maxQty: 15, desc: '5–8 Slide visual presentations formatted for LinkedIn PDF viewer' },
      { id: 'li_newsletters', name: 'Long-form LinkedIn Newsletter / Article', unitPrice: 120, unitLabel: '/ edition', defaultQty: 1, minQty: 0, maxQty: 8, desc: '1,000–1,500 Word deep-dive article published on your profile' },
      { id: 'li_profile', name: 'Executive Profile & Bio Makeover', unitPrice: 150, unitLabel: '/ one-time', defaultQty: 0, minQty: 0, maxQty: 1, desc: 'Headline, About section, banner copy & Featured section curation' },
      { id: 'li_publishing', name: 'Publishing & Native Calendar Scheduling', unitPrice: 90, unitLabel: '/ month', defaultQty: 1, minQty: 0, maxQty: 1, desc: 'Timed publishing at peak executive hours with formatted copy' },
      { id: 'li_comments', name: 'Strategic Comment Engagement Management', unitPrice: 120, unitLabel: '/ month', defaultQty: 0, minQty: 0, maxQty: 1, desc: 'Targeted replies to industry leaders and prospective partners' }
    ]
  },

  Instagram: {
    name: 'Instagram',
    title: 'Instagram — Reels & Visual Content',
    subtitle: 'High-retention Reels, aesthetic carousel design, Story sequences, and cohesive feed curation.',
    auditDesc: "Our visual directors will inspect your Instagram profile. You'll receive actionable critique on your Reels hooks, grid aesthetic, Story retention, and profile conversion rate.",
    plans: {
      starter: {
        kicker: 'STARTER',
        title: 'Consistent Presence',
        price: '$450',
        freq: '/ mo',
        desc: 'Establish a polished visual presence with consistent short-form Reels and curated carousel graphics.',
        deliverables: [
          '8 Platform-native Reels with kinetic subtitles & trending audio',
          '2 High-value graphic carousel posts (up to 6 slides each)',
          '8 Story sequences (interactive stickers, polls & updates)',
          'Engaging caption copywriting with curated hashtag clusters',
          'Basic visual grid planning & scheduled publishing',
          'Monthly follower growth & engagement analytics'
        ]
      },
      growth: {
        kicker: 'GROWTH & PR',
        title: 'Audience Growth',
        price: '$890',
        freq: '/ mo',
        featured: true,
        desc: 'Accelerate organic reach on Explore & Reels with viral hook editing and high-converting carousels.',
        deliverables: [
          '18 High-retention Reels with custom motion graphics, B-roll & sound effects',
          '5 Branded multi-slide carousels and infographics',
          '20 Story sequences with interactive audience prompts & highlights',
          'Creative hook scripting & retention-optimized pacing',
          'Profile bio optimization, highlight covers & grid curation',
          'Bi-weekly performance reviews & content optimization sprints'
        ]
      },
      enterprise: {
        kicker: 'ENTERPRISE',
        title: 'Brand Dominance',
        price: '$1,450',
        freq: '/ mo',
        desc: 'Turnkey daily Instagram media engine driving brand prestige, massive reach, and inbound client conversions.',
        deliverables: [
          '28 Platform-native Reels (daily reel publishing cadence)',
          '8 Editorial carousels & design-forward static brand assets',
          'Daily Story sequences & interactive community engagement',
          'Complete feed management, pinned asset strategy & aesthetic direction',
          'DM lead automation strategy & campaign launches',
          'Dedicated creative director & comprehensive weekly growth reports'
        ]
      },
      custom: {
        kicker: 'CUSTOM',
        title: 'Custom Instagram Plan',
        price: 'Tailored',
        freq: 'Pricing',
        desc: 'Choose your desired volume of Reels, carousels, static graphics, Stories, and account management.',
        deliverables: [
          'Select monthly number of short-form Reels & video edits',
          'Add multi-slide carousels, static designs & Stories',
          'Include aesthetic feed layout & community management',
          'Real-time investment calculation in $ to match your goals'
        ]
      }
    },
    calculatorServices: [
      { id: 'ig_reels', name: 'High-Retention Instagram Reels', unitPrice: 40, unitLabel: '/ reel', defaultQty: 8, minQty: 0, maxQty: 40, desc: 'Dynamic cuts, kinetic captions, sound effects & trending audio' },
      { id: 'ig_carousels', name: 'Multi-Slide Carousel Posts (up to 8 slides)', unitPrice: 60, unitLabel: '/ carousel', defaultQty: 2, minQty: 0, maxQty: 15, desc: 'High-save educational carousels with custom graphic styling' },
      { id: 'ig_stories', name: 'Interactive Story Sequences (3–5 frames)', unitPrice: 25, unitLabel: '/ sequence', defaultQty: 4, minQty: 0, maxQty: 30, desc: 'Engaging stories with polls, quizzes, links & CTA prompts' },
      { id: 'ig_statics', name: 'Single Static Graphic / Brand Asset', unitPrice: 35, unitLabel: '/ post', defaultQty: 2, minQty: 0, maxQty: 20, desc: 'Branded quotes, announcements & minimal promotional graphics' },
      { id: 'ig_feed', name: 'Visual Feed Curation & Aesthetic Layout', unitPrice: 110, unitLabel: '/ month', defaultQty: 1, minQty: 0, maxQty: 1, desc: 'Cohesive color palette, cover templates & highlight icons' },
      { id: 'ig_mgmt', name: 'Turnkey Account Scheduling & Management', unitPrice: 120, unitLabel: '/ month', defaultQty: 0, minQty: 0, maxQty: 1, desc: 'Native publishing, hashtag tracking & comment moderation' }
    ]
  },

  X: {
    name: 'X',
    title: 'X — Writing & Real-Time Distribution',
    subtitle: 'Punchy text posts, viral breakdown threads, real-time commentary, and rapid audience growth.',
    auditDesc: "Our content strategists will evaluate your X profile. You'll receive a detailed assessment of your tweet hooks, thread retention, reply effectiveness, and conversion architecture.",
    plans: {
      starter: {
        kicker: 'STARTER',
        title: 'Consistent Voice',
        price: '$450',
        freq: '/ mo',
        desc: 'Maintain a consistent, authoritative daily presence with high-signal posts and structured threads.',
        deliverables: [
          '24 Concise, high-signal text posts per month',
          '2 In-depth breakdown threads with hook tweets & takeaways',
          'Professional profile bio & banner copywriting optimization',
          'Native scheduling calendar timed for peak follower activity',
          'Basic impression, retweet & profile visit tracking',
          'Monthly audience insights & growth recap'
        ]
      },
      growth: {
        kicker: 'GROWTH & PR',
        title: 'Audience Expansion',
        price: '$890',
        freq: '/ mo',
        featured: true,
        desc: 'Expand your reach rapidly across Tech, Founder, and Creator Twitter with viral threads and real-time commentary.',
        deliverables: [
          '55 Curated text posts, quotes & insights per month (daily cadence)',
          '6 Viral breakdown threads dissecting case studies, frameworks & trends',
          'Real-time commentary & timely newsjacking on trending topics',
          'Content repurposing (translating founder blogs/podcasts into X formats)',
          'Reply strategy playbook to engage top industry accounts',
          'Bi-weekly performance audits & hook conversion testing'
        ]
      },
      enterprise: {
        kicker: 'ENTERPRISE',
        title: 'Category Authority',
        price: '$1,450',
        freq: '/ mo',
        desc: 'Establish market leadership on X with high-frequency publishing, flagship threads, and strategic positioning.',
        deliverables: [
          '100+ Strategic text posts & quote commentary (3–4 daily drops)',
          '12 Long-form breakdown threads and published X Articles',
          'High-profile account reply positioning & network engagement',
          'End-to-end media repurposing from all client video/audio assets',
          'Dedicated growth sprint architecture & follower acquisition campaigns',
          'Full account management, schedule execution & weekly analytics reviews'
        ]
      },
      custom: {
        kicker: 'CUSTOM',
        title: 'Custom X Plan',
        price: 'Tailored',
        freq: 'Pricing',
        desc: 'Select your exact monthly volume of text posts, threads, writing support, and account management.',
        deliverables: [
          'Choose monthly post volume & thread production',
          'Add real-time commentary sprints & long-form X articles',
          'Include profile branding makeover & reply strategy',
          'Real-time investment calculation in $ to suit your needs'
        ]
      }
    },
    calculatorServices: [
      { id: 'x_posts', name: 'Concise High-Signal Text Posts', unitPrice: 12, unitLabel: '/ post', defaultQty: 25, minQty: 0, maxQty: 150, desc: 'Punchy observations, quotes, frameworks & contrarian takes' },
      { id: 'x_threads', name: 'In-Depth Viral Threads (6–10 tweets)', unitPrice: 65, unitLabel: '/ thread', defaultQty: 3, minQty: 0, maxQty: 20, desc: 'Compelling hook tweet, storytelling body & actionable conclusion' },
      { id: 'x_articles', name: 'Long-form X Article / Editorial Essay', unitPrice: 95, unitLabel: '/ article', defaultQty: 1, minQty: 0, maxQty: 10, desc: 'Long-form published essay formatted natively on X Premium' },
      { id: 'x_commentary', name: 'Real-Time Industry Commentary Sprints', unitPrice: 120, unitLabel: '/ month', defaultQty: 1, minQty: 0, maxQty: 1, desc: 'Curated timely takes on breaking news & trending industry topics' },
      { id: 'x_profile', name: 'Profile Bio, Banner & Pinned Makeover', unitPrice: 90, unitLabel: '/ one-time', defaultQty: 0, minQty: 0, maxQty: 1, desc: 'High-converting bio copy, banner layout & pinned tweet hook' },
      { id: 'x_mgmt', name: 'Turnkey Schedule Execution & Analytics', unitPrice: 100, unitLabel: '/ month', defaultQty: 0, minQty: 0, maxQty: 1, desc: 'Peak-time scheduling, link tracking & monthly follower growth analysis' }
    ]
  },

  Reddit: {
    name: 'Reddit',
    title: 'Reddit — Community & Organic Distribution',
    subtitle: 'Subreddit research, high-value discussion posts, authentic comment engagement, and organic reputation distribution.',
    auditDesc: "Our community team will conduct an audit of your brand's presence across target subreddits. You'll receive a detailed analysis of community sentiment, brand discussions, rule compliance, and organic opportunities.",
    plans: {
      starter: {
        kicker: 'STARTER',
        title: 'Community Foundation',
        price: '$450',
        freq: '/ mo',
        desc: 'Establish an authentic, rule-compliant footprint across targeted niche subreddits without spammy promotional tactics.',
        deliverables: [
          'Deep niche subreddit mapping & audience rule compliance audit',
          '4 Authentic, value-first discussion posts written in native markdown',
          'Non-promotional framing focused on genuine problem-solving',
          'Basic comment monitoring and engagement response tracking',
          'Strict compliance with individual subreddit etiquette & karma safety',
          'Monthly community sentiment & thread traction report'
        ]
      },
      growth: {
        kicker: 'GROWTH & PR',
        title: 'Community Expansion',
        price: '$890',
        freq: '/ mo',
        featured: true,
        desc: 'Scale organic discussions and brand trust across major communities through tailored guides and active participation.',
        deliverables: [
          '12 Researched community contributions, teardowns & resource guides',
          'Subreddit-specific voice adaptation tailored to each community’s culture',
          'Ongoing comment participation, constructive moderation & discussion replies',
          'Organic referral architecture and native brand positioning',
          'Karma and account safety governance with zero spam risks',
          'Bi-weekly subreddit sentiment, referral traffic & thread performance reports'
        ]
      },
      enterprise: {
        kicker: 'ENTERPRISE',
        title: 'Community Authority',
        price: '$1,450',
        freq: '/ mo',
        desc: 'Category-leading organic presence, founder AMA hosting, reputation management, and multi-subreddit reach.',
        deliverables: [
          '22 Comprehensive community guides, case studies & discussion threads',
          'Multi-subreddit strategic campaign architecture across industry & founder subreddits',
          'Founder AMA (Ask Me Anything) planning, scripting & live moderation support',
          'Dedicated daily community monitoring, brand mentions & sentiment defense',
          'Crisis reputation monitoring & organic narrative protection',
          'Detailed monthly analytics: community sentiment score, thread reach & referral breakdown'
        ]
      },
      custom: {
        kicker: 'CUSTOM',
        title: 'Custom Reddit Plan',
        price: 'Tailored',
        freq: 'Pricing',
        desc: 'Select your desired level of subreddit research, post creation, comment management, and reporting services.',
        deliverables: [
          'Select number of value-first posts and comprehensive teardowns',
          'Add ongoing comment participation & community moderation',
          'Include founder AMA coordination & sentiment monitoring',
          'Real-time investment calculation in $ strictly following platform rules'
        ]
      }
    },
    calculatorServices: [
      { id: 'rd_research', name: 'Target Subreddit Research & Compliance Audit', unitPrice: 120, unitLabel: '/ month', defaultQty: 1, minQty: 0, maxQty: 1, desc: 'Mapping 10–15 high-relevance subreddits, rules, moderators & karma minimums' },
      { id: 'rd_posts', name: 'Native Value-First Discussion Posts', unitPrice: 55, unitLabel: '/ post', defaultQty: 4, minQty: 0, maxQty: 25, desc: 'Authentic problem-solving discussions written in native markdown' },
      { id: 'rd_guides', name: 'Comprehensive Teardowns / Resource Guides', unitPrice: 95, unitLabel: '/ guide', defaultQty: 1, minQty: 0, maxQty: 10, desc: 'High-karma comprehensive teardown or resource directory' },
      { id: 'rd_comments', name: 'Active Comment Engagement & Moderation', unitPrice: 120, unitLabel: '/ month', defaultQty: 1, minQty: 0, maxQty: 1, desc: 'Engaging constructively in thread replies and maintaining organic goodwill' },
      { id: 'rd_ama', name: 'Founder AMA Strategy & Moderation Support', unitPrice: 200, unitLabel: '/ event', defaultQty: 0, minQty: 0, maxQty: 3, desc: 'Pitching moderators, drafting announcement copy & live reply support' },
      { id: 'rd_sentiment', name: 'Brand Sentiment & Reputation Monitoring', unitPrice: 110, unitLabel: '/ month', defaultQty: 0, minQty: 0, maxQty: 1, desc: 'Keyword tracking across Reddit for unlinked mentions & reputation risks' }
    ]
  }
};

let currentActivePlatform = 'YouTube';
let activeCalculatorQuantities = {};

function renderPlatformPackages(platformKey) {
  const config = PlatformPackagesConfig[platformKey] || PlatformPackagesConfig.YouTube;
  const plansGrid = document.getElementById('platformPlansGrid');
  if (!plansGrid) return;

  const p = config.plans;

  plansGrid.innerHTML = `
    <!-- Plan 1: Starter -->
    <div class="platform-plan-card" data-plan="${p.starter.title}" data-price="${p.starter.price} / month">
      <div class="plan-card-header">
        <div class="plan-card-top-row">
          <span class="plan-card-kicker">01 · ${p.starter.kicker}</span>
        </div>
        <h3 class="plan-card-title">${p.starter.title}</h3>
        <div class="plan-card-price">${p.starter.price} <span class="plan-card-freq">/ mo</span></div>
      </div>
      <p class="plan-card-desc">${p.starter.desc}</p>
      <ul class="plan-services-list">
        ${p.starter.deliverables.map(d => `<li><span class="check-icon">✓</span> <span>${d}</span></li>`).join('')}
      </ul>
      <button type="button" class="btn plan-opt-btn plan-btn-secondary" data-action="opt-in-plan" data-plan-name="Starter — ${p.starter.title}" data-plan-price="${p.starter.price} / month">
        Select Starter <span class="arrow">→</span>
      </button>
    </div>

    <!-- Plan 2: Growth & PR (Featured Most Popular) -->
    <div class="platform-plan-card featured" data-plan="${p.growth.title}" data-price="${p.growth.price} / month">
      <div class="plan-card-header">
        <div class="plan-card-top-row">
          <span class="plan-card-kicker">02 · ${p.growth.kicker}</span>
          <span class="plan-featured-tag">MOST POPULAR</span>
        </div>
        <h3 class="plan-card-title">${p.growth.title}</h3>
        <div class="plan-card-price">${p.growth.price} <span class="plan-card-freq">/ mo</span></div>
      </div>
      <p class="plan-card-desc">${p.growth.desc}</p>
      <ul class="plan-services-list">
        ${p.growth.deliverables.map(d => `<li><span class="check-icon">✓</span> <span>${d}</span></li>`).join('')}
      </ul>
      <button type="button" class="btn btn-primary plan-opt-btn" data-action="opt-in-plan" data-plan-name="Growth & PR — ${p.growth.title}" data-plan-price="${p.growth.price} / month">
        Select Growth <span class="arrow">→</span>
      </button>
    </div>

    <!-- Plan 3: Enterprise -->
    <div class="platform-plan-card" data-plan="${p.enterprise.title}" data-price="${p.enterprise.price} / month">
      <div class="plan-card-header">
        <div class="plan-card-top-row">
          <span class="plan-card-kicker">03 · ${p.enterprise.kicker}</span>
        </div>
        <h3 class="plan-card-title">${p.enterprise.title}</h3>
        <div class="plan-card-price">${p.enterprise.price} <span class="plan-card-freq">/ mo</span></div>
      </div>
      <p class="plan-card-desc">${p.enterprise.desc}</p>
      <ul class="plan-services-list">
        ${p.enterprise.deliverables.map(d => `<li><span class="check-icon">✓</span> <span>${d}</span></li>`).join('')}
      </ul>
      <button type="button" class="btn plan-opt-btn plan-btn-secondary" data-action="opt-in-plan" data-plan-name="Enterprise — ${p.enterprise.title}" data-plan-price="${p.enterprise.price} / month">
        Select Enterprise <span class="arrow">→</span>
      </button>
    </div>

    <!-- Plan 4: Custom Plan -->
    <div class="platform-plan-card custom-plan-card">
      <div class="plan-card-header">
        <div class="plan-card-top-row">
          <span class="plan-card-kicker">04 · ${p.custom.kicker}</span>
        </div>
        <h3 class="plan-card-title">${p.custom.title}</h3>
        <div class="plan-card-price">Custom <span class="plan-card-freq">scope</span></div>
      </div>
      <p class="plan-card-desc">${p.custom.desc}</p>
      <ul class="plan-services-list">
        ${p.custom.deliverables.map(d => `<li><span class="check-icon">✓</span> <span>${d}</span></li>`).join('')}
      </ul>
      <button type="button" class="btn plan-opt-btn plan-btn-secondary" data-action="open-custom-plan">
        Configure Scope <span class="arrow">→</span>
      </button>
    </div>
  `;

  // Attach opt-in listeners on newly rendered cards
  plansGrid.querySelectorAll('[data-action="opt-in-plan"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const planName = btn.getAttribute('data-plan-name') || 'Growth Plan';
      const planPrice = btn.getAttribute('data-plan-price') || '$890 / month';
      showPlanOptinPanel(planName, planPrice, `Target Platform: ${config.name}`);
    });
  });

  // Attach custom plan button listener
  plansGrid.querySelectorAll('[data-action="open-custom-plan"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      switchPlatformTab('custom');
    });
  });
}

function renderPlatformCalculator(platformKey) {
  const config = PlatformPackagesConfig[platformKey] || PlatformPackagesConfig.YouTube;
  const gridEl = document.getElementById('customCalcServicesGrid');
  if (!gridEl) return;

  activeCalculatorQuantities = {};
  config.calculatorServices.forEach((s) => {
    activeCalculatorQuantities[s.id] = s.defaultQty;
  });

  gridEl.innerHTML = config.calculatorServices.map((s) => {
    const qty = activeCalculatorQuantities[s.id];
    const subtotal = qty * s.unitPrice;
    return `
      <div class="calc-service-item ${qty > 0 ? 'has-quantity' : ''}" data-service-id="${s.id}">
        <div class="calc-service-info">
          <div class="calc-service-header">
            <h4 class="calc-service-name">${s.name}</h4>
            <span class="calc-unit-price">$${s.unitPrice} ${s.unitLabel}</span>
          </div>
          <p class="calc-service-desc">${s.desc}</p>
        </div>
        <div class="calc-stepper-wrap">
          <div class="calc-stepper">
            <button type="button" class="btn-stepper btn-decrement" data-service-id="${s.id}" aria-label="Decrease ${s.name}">−</button>
            <input type="number" class="stepper-input" data-service-id="${s.id}" min="${s.minQty}" max="${s.maxQty}" value="${qty}" aria-label="${s.name} Quantity">
            <button type="button" class="btn-stepper btn-increment" data-service-id="${s.id}" aria-label="Increase ${s.name}">+</button>
          </div>
          <div class="calc-item-subtotal" id="subtotal_${s.id}">$${subtotal.toLocaleString()}</div>
        </div>
      </div>
    `;
  }).join('');

  // Wire up quantity steppers
  gridEl.querySelectorAll('.btn-decrement').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sId = btn.getAttribute('data-service-id');
      const input = gridEl.querySelector(`.stepper-input[data-service-id="${sId}"]`);
      if (!input) return;
      const min = parseInt(input.min, 10) || 0;
      let val = (parseInt(input.value, 10) || 0) - 1;
      if (val < min) val = min;
      input.value = val;
      activeCalculatorQuantities[sId] = val;
      recalculateCustomPlan(platformKey);
    });
  });

  gridEl.querySelectorAll('.btn-increment').forEach((btn) => {
    btn.addEventListener('click', () => {
      const sId = btn.getAttribute('data-service-id');
      const input = gridEl.querySelector(`.stepper-input[data-service-id="${sId}"]`);
      if (!input) return;
      const max = parseInt(input.max, 10) || 100;
      let val = (parseInt(input.value, 10) || 0) + 1;
      if (val > max) val = max;
      input.value = val;
      activeCalculatorQuantities[sId] = val;
      recalculateCustomPlan(platformKey);
    });
  });

  gridEl.querySelectorAll('.stepper-input').forEach((input) => {
    input.addEventListener('input', () => {
      const sId = input.getAttribute('data-service-id');
      const min = parseInt(input.min, 10) || 0;
      const max = parseInt(input.max, 10) || 100;
      let val = parseInt(input.value, 10);
      if (isNaN(val) || val < min) val = min;
      if (val > max) val = max;
      activeCalculatorQuantities[sId] = val;
      recalculateCustomPlan(platformKey);
    });
  });

  // Wire up Request Custom Plan CTA
  const btnRequestCustom = document.getElementById('btnRequestCustomPlan');
  if (btnRequestCustom) {
    btnRequestCustom.onclick = (e) => {
      e.preventDefault();
      const config = PlatformPackagesConfig[platformKey] || PlatformPackagesConfig.YouTube;
      let total = 0;
      const deliverablesSummary = [];

      config.calculatorServices.forEach((s) => {
        const qty = activeCalculatorQuantities[s.id] || 0;
        if (qty > 0) {
          const cost = qty * s.unitPrice;
          total += cost;
          deliverablesSummary.push(`${qty}× ${s.name} ($${cost.toLocaleString()})`);
        }
      });

      const formattedTotal = `$${total.toLocaleString()} / month`;
      const notesPreFill = deliverablesSummary.length > 0 
        ? `Configured Deliverables:\n• ${deliverablesSummary.join('\n• ')}\n\nCalculated Monthly Total: ${formattedTotal}`
        : `Custom tailored plan for ${config.name}.`;

      showPlanOptinPanel(`Custom Plan (${config.name})`, formattedTotal, notesPreFill);
    };
  }

  recalculateCustomPlan(platformKey);
}

function recalculateCustomPlan(platformKey) {
  const config = PlatformPackagesConfig[platformKey] || PlatformPackagesConfig.YouTube;
  let total = 0;
  const pillsEl = document.getElementById('calcDeliverablesPills');
  const totalEl = document.getElementById('calcTotalAmountDisplay');
  const gridEl = document.getElementById('customCalcServicesGrid');

  const activeRows = [];

  config.calculatorServices.forEach((s) => {
    const qty = activeCalculatorQuantities[s.id] || 0;
    const subtotal = qty * s.unitPrice;
    total += subtotal;

    // Update item subtotal in UI
    const subtotalEl = document.getElementById(`subtotal_${s.id}`);
    if (subtotalEl) {
      subtotalEl.textContent = `$${subtotal.toLocaleString()}`;
    }

    // Toggle active card class
    const cardEl = gridEl?.querySelector(`.calc-service-item[data-service-id="${s.id}"]`);
    if (cardEl) {
      if (qty > 0) {
        cardEl.classList.add('has-quantity');
      } else {
        cardEl.classList.remove('has-quantity');
      }
    }

    if (qty > 0) {
      activeRows.push(`
        <div class="calc-summary-line-item">
          <span class="calc-line-name"><strong class="calc-line-qty">${qty}×</strong> ${s.name}</span>
          <span class="calc-line-price">$${subtotal.toLocaleString()}</span>
        </div>
      `);
    }
  });

  if (totalEl) {
    totalEl.innerHTML = `$${total.toLocaleString()} <span class="calc-total-freq">/ mo</span>`;
  }

  if (pillsEl) {
    if (activeRows.length > 0) {
      pillsEl.innerHTML = activeRows.join('');
    } else {
      pillsEl.innerHTML = `<p class="summary-empty-msg">No deliverables selected yet.</p>`;
    }
  }
}

function showPlanOptinPanel(planName, planPrice, prefillNotes) {
  const confirmPanel = document.getElementById('planOptinConfirmPanel');
  const tabsBar = document.querySelector('.platform-tabs-bar');
  const tabsContainer = document.getElementById('platformActionTabs');
  const contentPlans = document.getElementById('tabContentPlans');
  const contentCustom = document.getElementById('tabContentCustom');
  const contentAudit = document.getElementById('tabContentAudit');

  const planNameText = document.getElementById('confirmPlanNameText');
  const planPriceText = document.getElementById('confirmPlanPriceText');
  const hiddenPlan = document.getElementById('optinSelectedPlan');
  const hiddenPrice = document.getElementById('optinSelectedPrice');
  const hiddenPlatform = document.getElementById('optinSelectedPlatform');
  const notesField = document.getElementById('optinNotes');

  if (planNameText) planNameText.textContent = planName;
  if (planPriceText) planPriceText.textContent = planPrice;
  if (hiddenPlan) hiddenPlan.value = planName;
  if (hiddenPrice) hiddenPrice.value = planPrice;
  if (hiddenPlatform) hiddenPlatform.value = currentActivePlatform;
  if (notesField && prefillNotes) notesField.value = prefillNotes;

  // Hide tab switcher and tabs
  if (tabsBar) tabsBar.style.display = 'none';
  if (tabsContainer) tabsContainer.style.display = 'none';
  if (contentPlans) contentPlans.style.display = 'none';
  if (contentCustom) contentCustom.style.display = 'none';
  if (contentAudit) contentAudit.style.display = 'none';

  if (confirmPanel) {
    confirmPanel.style.display = 'block';
    const modalContainer = document.querySelector('.platform-action-modal-container');
    if (modalContainer) modalContainer.scrollTop = 0;
  }
}

function hidePlanOptinPanel() {
  const confirmPanel = document.getElementById('planOptinConfirmPanel');
  const tabsBar = document.querySelector('.platform-tabs-bar');
  const tabsContainer = document.getElementById('platformActionTabs');
  if (confirmPanel) confirmPanel.style.display = 'none';
  if (tabsBar) tabsBar.style.display = '';
  if (tabsContainer) tabsContainer.style.display = '';

  // Restore active tab
  const activeBtn = document.querySelector('.platform-tab-btn.active');
  const tabName = activeBtn ? activeBtn.getAttribute('data-tab') : 'plans';
  switchPlatformTab(tabName);
}

function openPlatformActionModal(platformName, iconHtml) {
  const modal = document.getElementById('platformActionModal');
  if (!modal) return;

  closeMobileMenu();
  closeTeamModal();
  closeCareersPortalModal();

  currentActivePlatform = platformName;
  const config = PlatformPackagesConfig[platformName] || PlatformPackagesConfig.YouTube;

  // Update Header & Badge
  const badgeName = document.getElementById('platformModalName');
  if (badgeName) badgeName.textContent = config.name;

  const iconWrap = document.getElementById('platformModalIconWrap');
  if (iconWrap && iconHtml) {
    iconWrap.innerHTML = iconHtml;
  }

  // Update Main Modal Title
  const titleEl = document.getElementById('platformActionTitle');
  if (titleEl) {
    titleEl.textContent = config.title;
  }

  // Highlight platform in text
  modal.querySelectorAll('.platform-name-highlight').forEach((el) => {
    el.textContent = config.name;
  });

  // Update intro texts
  const tabIntro = document.getElementById('platformTabIntro');
  if (tabIntro) {
    tabIntro.innerHTML = `Structured monthly packages engineered for <span class="platform-name-highlight">${config.name}</span>.`;
  }

  const calcDesc = document.getElementById('calculatorPlatformDesc');
  if (calcDesc) {
    calcDesc.textContent = `Adjust monthly quantities for ${config.name}. Pricing updates automatically.`;
  }

  const auditDesc = modal.querySelector('.audit-desc');
  if (auditDesc && config.auditDesc) {
    auditDesc.textContent = config.auditDesc;
  }

  // Pre-fill hidden inputs
  const auditHidden = document.getElementById('auditPlatformHidden');
  if (auditHidden) auditHidden.value = config.name;

  const optinHidden = document.getElementById('optinSelectedPlatform');
  if (optinHidden) optinHidden.value = config.name;

  // Render Platform Plans & Calculator
  renderPlatformPackages(platformName);
  renderPlatformCalculator(platformName);

  // Hide confirm panel if showing and reset to Plans tab
  hidePlanOptinPanel();
  switchPlatformTab('plans');

  // Open modal
  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closePlatformActionModal() {
  const modal = document.getElementById('platformActionModal');
  if (!modal) return;
  modal.classList.remove('is-open');
  modal.setAttribute('aria-hidden', 'true');
  if (!document.querySelector('.thorvon-modal-backdrop.is-open')) {
    document.body.classList.remove('modal-open');
  }
}

function switchPlatformTab(tabName) {
  const tabBtnPlans = document.getElementById('tabBtnPlans');
  const tabBtnCustom = document.getElementById('tabBtnCustom');
  const tabBtnAudit = document.getElementById('tabBtnAudit');
  const contentPlans = document.getElementById('tabContentPlans');
  const contentCustom = document.getElementById('tabContentCustom');
  const contentAudit = document.getElementById('tabContentAudit');
  const confirmPanel = document.getElementById('planOptinConfirmPanel');
  const tabsBar = document.querySelector('.platform-tabs-bar');
  const tabsContainer = document.getElementById('platformActionTabs');

  // Hide confirm panel if switching tabs
  if (confirmPanel) confirmPanel.style.display = 'none';
  if (tabsBar) tabsBar.style.display = '';
  if (tabsContainer) tabsContainer.style.display = '';

  // Deactivate all
  [tabBtnPlans, tabBtnCustom, tabBtnAudit].forEach((btn) => {
    btn?.classList.remove('active');
    btn?.setAttribute('aria-selected', 'false');
  });

  [contentPlans, contentCustom, contentAudit].forEach((c) => {
    if (c) {
      c.classList.remove('active');
      c.style.display = 'none';
    }
  });

  if (tabName === 'custom') {
    tabBtnCustom?.classList.add('active');
    tabBtnCustom?.setAttribute('aria-selected', 'true');
    if (contentCustom) {
      contentCustom.classList.add('active');
      contentCustom.style.display = 'block';
    }
  } else if (tabName === 'audit') {
    tabBtnAudit?.classList.add('active');
    tabBtnAudit?.setAttribute('aria-selected', 'true');
    if (contentAudit) {
      contentAudit.classList.add('active');
      contentAudit.style.display = 'block';
    }
  } else {
    tabBtnPlans?.classList.add('active');
    tabBtnPlans?.setAttribute('aria-selected', 'true');
    if (contentPlans) {
      contentPlans.classList.add('active');
      contentPlans.style.display = 'block';
    }
  }

  const modalContainer = document.querySelector('.platform-action-modal-container');
  if (modalContainer) modalContainer.scrollTop = 0;
}

function initializePlatformActionModal() {
  const modal = document.getElementById('platformActionModal');
  if (!modal) return;

  // Close triggers
  modal.querySelectorAll('[data-action="close-platform-modal"]').forEach((btn) => {
    btn.addEventListener('click', () => closePlatformActionModal());
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closePlatformActionModal();
  });

  // Tab switching (Plans vs Custom Calculator vs Audit)
  const tabBtnPlans = document.getElementById('tabBtnPlans');
  const tabBtnCustom = document.getElementById('tabBtnCustom');
  const tabBtnAudit = document.getElementById('tabBtnAudit');

  tabBtnPlans?.addEventListener('click', () => switchPlatformTab('plans'));
  tabBtnCustom?.addEventListener('click', () => switchPlatformTab('custom'));
  tabBtnAudit?.addEventListener('click', () => switchPlatformTab('audit'));

  // Cancel / Back button from Confirmation Panel
  const btnCancelOptin = document.getElementById('btnCancelOptin');
  btnCancelOptin?.addEventListener('click', () => {
    hidePlanOptinPanel();
  });

  // Opt-in Form Submission
  const optinForm = document.getElementById('planOptinForm');
  optinForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById('btnSubmitPlanOptin');
    const statusMsg = document.getElementById('optinFormStatus');

    const name = (document.getElementById('optinName')?.value || '').trim();
    const email = (document.getElementById('optinEmail')?.value || '').trim();
    const company = (document.getElementById('optinCompany')?.value || '').trim();
    const handle = (document.getElementById('optinHandle')?.value || '').trim();
    const notes = (document.getElementById('optinNotes')?.value || '').trim();
    const plan = (document.getElementById('optinSelectedPlan')?.value || 'Curated Plan');
    const price = (document.getElementById('optinSelectedPrice')?.value || '');

    if (!name || !email) return;

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Submitting...';
    }

    const payload = {
      name,
      contact: email,
      company: company || 'Not specified',
      selectedServices: [`${plan} (${price}) for ${currentActivePlatform}`],
      customRequirement: `Platform Handle: ${handle || 'None provided'}`,
      estimatedInvestment: price,
      notes: notes || 'None',
      submittedAt: new Date().toLocaleString()
    };

    const res = await LeadSubmissionHandler.submit(payload);
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Confirm & Request Plan →';
    }

    if (res.success) {
      if (statusMsg) {
        statusMsg.style.color = '#4ade80';
        statusMsg.textContent = '✓ Request received! We will send your plan details shortly.';
      }
      optinForm.reset();
      setTimeout(() => {
        closePlatformActionModal();
        if (statusMsg) statusMsg.textContent = '';
      }, 2500);
    } else {
      if (statusMsg) {
        statusMsg.style.color = '#f87171';
        statusMsg.textContent = 'Please email us directly at thorvonmedia@gmail.com';
      }
    }
  });

  // Audit Form Submission
  const auditForm = document.getElementById('platformAuditForm');
  auditForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btnSubmit = document.getElementById('btnSubmitAudit');
    const statusMsg = document.getElementById('auditFormStatus');

    const fullName = (document.getElementById('auditFullName')?.value || '').trim();
    const workEmail = (document.getElementById('auditWorkEmail')?.value || '').trim();
    const businessName = (document.getElementById('auditBusinessName')?.value || '').trim();
    const profileUrl = (document.getElementById('auditProfileUrl')?.value || '').trim();
    const goal = document.getElementById('auditPrimaryGoal')?.value || 'Growth';
    const notes = (document.getElementById('auditNotes')?.value || '').trim();

    if (!fullName || !workEmail || !businessName || !profileUrl) return;

    if (btnSubmit) {
      btnSubmit.disabled = true;
      btnSubmit.textContent = 'Submitting Audit Request...';
    }

    const payload = {
      name: fullName,
      contact: workEmail,
      company: businessName,
      selectedServices: [`FREE AUDIT for ${currentActivePlatform}`],
      customRequirement: `Profile URL/Handle: ${profileUrl}
Primary Goal: ${goal}`,
      estimatedInvestment: 'Free Business Audit',
      notes: notes || 'None',
      submittedAt: new Date().toLocaleString()
    };

    const res = await LeadSubmissionHandler.submit(payload);
    if (btnSubmit) {
      btnSubmit.disabled = false;
      btnSubmit.textContent = 'Request Free Audit →';
    }

    if (res.success) {
      if (statusMsg) {
        statusMsg.style.color = '#4ade80';
        statusMsg.textContent = '✓ Audit requested! Our directors will review your brand within 24-48 hours.';
      }
      auditForm.reset();
      setTimeout(() => {
        closePlatformActionModal();
        if (statusMsg) statusMsg.textContent = '';
      }, 3000);
    } else {
      if (statusMsg) {
        statusMsg.style.color = '#f87171';
        statusMsg.textContent = 'Please email us directly at thorvonmedia@gmail.com';
      }
    }
  });
}
