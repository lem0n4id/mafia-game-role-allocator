# Epic Product Requirements Document: Reset / Re-Allocate

## Epic Name

Reset / Re-Allocate

## Goal

### Problem
Once roles are allocated and the reveal flow begins, the host may need to restart for many reasons (typos, late arrivals, wrong mafia count). Without a reliable Reset that preserves entered names but clears allocations, users must retype everything, causing friction and delays.

### Solution
Provide a Reset capability that:
- Appears after allocation on the cards screen
- Returns the app to the input screen
- Clears all previous allocations and reveal state
- Prefills all previously entered names in the input fields
- Supports triggering during an open reveal dialog (should safely clear and navigate back)

### Impact
- Saves time by avoiding re-entry of names
- Reduces user frustration from mistakes discovered late
- Enables quick re-allocation loops with minimal friction

## User Personas

- Host: Needs to quickly restart allocation while keeping names
- Players: Indirectly benefit from shorter interruptions

## High-Level User Journeys

1. After allocation, host taps Reset at the bottom of the card list screen
2. App confirms Reset if necessary (optional lightweight confirm)
3. App navigates back to input screen with all names prefilled
4. All past allocations and reveal progress are cleared
5. Host adjusts counts if desired and re-allocates

## Business Requirements

### Functional Requirements
- Show a Reset button after roles have been allocated
- Reset returns to the input screen with all player name inputs prefilled
- Reset clears previous allocations and any reveal progress/state
- Reset is allowed during reveal; it must close any open dialog and reset safely
- Re-allocation after Reset must produce a fresh allocation with no remnants of prior state

### Non-Functional Requirements
- Actions are idempotent and guarded against double-taps
- State transitions are fast (<200ms) and clearly communicated
- No persistence; names survive Reset only because they remain in memory state carried back to input

## Success Metrics
- Reset completes reliably within <200ms and always returns to input
- 0 instances of stale allocations/reveal state after Reset in manual testing
- Measurable reduction in re-entry time when fixing mistakes (qualitative for MVP)

## Out of Scope
- Allocation logic and confirmation (Role Allocation epic)
- Reveal ordering and dialog logic (Role Display & Reveal epic)
- Persistence, analytics, or backend integrations

## Business Value
Medium-High. Reset enables fast recovery from mistakes and supports iterative allocation, improving real-world usability during group setup.

## Context Template

- Epic Idea: Implement a Reset action that clears allocation and reveal state, returns to input with names prefilled, and supports re-allocation.
- Target Users: Hosts needing to quickly restart allocation without losing names.
