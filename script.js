/**
 * THORVON MEDIA — SCRIPT
 * Minimalist, high-performance interactions, Apple-style configurator & brand score tool.
 */

// ==========================================================================
// 1. Contact Links Configuration
// ==========================================================================
const ContactConfig = {
  EMAIL: 'thorvonmedia@gmail.com',
  EMAIL_LINK: 'mailto:thorvonmedia@gmail.com'
};

// ==========================================================================
// 2. Centralized Pricing & Service Configuration
// Edit prices, ranges, or disable services here without modifying UI code.
// Set price or minPrice/maxPrice to numbers (in ₹) when ready.
// If null/0, the system displays "Pricing calculated after consultation".
// ==========================================================================
const PricingConfig = [
  // --- PR Requirements ---
  { id: 'pr_founder', label: 'Founder PR', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_brand', label: 'Brand PR', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_personal', label: 'Personal Branding', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_rep_mgmt', label: 'Reputation Management', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_rep_recov', label: 'Reputation Recovery', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_media_outreach', label: 'Media / Press Outreach', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_strategy', label: 'PR Strategy', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'pr_smo', label: 'Social Media Optimization', category: 'pr', price: null, minPrice: null, maxPrice: null, enabled: true },

  // --- Content Requirements ---
  { id: 'cnt_scriptwriting', label: 'Scriptwriting', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_video_editing', label: 'Video Editing', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_short_form', label: 'Short-form Content', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_long_form', label: 'Long-form Content', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_strategy', label: 'Content Strategy', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_social_content', label: 'Social Media Content', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_post_prod', label: 'Content Post-Production', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_smo', label: 'Social Media Optimization', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_motion_graphics', label: 'Motion Graphics', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'cnt_repurposing', label: 'Content Repurposing', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true }
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
      brandPresenceScore: AppState.score.overallScore > 0 ? AppState.score.overallScore : null,
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
        feedback.textContent = 'Direct delivery encountered an issue. Tap "Chat on WhatsApp →" below to send your plan instantly.';
        feedback.style.display = 'block';
        feedback.style.color = '#ff9f0a';
      }
    }
  });
}

function openPlanModal(preselectedCategory = null) {
  const planModal = document.getElementById('planModal');
  if (!planModal) return;

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
        priceLabel = `₹${item.price.toLocaleString('en-IN')}`;
      } else if (item.minPrice !== null && item.maxPrice !== null) {
        priceLabel = `₹${item.minPrice.toLocaleString('en-IN')} – ₹${item.maxPrice.toLocaleString('en-IN')}`;
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
      displayValue: `₹${minTotal.toLocaleString('en-IN')} – ₹${maxTotal.toLocaleString('en-IN')}`
    };
  } else if (hasSetPrices && singleTotal > 0) {
    return {
      type: 'exact',
      displayValue: `₹${singleTotal.toLocaleString('en-IN')}`
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
    email: ContactConfig.EMAIL_LINK
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
  document.body.style.overflow = 'hidden';
}

function closeMobileMenu() {
  if (!mobileToggleBtn || !mobileDrawerEl) return;
  mobileToggleBtn.setAttribute('aria-expanded', 'false');
  mobileDrawerEl.classList.remove('is-open');
  mobileDrawerEl.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
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
  portalModal.classList.add('is-open');
  portalModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeCareersPortalModal() {
  const portalModal = document.getElementById('careersPortalModal');
  if (!portalModal) return;
  portalModal.classList.remove('is-open');
  portalModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function initializeCareers() {
  // Portal open triggers (e.g. footer link)
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
      if (e.target === portalModal) closeCareersPortalModal();
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
      if (e.target === jobModal) closeJobModal();
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
  initializeContactForm();
  initializeScrollEffects();
});
