# Mafia Game Role Allocator

![Status](https://img.shields.io/badge/status-in%20development-yellow)
![License](https://img.shields.io/badge/license-MIT-blue)

A lightweight, mobile-only web app that lets a host quickly enter player names and randomly allocate Mafia/Villager roles. Optimized for clarity and speed on phones with a simple, portrait-only UI.

## 🎯 What it does

- Input & Validation
  - Enter total players and number of Mafia
  - Dynamic player-name fields add/remove with player count
  - Blocks blank names; allows duplicate names
  - Prevents invalid Mafia counts (≥ players) with error/confirmation
- Role Allocation
  - "Allocate Roles" asks for confirmation, then assigns roles randomly
  - Re-click reshuffles all roles
- Role Display & Reveal
  - Vertical list of player cards; only one reveal dialog at a time
  - Strict reveal order with a current-player cue at the top
  - "Reveal Role" → shows role → button switches to "Close"; roles remain visible
- Reset / Re-Allocate
  - Reset returns to input screen, keeps names prefilled, clears allocations
- Edge Cases & UX
  - Allows Mafia = 0 or Mafia = players (warns/confirm)
  - Double-taps on buttons don’t break the flow

## 🚀 Quick Start

Prerequisites
- Node.js 20
- npm

Install
```bash
npm install
```

Develop
```bash
npm run dev
```

Build
```bash
npm run build
```

Preview (optional)
```bash
npm run preview
```

## 🏗️ Tech Stack
- React 18 (functional components + Hooks)
- Vite (build tool and dev server)
- Tailwind CSS v3.4.17 (strictly v3)
- JavaScript (no TypeScript)
- Frontend-only; no backend, analytics, or persistence

## 📐 Architecture (suggested)
```
src/
├── components/
│   ├── InputForm.jsx        # Players count, Mafia count, dynamic name inputs
│   ├── CardsList.jsx        # Vertical list of player cards
│   ├── RevealDialog.jsx     # Single active reveal/close dialog
│   ├── HeaderCue.jsx        # Current player cue at top
│   └── FooterReset.jsx      # Reset button after allocation
├── hooks/
│   ├── useValidation.js     # Blank names, mafia < players, warnings
│   ├── useAllocation.js     # Confirmation + random role assignment (shuffle)
│   └── useRevealFlow.js     # Enforce strict order, one open dialog
├── utils/
│   └── shuffle.js           # Fisher–Yates shuffle
├── styles/                  # (optional) Tailwind entry and minimal globals
└── App.jsx                  # Compose screens/flows
```

## 📈 Performance Targets
- Load < 2s on mobile
- Button/reveal interactions < 200ms
- JS bundle < 500KB

## 📚 Documentation
- Product Requirements: [PRD.md](./PRD.md)
- Development Guide: [DEVELOPMENT.md](./DEVELOPMENT.md)
- Copilot Instructions: [copilot-instructions.md](./.github/copilot-instructions.md)

## 🛫 Deployment
- Build produces `dist/`. Deploy statically (e.g., Vercel, Netlify, GitHub Pages).
- Ensure mobile viewport meta and HTTPS when hosting.

## 🤝 Contributing
- Follow documentation update protocol in `copilot-instructions.md`.
- Keep terminology consistent with the UI ("Allocate Roles", "Reset").

## 📜 License
MIT License. See [LICENSE](./LICENSE).
