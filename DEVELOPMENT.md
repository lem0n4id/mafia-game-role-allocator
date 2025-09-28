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
- ✅ **Epic PRDs authored** and added under `docs/ways-of-work/plan/*/epic.md`, including "Alternative / Edge Cases" (covers user stories 25–30). No application code yet; implementation will start with Phase 1 scaffolding.
- ✅ **Architecture specs added** for all phases (1–6) and Alternative / Edge Cases under `docs/ways-of-work/plan/*/arch.md`.
- ✅ **Feature PRDs created** for ALL epics, broken down into 18 implementable features:
  - **Setup & Project Scaffolding (4 features)**: Vite React Initialization, Tailwind Integration, Development Tooling, Mobile Optimization
  - **Input & Validation (3 features)**: Player Count Management, Mafia Count Validation, Player Name Input System  
  - **Role Allocation (3 features)**: Allocation Confirmation Flow, Role Assignment Engine, Re-allocation System
  - **Role Display & Reveal (3 features)**: Card List Interface, Role Reveal Dialog, Sequential Order Enforcement
  - **Reset & Re-Allocate (1 feature)**: Reset Button System
  - **Minimal Styling & UI Clarity (2 features)**: Visual Differentiation System, Mobile Layout Optimization
  - **Alternative & Edge Cases (2 features)**: Edge Case Validation, Error Recovery System
- ✅ **Implementation plans completed** for ALL 18 features with complete technical specifications:
  - **React component implementations** with hooks, state management, and prop interfaces
  - **System architecture diagrams** with mermaid flowcharts showing data flow and integration
  - **Performance optimization** strategies for mobile-first responsive design
  - **Accessibility compliance** with WCAG AA standards and mobile screen reader support
  - **Step-by-step implementation** instructions with clear dependency management
  - Location: `docs/ways-of-work/plan/{epic-name}/{feature-name}/implementation-plan.md`
- ✅ **Prompt template created** for consistent implementation plan generation:
  - **Location**: `.github/prompts/breakdown-feature-implementation.prompt.md`
  - **System architecture documentation** with Mermaid diagrams and integration patterns
  - **Database schema design** with ERD specifications and migration strategies  
  - **API design guidelines** with tRPC endpoints and TypeScript definitions
  - **Frontend component hierarchy** with state management and custom components
  - **Security and performance** optimization with deployment architecture
  - Used to generate all 18 implementation plans with consistent technical standards

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
- Vite (dev server + build pipeline)
- Tailwind CSS v3.4.17 (strictly v3)
- JavaScript only (no TypeScript)
- Frontend-only; no backend; no analytics; no persistence

## Development Phases (from PRD)

### Phase 1: Setup & Project Scaffolding ✅ **Feature PRDs COMPLETE**
**Feature Breakdown** (each can be developed independently):
- [ ] **Vite React Initialization** - Core project setup with React 18 and Vite build pipeline
- [ ] **Tailwind Integration** - CSS framework integration with mobile-first configuration  
- [ ] **Development Tooling** - ESLint, Prettier, npm scripts, code quality enforcement
- [ ] **Mobile Optimization** - Viewport configuration, performance budgets, mobile patterns

### Phase 2: Input & Validation ✅ **Feature PRDs COMPLETE**
**Feature Breakdown** (each can be developed independently):
- [ ] **Player Count Management** - Dynamic field generation based on player count input
- [ ] **Mafia Count Validation** - Ratio validation preventing impossible game configurations
- [ ] **Player Name Input System** - Name collection with blank prevention and duplicate support

### Phase 3: Role Allocation ✅ **Feature PRDs COMPLETE** 
**Feature Breakdown** (each can be developed independently):
- [ ] **Allocation Confirmation Flow** - Confirmation gateway with parameter display before allocation
- [ ] **Role Assignment Engine** - Fisher-Yates shuffle with mathematically fair randomization
- [ ] **Re-allocation System** - Independent reshuffling with complete state cleanup

### Phase 4: Role Display & Reveal ✅ **Feature PRDs COMPLETE**
**Feature Breakdown** (each can be developed independently):
- [ ] **Card List Interface** - Organized player display with mobile-optimized layout
- [ ] **Role Reveal Dialog** - Private role viewing with secure reveal/close workflow
- [ ] **Sequential Order Enforcement** - Strict order control with prominent current player cue

### Phase 5: Reset / Re-Allocate ✅ **Feature PRDs COMPLETE**
**Feature Breakdown** (each can be developed independently):
- [ ] **Reset Button System** - State cleanup returning to input with name preservation

### Phase 6: Minimal Styling & UI Clarity ✅ **Feature PRDs COMPLETE**
**Feature Breakdown** (each can be developed independently):
- [ ] **Visual Differentiation System** - Clear element styling using Tailwind utilities
- [ ] **Mobile Layout Optimization** - Touch-friendly responsive design patterns

### Phase 7: Alternative & Edge Cases ✅ **Feature PRDs COMPLETE**
**Feature Breakdown** (each can be developed independently):
- [ ] **Edge Case Validation** - 0/all Mafia handling with appropriate confirmations
- [ ] **Error Recovery System** - Double-tap protection and workflow continuity

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
