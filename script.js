/* Thorvon Media — v3 interactions */
(function () {
  'use strict';
  document.documentElement.classList.add('js');

  /* ---------- Config ---------- */
  var WHATSAPP_NUMBER = '917002889463';           // same number as talent.thorvonmedia.in
  var WHATSAPP_LINK = 'https://wa.me/917002889463';
  // Contact form delivery: Web3Forms (same access key the original thorvonmedia.in used).
  var WEB3FORMS_ACCESS_KEY = '5b5b43c9-47f0-4a4f-8508-36a60a953561';

  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Header + floating button ---------- */
  var header = $('#header');
  var waFloat = $('.wa-float');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    header.classList.toggle('scrolled', y > 10);
    if (waFloat) waFloat.classList.toggle('show', y > 420);
    updateTimeline();
  }
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile drawer ---------- */
  var toggle = $('#menuToggle'), drawer = $('#drawer');
  function setDrawer(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    drawer.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }
  toggle.addEventListener('click', function () { setDrawer(drawer.hidden); });
  $$('a', drawer).forEach(function (a) { a.addEventListener('click', function () { setDrawer(false); }); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !drawer.hidden) setDrawer(false); });

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Compare switch ---------- */
  var compare = $('[data-compare]');
  if (compare) {
    var setSide = function (side) {
      compare.setAttribute('data-state', side);
      $$('.switch button', compare).forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.side === side)); });
      $$('.compare-panel', compare).forEach(function (p) { p.hidden = p.dataset.panel !== side; });
    };
    $$('.switch button', compare).forEach(function (b) { b.addEventListener('click', function () { setSide(b.dataset.side); }); });
    setSide('after');
  }

  /* ---------- Service cards (tap to expand) ---------- */
  $$('.svc-card').forEach(function (card) {
    var flip = function () { card.setAttribute('aria-expanded', String(card.getAttribute('aria-expanded') !== 'true')); };
    card.addEventListener('click', flip);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); flip(); } });
  });

  /* ---------- Timeline progress ---------- */
  var timeline = $('[data-timeline]');
  var steps = timeline ? $$('.step', timeline) : [];
  function updateTimeline() {
    if (!timeline) return;
    var vh = window.innerHeight;
    var r = timeline.getBoundingClientRect();
    var desktop = window.matchMedia('(min-width: 960px)').matches;
    var p = (vh * 0.75 - r.top) / (r.height + (desktop ? vh * 0.15 : 0));
    p = Math.max(0, Math.min(1, p));
    timeline.style.setProperty('--fill', (p * 100).toFixed(1) + '%');
    steps.forEach(function (s, i) {
      var t = desktop ? (i / steps.length) : (s.offsetTop / r.height);
      s.classList.toggle('active', p > t + 0.02 || (p > 0 && i === 0));
    });
  }

  /* ---------- Plans (platform tabs) ---------- */
  var PLANS = {
    Instagram: {
      line: 'Reels, carousels and Stories, posted on a steady rhythm.',
      tiers: [
        ['Consistent Presence', '$450', ['8 Reels a month', '2 carousel posts', '8 Story sets', 'Captions, hashtags & scheduling']],
        ['Audience Growth', '$890', ['18 Reels with motion graphics', '5 carousels', '20 Story sets', 'Hook scripting + bi-weekly reviews']],
        ['Brand Dominance', '$1,450', ['28 Reels, one every day', '8 carousels & brand assets', 'Daily Stories & community care', 'Creative director + weekly reports']]
      ]
    },
    YouTube: {
      line: 'Shorts every week, plus your long-form polished and packaged.',
      tiers: [
        ['Channel Foundation', '$450', ['8 Shorts a month', '1 long-form edit (up to 12 min)', '2 thumbnails & titles', 'Channel setup + monthly review']],
        ['Channel Growth', '$890', ['18 Shorts a month', '3 long-form edits', '4 thumbnails with title tests', 'Creative director + monthly strategy']],
        ['Channel Authority', '$1,450', ['30 Shorts, one every day', '6 flagship long-form videos', '8 premium thumbnails', 'Full channel management + bi-weekly calls']]
      ]
    },
    LinkedIn: {
      line: 'Posts written in your voice, for founders and leaders.',
      tiers: [
        ['Professional Presence', '$450', ['4 posts a month, written for you', 'Strong hooks, clean formatting', 'Content calendar & publishing', 'Monthly report']],
        ['Authority Building', '$890', ['14 posts a month', '2 carousel decks', 'Profile & headline refresh', 'Bi-weekly reviews']],
        ['Industry Authority', '$1,450', ['22 posts, every weekday', '4 carousel decks', '2 newsletter editions a month', 'Full profile management']]
      ]
    },
    X: {
      line: 'Daily posts and threads that keep you in the conversation.',
      tiers: [
        ['Consistent Voice', '$450', ['24 posts a month', '2 breakdown threads', 'Bio & banner copy', 'Monthly growth recap']],
        ['Audience Expansion', '$890', ['55 posts, every day', '6 breakdown threads', 'Your podcasts & blogs turned into posts', 'Bi-weekly reviews']],
        ['Category Authority', '$1,450', ['100+ posts, 3–4 a day', '12 long threads & X Articles', 'Repurposed from all your video & audio', 'Full account management + weekly reviews']]
      ]
    },
    Reddit: {
      line: 'Genuine, value-first posts in the communities that matter.',
      tiers: [
        ['Community Foundation', '$450', ['Subreddit research & rules check', '4 value-first posts', 'Comment monitoring', 'Monthly report']],
        ['Community Expansion', '$890', ['12 posts, guides & teardowns', 'Voice tuned to each community', 'Ongoing comment replies', 'Bi-weekly reports']],
        ['Community Authority', '$1,450', ['22 guides & discussion threads', 'Founder AMA planning & support', 'Daily brand-mention monitoring', 'Detailed monthly reports']]
      ]
    }
  };
  var TIER_NAMES = ['Starter', 'Growth', 'Enterprise'];
  var grid = $('#plansGrid'), line = $('#platformLine');
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function renderPlans(platform) {
    var cfg = PLANS[platform]; if (!cfg || !grid) return;
    line.textContent = cfg.line;
    var html = cfg.tiers.map(function (t, i) {
      var featured = i === 1;
      return '<article class="plan-card' + (featured ? ' featured' : '') + '" style="animation-delay:' + (i * 60) + 'ms">' +
        (featured ? '<span class="plan-badge">Most popular</span>' : '') +
        '<span class="plan-kicker">0' + (i + 1) + ' · ' + TIER_NAMES[i] + '</span>' +
        '<h3>' + esc(t[0]) + '</h3>' +
        '<div class="plan-price">' + esc(t[1]) + ' <small>/ mo</small></div>' +
        '<ul>' + t[2].map(function (d) { return '<li>' + esc(d) + '</li>'; }).join('') + '</ul>' +
        '<a href="#contact" class="btn ' + (featured ? 'btn-accent' : 'btn-ghost') + ' btn-block" data-plan="' + esc(platform + ' · ' + TIER_NAMES[i] + ' (' + t[0] + ', ' + t[1] + '/mo)') + '">Choose ' + TIER_NAMES[i] + '</a>' +
        '</article>';
    }).join('');
    html += '<article class="plan-card custom" style="animation-delay:180ms"><span class="plan-kicker">04 · Custom</span><h3>Build your own</h3><div class="plan-price">Tailored</div>' +
      '<ul><li>Pick your platforms</li><li>Choose your monthly volume</li><li>Mix formats and channels</li><li>Priced together on a call</li></ul>' +
      '<a href="#contact" class="btn btn-ghost btn-block" data-plan="Custom plan (' + esc(platform) + ' + more)">Enquire</a></article>';
    grid.innerHTML = html;
  }
  $$('#platformTabs button').forEach(function (b) {
    b.addEventListener('click', function () {
      $$('#platformTabs button').forEach(function (x) { x.setAttribute('aria-selected', String(x === b)); });
      renderPlans(b.dataset.platform);
    });
  });
  renderPlans('Instagram');

  /* ---------- Audience tabs ---------- */
  var audTabs = $$('.audience-tabs [role="tab"]');
  audTabs.forEach(function (tab, idx) {
    tab.addEventListener('click', function () {
      audTabs.forEach(function (t) {
        var on = t === tab;
        t.setAttribute('aria-selected', String(on));
        document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
      });
    });
    tab.addEventListener('keydown', function (e) {
      var n = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (n) { var next = audTabs[(idx + n + audTabs.length) % audTabs.length]; next.focus(); next.click(); }
    });
  });

  /* ---------- FAQ: one open at a time ---------- */
  var accs = $$('.acc');
  accs.forEach(function (d) {
    d.addEventListener('toggle', function () { if (d.open) accs.forEach(function (o) { if (o !== d) o.open = false; }); });
  });

  /* ---------- Toast + copy ---------- */
  var toastEl = $('#toast'), toastT;
  function toast(msg) {
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { toastEl.classList.remove('show'); }, 2200);
  }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copy');
      var done = function () { toast('Email copied'); b.textContent = 'Copied'; setTimeout(function () { b.textContent = 'Copy'; }, 1800); };
      if (navigator.clipboard && window.isSecureContext) { navigator.clipboard.writeText(v).then(done, function () { prompt('Copy email:', v); }); }
      else { prompt('Copy email:', v); }
    });
  });

  /* ---------- Contact form ---------- */
  var form = $('#contactForm'), statusEl = $('#formStatus'), submitBtn = $('#submitBtn');
  var planField = $('#selectedPlanField'), planInput = $('#planInput');

  function setInterest(val) {
    var r = $('input[name="interest"][value="' + val + '"]', form); if (r) r.checked = true;
  }
  // "Choose plan" buttons prefill the form
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-plan]');
    if (a) {
      planInput.value = a.getAttribute('data-plan');
      planField.hidden = false;
      setInterest('A plan');
      toast('Plan added to your message');
      return;
    }
    if (e.target.closest('[data-book]')) { setInterest('A call'); }
  });

  function data() {
    var fd = new FormData(form);
    return {
      name: (fd.get('name') || '').trim(),
      email: (fd.get('email') || '').trim(),
      phone: (fd.get('phone') || '').trim(),
      link: (fd.get('link') || '').trim(),
      interest: fd.get('interest') || '',
      plan: (fd.get('plan') || '').trim(),
      message: (fd.get('message') || '').trim(),
      botcheck: fd.get('botcheck')
    };
  }
  function waText(d) {
    var parts = ['Hi Thorvon team! I\'m ' + (d.name || 'interested') + '.'];
    if (d.interest) parts.push('Interested in: ' + d.interest);
    if (d.plan) parts.push('Plan: ' + d.plan);
    if (d.link) parts.push('My page: ' + d.link);
    if (d.message) parts.push(d.message);
    if (d.email) parts.push('Email: ' + d.email);
    return WHATSAPP_LINK + '?text=' + encodeURIComponent(parts.join('\n'));
  }
  function validate(d) {
    var ok = true;
    $$('.field', form).forEach(function (f) { f.classList.remove('invalid'); });
    if (!d.name) { form.name.closest('.field').classList.add('invalid'); ok = false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) { form.email.closest('.field').classList.add('invalid'); ok = false; }
    return ok;
  }
  function setStatus(msg, isErr) { statusEl.textContent = msg; statusEl.classList.toggle('error', !!isErr); }

  $('#waSend').addEventListener('click', function () {
    window.open(waText(data()), '_blank', 'noopener');
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var d = data();
    if (d.botcheck) return;
    if (!validate(d)) { setStatus('Please add your name and a valid email.', true); return; }
    submitBtn.disabled = true; submitBtn.innerHTML = 'Sending…';
    setStatus('');
    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'New enquiry — ' + (d.interest || 'Website') + ' — ' + d.name,
        from_name: 'Thorvon Media Website',
        replyto: d.email,
        name: d.name, email: d.email, phone: d.phone || '—', link: d.link || '—',
        interest: d.interest, plan: d.plan || '—', message: d.message || '—'
      })
    }).then(function (r) { return r.json().catch(function () { return {}; }).then(function (j) { return { ok: r.ok, j: j }; }); })
      .then(function (res) {
        if (res.ok && res.j && res.j.success !== false) {
          form.hidden = true; $('#formSuccess').hidden = false;
        } else { throw new Error((res.j && res.j.message) || 'send failed'); }
      })
      .catch(function () {
        setStatus('Couldn\'t send right now. Tap "Send on WhatsApp" and we\'ll get it instantly.', true);
      })
      .then(function () { submitBtn.disabled = false; submitBtn.innerHTML = 'Send <span class="arrow">→</span>'; });
  });

  onScroll();
})();
