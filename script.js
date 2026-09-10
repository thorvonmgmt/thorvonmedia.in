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
  WHATSAPP: '+917002889463',
  WHATSAPP_DISPLAY: '+91 70028 89463',
  WHATSAPP_LINK: 'https://wa.me/917002889463',
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
  { id: 'cnt_repurposing', label: 'Content Repurposing', category: 'content', price: null, minPrice: null, maxPrice: null, enabled: true },

  // --- Influencer Management Requirements ---
  { id: 'inf_mgmt', label: 'Influencer Management', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'inf_strategy', label: 'Influencer Strategy', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'inf_discovery', label: 'Influencer Discovery', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'inf_campaign_mgmt', label: 'Campaign Management', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'inf_coordination', label: 'Creator Coordination', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'inf_partnerships', label: 'Brand–Creator Partnerships', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true },
  { id: 'inf_reporting', label: 'Campaign Reporting', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true }
];

// Category metadata
const CATEGORY_NAMES = {
  pr: 'PR',
  content: 'CONTENT',
  influence: 'INFLUENCER MANAGEMENT'
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

    // If Web3Forms Access Key is provided, dispatch email directly
    if (LeadSubmissionHandler.WEB3FORMS_ACCESS_KEY && LeadSubmissionHandler.WEB3FORMS_ACCESS_KEY !== 'YOUR_WEB3FORMS_ACCESS_KEY') {
      try {
        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            access_key: LeadSubmissionHandler.WEB3FORMS_ACCESS_KEY,
            from_name: 'Thorvon Media Website',
            subject: `New Thorvon Plan: ${planData.name || 'Anonymous'} (${planData.company || 'Direct Client'})`,
            'Client Name': planData.name,
            'Contact (Email/WhatsApp)': planData.contact,
            'Company / Brand': planData.company || 'Not specified',
            'Selected Services': planData.selectedServices.join(', '),
            'Custom Requirements': planData.customRequirement || 'None',
            'Estimated Investment': planData.estimatedInvestment,
            'Brand Presence Score': planData.brandPresenceScore ? `${planData.brandPresenceScore} / 100` : 'Not completed',
            'Additional Notes': planData.notes || 'None',
            'Submitted At': planData.submittedAt
          })
        });

        const result = await response.json();
        return { success: result.success };
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
  },
  score: {
    currentQuestionIndex: 0,
    answers: [],
    prScore: 0,
    contentScore: 0,
    influenceScore: 0,
    overallScore: 0,
    lowestCategory: 'content'
  }
};

// 6 Questions across PR, Content, Influence
const AssessmentQuestions = [
  {
    category: 'pr',
    categoryName: 'PR',
    title: 'How strong is your public visibility?',
    options: [
      { text: 'Very strong across all major media channels', score: 100 },
      { text: 'Strong in our niche, but room to expand', score: 75 },
      { text: 'Developing; occasional visibility', score: 50 },
      { text: 'Limited or practically non-existent', score: 25 }
    ]
  },
  {
    category: 'pr',
    categoryName: 'PR',
    title: 'How is your brand reputation and press outreach handled?',
    options: [
      { text: 'Active ongoing PR and consistent press mentions', score: 100 },
      { text: 'Occasional features and coverage', score: 75 },
      { text: 'Reactive; only managed during announcements or crises', score: 50 },
      { text: 'No active PR management in place', score: 25 }
    ]
  },
  {
    category: 'content',
    categoryName: 'CONTENT',
    title: 'How consistent is your content publishing engine?',
    options: [
      { text: 'Very consistent, highly structured calendar', score: 100 },
      { text: 'Somewhat consistent, occasional gaps', score: 75 },
      { text: 'Inconsistent; we publish whenever time allows', score: 50 },
      { text: "We currently don't have an active content system", score: 25 }
    ]
  },
  {
    category: 'content',
    categoryName: 'CONTENT',
    title: 'How would you rate your content production & post-production quality?',
    options: [
      { text: 'Premium end-to-end studio level quality', score: 100 },
      { text: 'Good quality, handled internally', score: 75 },
      { text: 'Basic quality; needs sharper polish', score: 50 },
      { text: 'Needs a complete overhaul and professional standard', score: 25 }
    ]
  },
  {
    category: 'influence',
    categoryName: 'INFLUENCER MANAGEMENT',
    title: 'How are your influencer and creator partnerships managed?',
    options: [
      { text: 'Professionally managed with clear ROI and contracts', score: 100 },
      { text: 'Managed in-house with mixed results', score: 75 },
      { text: 'Occasional one-off gifting or collaborations', score: 50 },
      { text: 'Not currently active with influencers', score: 25 }
    ]
  },
  {
    category: 'influence',
    categoryName: 'INFLUENCER MANAGEMENT',
    title: 'What level of strategic outcomes do creators generate for you?',
    options: [
      { text: 'High-impact campaigns and long-term brand equity', score: 100 },
      { text: 'Moderate engagement and awareness', score: 75 },
      { text: 'Inconsistent or hard to quantify outcomes', score: 50 },
      { text: 'No creator partnerships or measurable outcomes yet', score: 25 }
    ]
  }
];

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

    await LeadSubmissionHandler.submit(payload);

    btnSubmitPlan.textContent = 'Plan Request Sent ✓';
    const feedback = document.getElementById('submissionFeedback');
    if (feedback) feedback.style.display = 'block';
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
  const whatsappPlanLink = document.getElementById('whatsappPlanLink');

  if (!finalReviewServices) return;
  finalReviewServices.innerHTML = '';

  let whatsappTextLines = [
    'Hi Thorvon Media,',
    '',
    'I just built a custom plan on your website:',
    ''
  ];

  AppState.plan.selectedCategories.forEach((catKey) => {
    const group = document.createElement('div');
    group.className = 'review-cat-group';

    const catName = CATEGORY_NAMES[catKey] || catKey.toUpperCase();
    const catHeader = document.createElement('p');
    catHeader.className = 'review-cat-header';
    catHeader.textContent = catName;
    group.appendChild(catHeader);

    whatsappTextLines.push(`*${catName}*`);

    const catReqs = PricingConfig.filter(
      (item) => item.category === catKey && AppState.plan.selectedRequirements.has(item.id)
    );

    if (catReqs.length > 0) {
      catReqs.forEach((r) => {
        const sub = document.createElement('p');
        sub.className = 'review-subitem';
        sub.textContent = r.label;
        group.appendChild(sub);
        whatsappTextLines.push(`• ${r.label}`);
      });
    } else {
      const sub = document.createElement('p');
      sub.className = 'review-subitem';
      sub.textContent = 'General Category Engagement';
      group.appendChild(sub);
      whatsappTextLines.push('• General Engagement');
    }

    whatsappTextLines.push('');
    finalReviewServices.appendChild(group);
  });

  // Custom Requirement
  if (AppState.plan.customRequirement) {
    if (finalCustomReqWrap && finalCustomReqText) {
      finalCustomReqWrap.style.display = 'block';
      finalCustomReqText.textContent = AppState.plan.customRequirement;
    }
    whatsappTextLines.push(`*Additional Requirements:* ${AppState.plan.customRequirement}`);
    whatsappTextLines.push('');
  } else if (finalCustomReqWrap) {
    finalCustomReqWrap.style.display = 'none';
  }

  // Investment
  const investment = calculateInvestmentSummary();
  if (finalInvestmentValue) {
    finalInvestmentValue.textContent = investment.displayValue;
  }
  whatsappTextLines.push(`*Estimated Investment:* ${investment.displayValue}`);

  // Contact details if provided
  if (AppState.plan.userDetails.name) {
    whatsappTextLines.push(`*Name:* ${AppState.plan.userDetails.name}`);
  }
  if (AppState.plan.userDetails.company) {
    whatsappTextLines.push(`*Company:* ${AppState.plan.userDetails.company}`);
  }

  // Bind WhatsApp prefilled link
  if (whatsappPlanLink) {
    const encoded = encodeURIComponent(whatsappTextLines.join('\n'));
    whatsappPlanLink.setAttribute('href', `${ContactConfig.WHATSAPP_LINK}?text=${encoded}`);
  }
}

// ==========================================================================
// 6. PR & Content Score Tool Controller
// ==========================================================================
function initializeScoreTool() {
  const scoreModal = document.getElementById('scoreModal');
  if (!scoreModal) return;

  // Open triggers
  document.querySelectorAll('[data-action="open-score"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openScoreModal();
    });
  });

  // Close triggers
  document.querySelectorAll('[data-action="close-score"]').forEach((btn) => {
    btn.addEventListener('click', () => closeScoreModal());
  });

  // Backdrop click
  scoreModal.addEventListener('click', (e) => {
    if (e.target === scoreModal) closeScoreModal();
  });

  // Back button
  const btnScoreBack = document.getElementById('btnScoreBack');
  btnScoreBack.addEventListener('click', () => {
    if (AppState.score.currentQuestionIndex > 0) {
      AppState.score.currentQuestionIndex--;
      AppState.score.answers.pop();
      renderScoreQuestion();
    }
  });

  // Conversion: BUILD MY PLAN →
  const btnScoreToPlan = document.getElementById('btnScoreToPlan');
  btnScoreToPlan.addEventListener('click', () => {
    closeScoreModal();
    openPlanModal(AppState.score.lowestCategory);
  });
}

function openScoreModal() {
  const scoreModal = document.getElementById('scoreModal');
  if (!scoreModal) return;

  // Reset questionnaire
  AppState.score.currentQuestionIndex = 0;
  AppState.score.answers = [];

  const questionnaire = document.getElementById('scoreQuestionnaire');
  const resultsScreen = document.getElementById('scoreResultsScreen');
  if (questionnaire) questionnaire.style.display = 'block';
  if (resultsScreen) resultsScreen.style.display = 'none';

  renderScoreQuestion();
  scoreModal.classList.add('is-open');
  scoreModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeScoreModal() {
  const scoreModal = document.getElementById('scoreModal');
  if (!scoreModal) return;
  scoreModal.classList.remove('is-open');
  scoreModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function renderScoreQuestion() {
  const index = AppState.score.currentQuestionIndex;
  const qData = AssessmentQuestions[index];
  if (!qData) return;

  const total = AssessmentQuestions.length;
  const progressPct = ((index + 1) / total) * 100;

  const progressBar = document.getElementById('scoreProgressBar');
  const counter = document.getElementById('scoreStepCounter');
  const catTag = document.getElementById('qCategoryTag');
  const qTitle = document.getElementById('qTitle');
  const optionsContainer = document.getElementById('qOptionsContainer');
  const btnBack = document.getElementById('btnScoreBack');

  if (progressBar) progressBar.style.width = `${progressPct}%`;
  if (counter) counter.textContent = `Question ${index + 1} of ${total}`;
  if (catTag) catTag.textContent = qData.categoryName;
  if (qTitle) qTitle.textContent = qData.title;
  if (btnBack) btnBack.style.visibility = index > 0 ? 'visible' : 'hidden';

  if (!optionsContainer) return;
  optionsContainer.innerHTML = '';

  qData.options.forEach((opt) => {
    const row = document.createElement('div');
    row.className = 'option-row';
    row.innerHTML = `
      <span>${opt.text}</span>
      <span class="opt-arrow">→</span>
    `;

    row.addEventListener('click', () => {
      AppState.score.answers.push({
        category: qData.category,
        score: opt.score
      });

      if (AppState.score.currentQuestionIndex < total - 1) {
        AppState.score.currentQuestionIndex++;
        renderScoreQuestion();
      } else {
        calculateAndDisplayScore();
      }
    });

    optionsContainer.appendChild(row);
  });
}

function calculateAndDisplayScore() {
  const answers = AppState.score.answers;
  const prAnswers = answers.filter((a) => a.category === 'pr');
  const contentAnswers = answers.filter((a) => a.category === 'content');
  const influenceAnswers = answers.filter((a) => a.category === 'influence');

  const avg = (arr) => Math.round(arr.reduce((sum, item) => sum + item.score, 0) / (arr.length || 1));

  const prScore = avg(prAnswers);
  const contentScore = avg(contentAnswers);
  const influenceScore = avg(influenceAnswers);
  const overallScore = Math.round((prScore + contentScore + influenceScore) / 3);

  AppState.score.prScore = prScore;
  AppState.score.contentScore = contentScore;
  AppState.score.influenceScore = influenceScore;
  AppState.score.overallScore = overallScore;

  // Determine lowest score category
  const categories = [
    { key: 'pr', score: prScore },
    { key: 'content', score: contentScore },
    { key: 'influence', score: influenceScore }
  ];
  categories.sort((a, b) => a.score - b.score);
  AppState.score.lowestCategory = categories[0].key;

  // Render results
  const questionnaire = document.getElementById('scoreQuestionnaire');
  const resultsScreen = document.getElementById('scoreResultsScreen');
  if (questionnaire) questionnaire.style.display = 'none';
  if (resultsScreen) resultsScreen.style.display = 'block';

  const overallVal = document.getElementById('overallScoreVal');
  const valPr = document.getElementById('valPr');
  const barPr = document.getElementById('barPr');
  const valContent = document.getElementById('valContent');
  const barContent = document.getElementById('barContent');
  const valInfluence = document.getElementById('valInfluence');
  const barInfluence = document.getElementById('barInfluence');
  const obsText = document.getElementById('observationText');

  // Animate count-up for numbers
  if (overallVal) animateCountUp(overallVal, overallScore, 1100);
  if (valPr) animateCountUp(valPr, prScore, 850);
  if (valContent) animateCountUp(valContent, contentScore, 850);
  if (valInfluence) animateCountUp(valInfluence, influenceScore, 850);

  setTimeout(() => {
    if (barPr) barPr.style.width = `${prScore}%`;
    if (barContent) barContent.style.width = `${contentScore}%`;
    if (barInfluence) barInfluence.style.width = `${influenceScore}%`;
  }, 120);

  // Personalized observation
  if (obsText) {
    if (AppState.score.lowestCategory === 'pr') {
      obsText.textContent = 'Your biggest opportunity appears to be public visibility and PR.';
    } else if (AppState.score.lowestCategory === 'content') {
      obsText.textContent = 'Your biggest opportunity appears to be content consistency and production.';
    } else {
      obsText.textContent = 'Your biggest opportunity appears to be influencer and creator management.';
    }
  }
}

// ==========================================================================
// 7. Core Site Interactions (Navigation, Smooth Scroll, Reveals)
// ==========================================================================
function initializeContactLinks() {
  const contactMap = {
    call: ContactConfig.PHONE_LINK,
    whatsapp: ContactConfig.WHATSAPP_LINK,
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
      closeScoreModal();
      closeContactModal();
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
 * Contact Modal Controller
 */
function initializeContactModal() {
  const contactModal = document.getElementById('contactModal');
  if (!contactModal) return;

  // Open triggers
  document.querySelectorAll('[data-action="open-contact"]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      // If triggered by anchor link, prevent jump and open modal
      e.preventDefault();
      closeMobileMenu();
      openContactModal();
    });
  });

  // Close triggers
  document.querySelectorAll('[data-action="close-contact"]').forEach((btn) => {
    btn.addEventListener('click', () => closeContactModal());
  });

  // Backdrop click
  contactModal.addEventListener('click', (e) => {
    if (e.target === contactModal) closeContactModal();
  });
}

function openContactModal() {
  const contactModal = document.getElementById('contactModal');
  if (!contactModal) return;
  contactModal.classList.add('is-open');
  contactModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}

function closeContactModal() {
  const contactModal = document.getElementById('contactModal');
  if (!contactModal) return;
  contactModal.classList.remove('is-open');
  contactModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
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
 * Ambient Cursor Spotlight
 */
function initializeAmbientSpotlight() {
  let ticking = false;
  window.addEventListener('mousemove', (e) => {
    if (!ticking) {
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

/**
 * Scroll-Linked Header Transitions & Top Progress Line
 */
function initializeScrollEffects() {
  const progressLine = document.getElementById('scrollProgress');
  const header = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
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
  }, { passive: true });
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
  initializeScoreTool();
  initializeContactModal();
  initializeAmbientSpotlight();
  initializeScrollEffects();
});
