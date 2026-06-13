# 🌿 Dharatrack

<div align="center">

**A fluid, nature-inspired carbon footprint awareness platform.**

*Track your impact. Breathe with the forest. Change the world.*

[![Version](https://img.shields.io/badge/version-1.0.0-34d399?style=for-the-badge&logo=leaf&logoColor=white)](https://github.com)
[![License](https://img.shields.io/badge/license-MIT-22d3ee?style=for-the-badge)](LICENSE)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-a3e635?style=for-the-badge)](package.json)
[![Vanilla JS](https://img.shields.io/badge/built_with-Vanilla_JS-f59e0b?style=for-the-badge&logo=javascript&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![No Build Step](https://img.shields.io/badge/build_step-none-6366f1?style=for-the-badge)](https://en.wikipedia.org/wiki/Static_web_page)

---

> *"The Earth does not belong to us. We belong to the Earth."*

---

</div>

## ✨ What is Dharatrack?

Dharatrack is a **zero-dependency, privacy-first carbon footprint tracker** that runs entirely in your browser. No accounts. No servers. No data collection. Just you and your impact on the planet.

The UI is inspired by the beauty of the natural world — lush rainforests, flowing streams, fireflies in the night — because we believe the tools we use to protect the Earth should reflect it.

---

## 🖼️ Screenshots

> Clone the repo and run locally to experience the full animated UI.

| Dashboard | Insights | AI Assistant |
|-----------|----------|--------------|
| Animated footprint gauge with category breakdown | What-If simulator and personalized tips | Context-aware EcoBot chat |

---

## 🌍 Features

### 🧭 Onboarding Quiz
10 beautifully designed questions covering every area of your lifestyle — transport, diet, energy, and shopping. Receives an instant annual footprint estimate with animated results and a global comparison.

### 📊 Interactive Dashboard
- Live animated stat cards (annual, monthly, weekly CO₂)
- Chart.js doughnut for category breakdown
- 14-day trend line chart
- Comparison vs. Global, US, EU, and Paris Agreement targets
- Daily streak tracker

### 📝 Activity Logger
- 16 one-tap quick-add buttons for common activities
- Custom entry form with precise CO₂ inputs
- Full filterable history with delete support
- Real-time toast feedback

### 🤖 EcoBot — AI Assistant
- Conversational chat with typing indicators
- 12-category intent detection engine
- Context-aware responses using your real activity data
- 100+ curated eco-tips ranked by impact
- What-if scenario modeling ("What if I cycled instead?")
- Proactive alerts ("You drove 5 times this week 🚗")
- Optional **Gemini AI** upgrade for generative responses

### 🎯 Goals & Challenges
- Monthly CO₂ budget with live progress bar
- 4 curated 30-day challenges (Meatless Mondays, Pedal Power, etc.)
- Per-challenge daily task tracking

### 💡 Insights & Reports
- Weekly category breakdown
- Interactive What-If toggle simulator
- Personalized tip ranking
- Export to **JSON** and **CSV**

### 🌿 Animated Nature UI
- Floating leaves (🍃🌿☘️🍂🌱) that gently fall across the viewport
- 18 bioluminescent firefly particles drifting through the interface
- 3-layer atmospheric mist that drifts horizontally
- A flowing water stream animation at the bottom of every page
- Unique background image for each route (Rainforest, Misty Stream, Sunny Canopy, Forest Pool)
- Water ripple effect on every click

---

## 🏗️ Architecture

```
dharatrack/
├── index.html                  ← SPA entry point
├── assets/
│   └── images/                 ← Route background images
├── css/
│   ├── variables.css           ← Design tokens (forest green palette)
│   ├── base.css                ← Reset + dynamic route backgrounds
│   ├── animations.css          ← Keyframes & micro-interactions
│   ├── nature.css              ← 🌿 Floating leaves, fireflies, mist
│   ├── components.css          ← Buttons, cards, modals, badges
│   ├── layout.css              ← App shell, sidebar, grid
│   ├── dashboard.css           ← Gauge, charts, feed
│   └── chat.css                ← AI assistant panel
└── js/
    ├── app.js                  ← Boot, route registration
    ├── store.js                ← Reactive localStorage state
    ├── router.js               ← Hash-based SPA router
    ├── components/
    │   ├── nav.js              ← Sidebar navigation
    │   ├── quiz.js             ← 10-question onboarding quiz
    │   ├── dashboard.js        ← Dashboard with charts
    │   ├── logger.js           ← Activity logger
    │   ├── goals.js            ← Goals & challenges
    │   ├── insights.js         ← Insights & What-If
    │   ├── settings.js         ← User settings
    │   └── chat.js             ← EcoBot chat UI
    ├── engine/
    │   ├── calculator.js       ← Emission factors & math
    │   ├── assistant.js        ← EcoBot AI rule engine
    │   ├── tips.js             ← 100+ curated eco-tips
    │   ├── challenges.js       ← 30-day challenge definitions
    │   └── nature.js           ← 🌿 Nature animation engine
    └── utils/
        ├── sanitize.js         ← XSS prevention & validation
        ├── dom.js              ← Safe DOM helpers
        ├── format.js           ← Number/date formatting
        └── accessibility.js   ← ARIA & focus management
```

### Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Core | Vanilla HTML + CSS + ES Modules | Zero build, maximum control |
| Styling | CSS Custom Properties + Glassmorphism | Deep forest green palette |
| State | Reactive localStorage store | Privacy-first, offline-capable |
| Charts | Chart.js 4.x (CDN) | Lightweight, accessible |
| AI | Rule-based engine + optional Gemini API | Works offline, upgradeable |
| Cloud Sync | Firebase Firestore (optional) | Optional cross-device sync |
| Animations | Pure CSS Keyframes + JS engine | Smooth & hardware-accelerated |

---

## 🚀 Getting Started

### Prerequisites
- Any modern browser (Chrome, Firefox, Safari, Edge)
- A local server (ES Modules require it — no `file://` support)

### Quick Start

```bash
# 1. Clone
git clone https://github.com/YOUR_USERNAME/dharatrack.git
cd dharatrack

# 2. Serve
npx serve . -l 3000

# 3. Open
# http://localhost:3000
```

> **That's it.** No `npm install`. No build step. No config files.

---

## 🧪 Tests

Open the test suite in your browser:

```
http://localhost:3000/tests/test-runner.html
```

**50+ unit tests** covering:

| Module | Tests |
|--------|-------|
| Calculator | 12 — emission factors, quiz mapping, rating |
| Sanitize | 14 — XSS vectors, validation, escaping |
| Tips | 5 — DB integrity, filtering, relevance |
| Challenges | 4 — CRUD, progress |
| Assistant | 8 — intent detection, response gen |
| Format | 5 — CO₂ formatting, date utils |

---

## 🤖 AI Setup (Optional)

Dharatrack works fully offline with its built-in rule-based AI. For generative AI responses, add your Gemini API key in **Settings → AI Configuration**.

```
Settings → AI Configuration → Paste Gemini API Key → Save
```

---

## ☁️ Firebase Setup (Optional)

For cross-device cloud sync, create a Firebase project and paste your config in **Settings → Cloud Sync**.

```javascript
// Found in js/store.js — replace with your config
const firebaseConfig = {
  apiKey: "...",
  projectId: "...",
  // ...
};
```

Then enable **Cloud Sync** in Settings.

---

## 📊 Emission Factor Sources

| Source | Used For |
|--------|----------|
| [EPA](https://www.epa.gov/energy/greenhouse-gas-equivalencies-calculator) | US grid electricity, vehicle emissions |
| [DEFRA 2023](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2023) | Transport, energy factors |
| [IPCC AR6](https://www.ipcc.ch/assessment-report/ar6/) | Global warming potentials |
| [Our World in Data](https://ourworldindata.org/food-ghg-emissions) | Diet emissions |
| [IEA](https://www.iea.org/data-and-statistics) | Grid factors by country |

---

## 🔒 Security & Privacy

- ✅ **Zero network requests** for user data — everything stays local
- ✅ **XSS prevention** — all user input sanitized before DOM insertion
- ✅ **Content Security Policy** — restricts script sources via CSP header
- ✅ **No `eval()`** — ever
- ✅ **No cookies** — only `localStorage`
- ✅ **No accounts** — no registration, no login, no tracking

---

## ♿ Accessibility

- Semantic HTML5 (`<main>`, `<nav>`, `<aside>`, `<header>`)
- Full ARIA roles, labels, and `aria-live` announcements
- Keyboard navigable — tab order, Enter/Space, skip-to-content
- Focus trapping in modals and chat panel
- WCAG AA color contrast on all text
- `prefers-reduced-motion` disables all animations
- Responsive from 320px → 1440px+

---

## 👨‍💻 About the Author

🔭 Exploring the intersection of hardware & software
💻 Skilled in low-level programming (C/C++) and performance-driven computing
🕵️ Cybersecurity learner working on network security & penetration testing
⚡ Fascinated by GPU architectures, HPC clusters, and quantum algorithms
🎯 Goal: To contribute in cutting-edge computing research & security

---

## 📄 License

MIT — see [LICENSE](LICENSE).

---

<div align="center">

**Built with 💚 for the planet**

*Dharatrack — because the Earth deserves better tools.*

🌍 · 🌿 · 💧 · 🌊 · ✨

</div>
