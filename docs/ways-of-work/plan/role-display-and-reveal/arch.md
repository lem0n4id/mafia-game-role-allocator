# Epic Architecture Specification: Role Display & Reveal

## 1. Epic Architecture Overview

This epic implements a strict sequential role reveal system on a single shared mobile device. The architecture centers on dialog state management, order enforcement, and accessibility patterns to ensure only one player can view their role at a time while maintaining clear progression through the player list. The system uses controlled dialog components with focus management and persistent role visibility after reveal.

Key properties:
- Single active dialog enforcement with automatic closure of competing dialogs
- Strict order validation preventing out-of-sequence reveals
- Persistent current player cue and role visibility state management
- Mobile-optimized dialog with focus trap and accessibility features
- Performance-optimized reveal transitions targeting <200ms interaction latency
- Clean state transitions between reveal phases and potential reset flows

## 2. System Architecture Diagram

```mermaid
flowchart TB
  %% Color definitions
  classDef user fill:#fef3c7,stroke:#d97706,color:#78350f;
  classDef component fill:#d1fae5,stroke:#10b981,color:#065f46;
  classDef hook fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a;
  classDef dialog fill:#fff7ed,stroke:#fb923c,color:#9a3412;
  classDef state fill:#f3e8ff,stroke:#8b5cf6,color:#581c87;
  classDef guard fill:#fee2e2,stroke:#ef4444,color:#7f1d1d;

  subgraph UL[User Layer]
    PLAYERS[Players on Shared Mobile Device]:::user
  end

  subgraph CL[Component Layer]
    CARDS_LIST[CardsList Component]:::component
    PLAYER_CARD[PlayerCard Components]:::component
    CURRENT_CUE[CurrentPlayerCue]:::component
    REVEAL_DIALOG[RevealRoleDialog]:::dialog
    DIALOG_OVERLAY[DialogOverlay]:::dialog
  end

  subgraph HL[Hook Layer]
    USE_REVEAL_FLOW[useRevealFlow Hook]:::hook
    USE_DIALOG[useDialog Hook]:::hook
    USE_ORDER[useOrderEnforcement Hook]:::hook
  end

  subgraph GL[Guard Layer]
    ORDER_GUARD[Reveal Order Guard]:::guard
    DIALOG_GUARD[Single Dialog Guard]:::guard
    IDEMPOTENCY[Action Idempotency Guard]:::guard
  end

  subgraph SL[State Layer]
    REVEAL_STATE[Reveal State - currentPlayerIndex, revealedPlayers]:::state
    DIALOG_STATE[Dialog State - activeDialog, focusReturn]:::state
    CARD_STATE[Card State - individual card reveal status]:::state
    ALLOCATION_STATE[Allocation State - from Phase 3]:::state
  end

  %% User interactions
  PLAYERS --> PLAYER_CARD
  PLAYERS --> REVEAL_DIALOG
  PLAYERS --> CURRENT_CUE

  %% Component relationships
  CARDS_LIST --> PLAYER_CARD
  CARDS_LIST --> CURRENT_CUE
  PLAYER_CARD --> REVEAL_DIALOG
  REVEAL_DIALOG --> DIALOG_OVERLAY

  %% Hook usage
  CARDS_LIST --> USE_REVEAL_FLOW
  PLAYER_CARD --> USE_ORDER
  REVEAL_DIALOG --> USE_DIALOG

  %% Guard enforcement
  USE_ORDER --> ORDER_GUARD
  USE_DIALOG --> DIALOG_GUARD
  PLAYER_CARD --> IDEMPOTENCY

  %% State dependencies
  USE_REVEAL_FLOW --> REVEAL_STATE
  USE_REVEAL_FLOW --> CARD_STATE
  USE_DIALOG --> DIALOG_STATE
  USE_ORDER --> ALLOCATION_STATE
  ORDER_GUARD --> REVEAL_STATE
  DIALOG_GUARD --> DIALOG_STATE

  %% State flows
  ALLOCATION_STATE --> REVEAL_STATE
  REVEAL_STATE --> CARD_STATE
  CARD_STATE --> DIALOG_STATE
```

Notes:
- Single dialog enforcement ensures no information leaks between players
- Order guards prevent out-of-sequence reveals maintaining game integrity
- All state management occurs client-side with React hooks and guards

## 3. High-Level Features & Technical Enablers

### Features
- **Sequential Card List**: Vertical scrolling list of player cards with reveal status indicators
- **Current Player Cue**: Persistent top-of-screen indicator showing whose turn it is to reveal
- **Single Dialog Enforcement**: Only one reveal dialog can be active at any time
- **Reveal/Close Flow**: Button transitions from "Reveal Role" to "Close" with persistent role display
- **Order Enforcement**: Strict sequential reveal preventing out-of-turn access
- **Accessibility Support**: Focus management, screen reader support, and keyboard navigation

### Technical Enablers
- **useRevealFlow Hook**: Central state management for reveal progression and player order
- **useDialog Hook**: Modal state management with focus trap and return focus handling
- **useOrderEnforcement Hook**: Validation logic preventing out-of-sequence reveals
- **Order Guard System**: Real-time validation of reveal eligibility by player index
- **Dialog Guard System**: Automatic closure of competing dialogs and state cleanup
- **Idempotency Guards**: Debouncing and state guards preventing duplicate actions
- **Accessibility Components**: ARIA-compliant dialog with proper focus management

## 4. Technology Stack
- React 18 (useState, useRef for focus management, custom hooks)
- Tailwind CSS v3.4.17 (dialog styling, card differentiation, mobile-first design)
- JavaScript (no TypeScript, focus management APIs, dialog accessibility patterns)
- HTML5 dialog element or div-based modal with proper ARIA attributes
- Mobile browser APIs (focus, viewport, touch event handling)

## 5. Technical Value
**Value: High**
- Implements the core game experience with strict integrity controls
- Establishes reusable dialog and order enforcement patterns
- Creates accessibility foundation that scales to other modal interactions
- Ensures reliable state transitions between allocation and potential reset phases

## 6. T-Shirt Size Estimate
**Size: L (≈ 2 days)**
- Dialog accessibility and focus management add complexity
- Order enforcement logic requires careful state coordination
- Mobile dialog UX needs extensive device testing
- Integration with allocation state and reset flows requires thorough validation

## Context Template
- **Epic PRD**: `docs/ways-of-work/plan/role-display-and-reveal/epic.md`