# Epic Architecture Specification: Reset & Re-Allocate

## 1. Epic Architecture Overview

This epic implements a comprehensive reset mechanism that safely transitions the application from any reveal state back to the input phase while preserving user-entered names. The architecture focuses on state cleanup, navigation management, and data preservation patterns to ensure reliable reset operations that can be triggered at any point during or after allocation.

Key properties:
- Safe state transition from reveal/allocation phases back to input phase
- Selective state preservation (names retained) with complete cleanup of allocation/reveal data
- Reset capability during active reveal dialogs with proper cleanup and focus return
- Idempotent reset operations with confirmation patterns for critical state transitions
- Performance-optimized state cleanup targeting <200ms reset completion
- Memory-efficient state management preventing data leaks between sessions

## 2. System Architecture Diagram

```mermaid
flowchart TB
  %% Color definitions
  classDef user fill:#fef3c7,stroke:#d97706,color:#78350f;
  classDef component fill:#d1fae5,stroke:#10b981,color:#065f46;
  classDef hook fill:#dbeafe,stroke:#3b82f6,color:#1e3a8a;
  classDef reset fill:#fef2f2,stroke:#f87171,color:#7f1d1d;
  classDef state fill:#f3e8ff,stroke:#8b5cf6,color:#581c87;
  classDef preserve fill:#f0fdf4,stroke:#22c55e,color:#14532d;

  subgraph UL[User Layer]
    HOST[Host on Mobile Device]:::user
  end

  subgraph CL[Component Layer]
    RESET_BTN[ResetButton Component]:::component
    RESET_MODAL[ResetConfirmationModal]:::reset
    CARDS_SCREEN[CardsScreen Context]:::component
  end

  subgraph HL[Hook Layer]
    USE_RESET[useReset Hook]:::hook
    USE_STATE_CLEANUP[useStateCleanup Hook]:::hook
    USE_NAVIGATION[useNavigation Hook]:::hook
  end

  subgraph RL[Reset Layer]
    STATE_CLEANER[State Cleanup Manager]:::reset
    PRESERVATION[Data Preservation Manager]:::preserve
    NAVIGATION_MGR[Navigation Manager]:::reset
  end

  subgraph SL[State Layer]
    INPUT_STATE[Input State - preserved names]:::preserve
    ALLOCATION_STATE[Allocation State - cleared]:::state
    REVEAL_STATE[Reveal State - cleared]:::state
    DIALOG_STATE[Dialog State - cleared]:::state
    NAV_STATE[Navigation State - current screen]:::state
  end

  %% User interactions
  HOST --> RESET_BTN
  HOST --> RESET_MODAL

  %% Component relationships
  CARDS_SCREEN --> RESET_BTN
  RESET_BTN --> RESET_MODAL

  %% Hook usage
  RESET_BTN --> USE_RESET
  RESET_MODAL --> USE_STATE_CLEANUP
  USE_RESET --> USE_NAVIGATION

  %% Reset operations
  USE_RESET --> STATE_CLEANER
  USE_STATE_CLEANUP --> PRESERVATION
  USE_NAVIGATION --> NAVIGATION_MGR

  %% State operations
  STATE_CLEANER --> ALLOCATION_STATE
  STATE_CLEANER --> REVEAL_STATE
  STATE_CLEANER --> DIALOG_STATE
  PRESERVATION --> INPUT_STATE
  NAVIGATION_MGR --> NAV_STATE

  %% Data flows
  ALLOCATION_STATE -.-> |"Clear"| STATE_CLEANER
  REVEAL_STATE -.-> |"Clear"| STATE_CLEANER
  DIALOG_STATE -.-> |"Clear"| STATE_CLEANER
  INPUT_STATE -.-> |"Preserve"| PRESERVATION
  NAV_STATE --> |"Navigate to Input"| NAVIGATION_MGR
```

Notes:
- Reset can be triggered from any screen state including during active dialogs
- Data preservation ensures user-entered names survive the reset operation
- State cleanup prevents memory leaks and ensures clean re-allocation capability

## 3. High-Level Features & Technical Enablers

### Features
- **Reset Button Placement**: Accessible reset button on cards screen after allocation
- **Safe State Cleanup**: Complete cleanup of allocation and reveal state without affecting input data
- **Name Preservation**: Automatic prefilling of previously entered names after reset
- **Dialog-Safe Reset**: Reset capability during active reveal dialogs with proper cleanup
- **Navigation Management**: Smooth transition back to input screen with proper state restoration
- **Confirmation Flow**: Optional lightweight confirmation for reset operations

### Technical Enablers
- **useReset Hook**: Central reset orchestration with state cleanup coordination
- **useStateCleanup Hook**: Selective state cleanup logic preserving critical user data
- **useNavigation Hook**: Screen transition management with state restoration
- **State Cleanup Manager**: Automated cleanup of allocation and reveal-specific state
- **Data Preservation Manager**: Selective preservation of user-entered names and settings
- **Navigation Manager**: Safe screen transitions with proper state handoff
- **Reset Guards**: Idempotency and safety checks for reset operations

## 4. Technology Stack
- React 18 (useState, useCallback, custom cleanup hooks)
- Tailwind CSS v3.4.17 (button styling, modal design, mobile-optimized layouts)
- JavaScript (state management, navigation patterns, memory cleanup)
- React Router or state-based navigation for screen transitions
- Mobile browser APIs for performance monitoring and memory management

## 5. Technical Value
**Value: Medium-High**
- Enables reliable recovery from configuration mistakes without data loss
- Establishes reusable state cleanup patterns for the application
- Ensures memory efficiency and prevents state pollution between game sessions
- Creates foundation for potential future features requiring state reset capabilities

## 6. T-Shirt Size Estimate
**Size: S-M (≈ 0.5-1 day)**
- State cleanup logic is straightforward but requires careful testing
- Navigation management adds some complexity
- Integration testing with all possible reset trigger points
- Preservation logic needs validation across different input configurations

## Context Template
- **Epic PRD**: `docs/ways-of-work/plan/reset-and-reallocate/epic.md`