# Epic Product Requirements Document: Role Display & Reveal

## Epic Name

Role Display & Reveal

## Goal

### Problem
After roles are allocated, the app must reveal them in a way that prevents leaks and confusion while keeping the flow fast on a single shared mobile device. Without a strict order, single active dialog, and clear button transitions, players can reveal out of turn or accidentally close/show the wrong card.

### Solution
Implement a vertical card list with a strict sequential reveal flow:
- Show the current player cue at the top at all times
- Only one reveal dialog open at a time
- Each card has a "Reveal Role" button that, once pressed, shows the role and switches to "Close"
- Role remains visible after reveal; closing the dialog returns to the list without hiding the revealed role
- Enforce strict reveal order: only the next player can open their dialog

### Impact
- Minimizes information leaks and confusion
- Keeps the shared-device flow smooth and predictable
- Reduces accidental mis-taps and preserves game integrity

## User Personas

- Host: Oversees the reveal sequence and ensures order is followed
- Players: Reveal roles in sequence on a shared mobile device

## High-Level User Journeys

1. App displays current player cue at the top
2. Player 1 taps "Reveal Role" on their card; dialog opens and shows role
3. Button changes to "Close"; player taps close and hands device to next player
4. Only Player 2’s card is enabled for reveal next; others are disabled
5. Process repeats until all players have revealed

## Business Requirements

### Functional Requirements
- Vertical list of player cards
- Strict reveal order enforced; only the next player’s card can open the dialog
- Single active dialog at any time; opening a dialog closes any existing one
- "Reveal Role" opens dialog with role content and switches primary action to "Close"
- Role remains visible after reveal (persistent state on the card)
- Current player cue is visible at the top at all times during reveal

### Non-Functional Requirements
- Mobile-first interaction, with 44px minimum tap targets
- Dialog accessibility: focus trap, Escape to close, and return focus to trigger
- Debounce/guard against double-taps on Reveal/Close; idempotent actions
- Smooth interactions (<200ms) on typical mobile devices

## Success Metrics
- Zero instances of multiple dialogs shown simultaneously in manual tests
- <200ms open/close dialog interaction latency
- 100% adherence to strict order in the UI (no out-of-order reveals possible)
- Clear, persistent roles visible after reveal for all players

## Out of Scope
- Allocation logic and reshuffle behavior (covered in Role Allocation epic)
- Input validation and dynamic name fields (covered in Input & Validation epic)
- Persistence, analytics, or backend connectivity

## Business Value
High. This epic is critical for the core experience—players must reveal roles privately, in order, on a single device, without confusion or leaks. It ensures game integrity and smooth play.

## Context Template

- Epic Idea: Build a strict, mobile-first reveal flow with single-dialog enforcement, persistent role visibility, and a current player cue.
- Target Users: Hosts and players using a single shared mobile device during setup.
