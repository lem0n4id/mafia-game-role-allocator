# Mafia Game Role Allocator — Copilot Instructions

> 📖 **For detailed patterns, code examples, and architectural decisions, see [COPILOT_DETAILED_GUIDE.md](./COPILOT_DETAILED_GUIDE.md)**

## Quick Start
This is a mobile-first, React 18 + Vite web app for allocating roles in Mafia games. No backend, no persistence—just frontend-only role allocation with sequential reveal flow.

### Essential Commands
```bash
npm install          # Install dependencies
npm run dev          # Start development server
npm run dev:mobile   # Dev server with network access for mobile testing
npm run build        # Build for production
npm run lint         # Check code quality with ESLint
npm run format       # Format code with Prettier
```

## Tech Stack
- **React 18** - Functional components with Hooks
- **Vite** - Fast development and optimized builds
- **Tailwind CSS v3.4.17** - ⚠️ **DO NOT upgrade to v4+ without testing**
- **ESLint + Prettier** - Code quality and formatting

## Project Principles
1. **Mobile-first**: Portrait layout, 44px+ touch targets
2. **Lightweight**: Frontend-only, no backend/persistence
3. **Simple**: Mafia vs Villagers only (no advanced roles)
4. **Performance**: Load <2s, interactions <200ms, bundle <500KB

## Core User Flow
Input & Validation → Allocation (with confirmation) → Sequential Reveal → Reset/Re-Allocate

## Key Architecture Patterns

### Component Organization
- **Custom Hooks**: State management logic (e.g., `usePlayerCountManager`, `useMafiaCountValidation`)
- **Components**: UI rendering with prop-based communication
- **Utils**: Pure functions for validation, role registry, mobile layout helpers
- See [COPILOT_DETAILED_GUIDE.md](./COPILOT_DETAILED_GUIDE.md) for complete pattern examples

### File Structure
```
src/
├── components/       # React components (PlayerCountManager, etc.)
├── hooks/            # Custom React hooks for state management
├── utils/            # Pure utilities (roleRegistry, validation, etc.)
├── App.jsx           # Root component
└── main.jsx          # Entry point
```

## Critical Requirements

### ⚠️ Tailwind CSS Version Lock
**NEVER upgrade to Tailwind v4+ without extensive testing!**
- ✅ Required: v3.4.x
- ❌ Incompatible: v4.x+ (breaks PostCSS config)

### Code Quality Standards
- Use ESLint + Prettier (configured)
- Prefer functional components with Hooks
- Mobile-first responsive design
- Write self-documenting code
- Add JSDoc for complex functions

### Performance Standards
- Lint execution: <5s
- Build time: <3s
- Bundle size: <500KB (warnings at 400KB)

## Development Workflow
1. Make minimal, focused changes
2. Test early and often (`npm run lint && npm run build`)
3. Use existing patterns (see detailed guide)
4. Update documentation when changing architecture
5. Keep state management simple (in-memory only)

## Documentation
All changes that modify architecture, add components, or introduce new patterns must update:
- This file (copilot-instructions.md) - High-level overview
- [COPILOT_DETAILED_GUIDE.md](./COPILOT_DETAILED_GUIDE.md) - Detailed patterns
- `DEVELOPMENT.md` - Implementation status
- Related docs in `docs/` directory

## Product Requirements Summary

### Input & Validation
- Dynamic player name fields (3-30 players)
- Mafia count validation with edge case handling
- Block invalid configurations, warn on edge cases

### Role Allocation
- Confirmation dialog before allocation
- Fisher-Yates shuffle for fairness
- Re-allocation clears previous state

### Role Reveal
- Sequential reveal with strict order enforcement
- One dialog at a time
- Visual differentiation (Mafia=red, Villager=green)
- Sticky current player indicator

### Reset Flow
- Returns to input screen
- Preserves player names
- Clears all allocations and reveal state

## Non-Goals
❌ Advanced roles (Doctor, Detective, etc.)
❌ Backend, persistence, or analytics
❌ Chat, timers, voting, or scoring
❌ Heavy UI libraries

## Need More Details?
See [COPILOT_DETAILED_GUIDE.md](./COPILOT_DETAILED_GUIDE.md) for:
- Complete code pattern examples
- Detailed component architecture
- Architectural decisions log
- Product behavior specifications
- Documentation update protocols
- Project automation details
