# Mafia Game Role Allocator — Development Setup

## Getting Started

### Prerequisites
- Node.js 20
- npm (comes with Node)

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview (optional)
```bash
npm run preview
```

## Documentation Status
- Epic PRDs authored and added under `docs/ways-of-work/plan/*/epic.md`, including "Alternative / Edge Cases" (covers user stories 25–30). No application code yet; implementation will start with Phase 1 scaffolding.

## Project Structure (suggested)

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

## Tech Stack
- React 18 (functional components + Hooks)
- Vite (build tool and dev server)
- Tailwind CSS v3.4.17 (strictly v3)
- JavaScript only (no TypeScript)
- Frontend-only; no backend; no analytics; no persistence

## Development Phases (from PRD)

### Phase 1: Setup & Project Scaffolding
- [ ] Initialize Vite + React 18 project
- [ ] Integrate Tailwind CSS v3.4.17
- [ ] Add basic file structure

### Phase 2: Input & Validation
- [ ] Number of Players input
- [ ] Number of Mafia input
- [ ] Dynamic player name fields (add/remove with count)
- [ ] Block blank names; allow duplicates
- [ ] Validate mafia < players (warn/confirm for 0 or all)

### Phase 3: Role Allocation
- [ ] "Allocate Roles" button
- [ ] Confirmation prompt before allocation
- [ ] Random assignment (exact mafia count; rest villagers)
- [ ] Re-allocation reshuffles all roles

### Phase 4: Role Reveal & Card Flow
- [ ] Vertical card list UI
- [ ] Single card reveal dialog
- [ ] Strict reveal order enforcement
- [ ] Current player cue visible at top
- [ ] Reveal → Close flow; role remains visible

### Phase 5: Reset / Re-Allocate
- [ ] Reset button on cards screen
- [ ] Return to inputs with names prefilled
- [ ] Clear previous allocations

### Phase 6: Minimal Styling & UI Clarity
- [ ] Mobile-first, portrait-only layout
- [ ] Clear visual differentiation for cards/buttons
- [ ] Maintain lightweight bundle and responsiveness

### Phase 7: Testing & QA
- [ ] Manual test full workflow on mobile
- [ ] Validate edge cases (0/all mafia, double-tap)
- [ ] Verify performance budgets (load <2s, tap <200ms)

## Available Scripts (typical Vite)
- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm run preview` — Preview production build

## State & Logic (guidance)
- Use React `useState` / `useReducer`; keep all state in memory
- `useValidation.js`: ensure no blanks; mafia < players; show errors/confirmations
- `useAllocation.js`: build roles list by mafia count, Fisher–Yates shuffle, map to players
- `useRevealFlow.js`: index-based enforcement of reveal order; guard against multiple open dialogs

## Testing Checklist (minimum)
- [ ] Happy path: e.g., 8 players, 2 mafia → allocate → reveal sequentially → reset
- [ ] Validation: block blanks; prevent mafia ≥ players; allow duplicates
- [ ] Re-allocation: clicking again reshuffles roles
- [ ] Reveal flow: single dialog; role persists after reveal; close then pass device
- [ ] Reset: returns to inputs; names retained; allocations cleared
- [ ] Performance: quick load and responsive taps on mobile

## Contributing
- Follow `copilot-instructions.md` for documentation updates and acceptance criteria
- Keep terminology consistent with UI ("Allocate Roles", "Reset", etc.)
