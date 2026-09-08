# THORVON MEDIA — Minimalist Editorial Website & Interactive Tools

A minimalist, premium, typography-focused website for **THORVON MEDIA**, featuring two custom interactive experiences:
* **BUILD YOUR THORVON PLAN**: An Apple-style 3-step configurator with live investment calculations and WhatsApp dispatch.
* **BRAND PRESENCE SCORE**: A 60-second assessment tool measuring PR, content, and influencer presence, with personalized opportunity insights.

---

## Creative Direction & Design Principles

* **Aesthetic**: Minimalist, premium, bold, modern, clean, editorial.
* **Palette**: High-contrast black and white.
* **Typography**: Apple-inspired system fonts (`SF Pro Display` / `SF Pro Text`, with `Inter` and `Helvetica Neue` fallbacks).
* **Interactions**: Calm scroll reveals, smooth modal overlays, tactile inverted selection states, and live plan recalculations.
* **Content Integrity**: Strictly adheres to the provided services (PR, Content, Influencer Management) — zero fake testimonials, stock badges, or invented statistics.

---

## File Structure

```
thorvon-media/
├── index.html       # Clean semantic HTML5 layout & interactive modal markup
├── styles.css       # Monochromatic editorial styling, configurator grid & assessment bars
├── script.js        # Configurator state machine, PricingConfig, Score engine & LeadSubmissionHandler
└── README.md        # Documentation and setup instructions
```

---

## How to Preview & Run

### Option 1: Live Server (Currently Active)
Visit: **[http://localhost:8000](http://localhost:8000)**

### Option 2: Run with Python Local Server
```bash
python -m http.server 8000
```

### Option 3: Direct Browser Preview
Double-click `index.html` in your file explorer to open it in any modern browser.

---

## Managing Pricing (`PricingConfig`)

All 25 services across PR, Content, and Influencer Management are managed in a centralized catalog in [script.js](file:///C:/Users/User/.gemini/antigravity/scratch/thorvon-media/script.js#L19-L56):

```javascript
const PricingConfig = [
  // Fixed price:
  { id: 'cnt_video_editing', label: 'Video Editing', category: 'content', price: 15000, minPrice: null, maxPrice: null, enabled: true },
  
  // Price range:
  { id: 'pr_founder', label: 'Founder PR', category: 'pr', price: null, minPrice: 50000, maxPrice: 100000, enabled: true },
  
  // Neutral consultation state (default):
  { id: 'inf_mgmt', label: 'Influencer Management', category: 'influence', price: null, minPrice: null, maxPrice: null, enabled: true }
];
```

* **Neutral State**: While prices are `null`, the live summary displays: **"Pricing calculated after consultation"**.
* **Disabling Services**: Set `enabled: false` to hide any service from the configurator without altering HTML.

---

## Connecting Leads (`LeadSubmissionHandler`)

When a user clicks **GET MY CUSTOM PLAN →**, the plan payload is passed to `LeadSubmissionHandler.submit(planData)` in [script.js](file:///C:/Users/User/.gemini/antigravity/scratch/thorvon-media/script.js#L68-L82).

The payload contains:
* User name, contact (Email / WhatsApp), company, and notes
* Selected categories and exact service requirements
* Custom requirement text (if provided)
* Estimated investment (calculated figure or consultation note)
* Brand Presence Score (if user took the assessment prior to configuring their plan)
* Timestamp

You can easily forward this payload to your webhook (e.g. Make, Zapier, n8n), CRM, or email service.

Additionally, clicking **Chat on WhatsApp →** generates an automated, formatted WhatsApp message with their exact plan summary pre-filled for instant conversation.

---

## Active Contact Channels

Contact actions are presented as clean, minimalist buttons (without exposing raw phone numbers or email addresses on the screen):
* **Call →**: Opens phone dialer (`tel:+916000156191`)
* **WhatsApp →**: Opens WhatsApp chat (`https://wa.me/917002889463`)
* **Email →**: Opens default email composer (`mailto:thorvonmedia@gmail.com`)

To update any contact value, edit the `ContactConfig` object in [script.js](file:///C:/Users/User/.gemini/antigravity/scratch/thorvon-media/script.js#L9-L18):
```javascript
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
```
