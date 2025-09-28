# Epic Product Requirements Document: Input & Validation

## Epic Name

Input & Validation

## Goal

### Problem
Hosts need a fast, error-proof way to set up the game. In the current flow, the ability to define the number of players, specify the number of Mafia, and enter player names must be seamless and strictly validated. Without this, the app risks invalid setups (blank names, Mafia ≥ players), confusing UX, and wasted time. The lack of robust validation also increases the chance of misconfigured allocations and poor game starts.

### Solution
Deliver a minimal, mobile-first input experience that allows the host to:
- Enter the total number of players
- Enter the number of Mafia
- Dynamically add/remove name fields as the player count changes
- Block submission when any name is blank
- Block invalid Mafia counts (≥ players), with confirmation/warning flows for edge cases

The experience must be snappy on mobile, clearly communicate errors, and preserve entered names across adjustments.

### Impact
- Reduce setup errors and retries
- Speed up game preparation time to under a minute for typical groups
- Ensure only valid configurations reach allocation
- Improve perceived quality with clear validation and feedback

## User Personas

- Host: Facilitates the game, enters counts and names on a single mobile device.
- Players: Indirectly affected; expect a quick, accurate setup leading to fair allocations.

## High-Level User Journeys

1. Host opens the app, enters Number of Players
2. App shows that many name inputs (adding/removing as the value changes)
3. Host enters Number of Mafia; app blocks invalid counts (≥ players)
4. Host fills all player names; duplicates allowed, blanks rejected
5. Host taps "Allocate Roles"; allocation is blocked until inputs are valid

## Business Requirements

### Functional Requirements
- Number of Players input controls the count of visible Player Name fields
- Increasing the count appends empty inputs; decreasing removes surplus inputs and their values
- Number of Mafia input must be a non-negative integer and strictly less than players (with confirm flow for 0 or = players handled at allocation epic)
- All player name fields are required; duplicates are allowed
- Inputs are controlled; names remain prefilled if the user returns from allocation or after a reset
- Validation errors must be clearly surfaced and prevent progression

### Non-Functional Requirements
- Mobile-first interaction; large touch targets and responsive input updates (<200ms)
- Lightweight implementation with React 18 and Tailwind v3.4.17 utilities only
- No persistence; all state is in-memory for the session
- Accessibility: labels or accessible names for inputs and buttons; clear error text

## Success Metrics
- 0 invalid allocations caused by input errors (block before allocation)
- < 60 seconds median time from open to valid inputs for 8 players
- < 200ms interaction latency for adding/removing fields and typing
- < 1% abandonment due to confusing validation (qualitative for MVP)

## Out of Scope
- Role allocation logic and confirmation prompt (covered in Allocation epic)
- Card list, reveal order, and current player cue (covered in Reveal epic)
- Persistence, analytics, advanced roles, or non-core UI libraries

## Business Value
High. This epic is the gatekeeper for all valid games. It ensures clean data for allocation, reduces friction for hosts, and directly supports fast, reliable game starts on mobile devices.

## Context Template

- Epic Idea: Build a robust, mobile-first input flow that dynamically adapts to player count, validates Mafia count, and blocks blank names before allocation.
- Target Users: Hosts using a single mobile device; players benefit indirectly from fewer setup mistakes.
