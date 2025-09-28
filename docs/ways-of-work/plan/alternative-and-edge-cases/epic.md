# Alternative / Edge Cases

## 1. Epic Name

Alternative / Edge Cases

## 2. Goal

- Problem: Even with a simple allocation flow, unusual inputs and usage patterns can cause confusion or break the experience. Hosts may set Mafia to 0 or equal to players, users may rapidly double‑tap buttons, and the game must support a single shared device with no authentication. If these aren’t handled consistently, the flow can stall or produce mistrust in the results.
- Solution: Define and implement clear guardrails and confirmations for edge scenarios (Mafia = 0 or = players), ensure idempotent interactions for rapid taps, and standardize assumptions around a single shared device and no-auth usage. Provide concise confirmations and messages that keep the flow moving while preventing invalid operations.
- Impact: Reduced user errors and abandoned sessions; higher allocation completion rate; consistent experience across edge scenarios; increased trust that the app behaves predictably under stress.

## 3. User Personas

- Host: Facilitates the game on a single mobile device, responsible for inputs and confirming edge cases.
- Player: Uses the shared device to reveal their role sequentially. No login; minimal interaction.

## 4. High‑Level User Journeys

- Edge Confirmation Journey (Mafia = 0 or = players):
  1) Host enters players and Mafia count.
  2) On Allocate, the app checks if Mafia is 0 or equals players.
  3) App shows a concise confirmation: proceed anyway or cancel to adjust.
  4) If confirmed, allocation proceeds; if cancelled, host edits inputs.
- Idempotent Interaction Journey (Double‑tap/rapid taps):
  1) User taps Allocate/Reveal/Close/Reset.
  2) The app disables the button during processing or debounces.
  3) Action executes once; repeated taps are ignored.
  4) UI returns to ready state when action completes.
- Single Shared Device Journey (No auth):
  1) All users interact on the same device.
  2) The app enforces strict reveal order with a persistent current player cue.
  3) No identity, accounts, or persistence are required; session lives in memory.

## 5. Business Requirements

- Functional Requirements
  - Allow Mafia = 0 or Mafia = total players with a confirmation prompt before allocation proceeds. [US 25]
  - Allow Reset at any time (including during reveal); returns to input screen with names prefilled and clears allocations. [US 26]
  - Ensure double‑tap/rapid taps on Allocate/Reveal/Close/Reset are idempotent (no duplicate actions, no broken UI state). [US 27]
  - Block invalid inputs (blank names; Mafia ≥ players when not explicitly confirmed) and require correction before allocation. [US 28]
  - No authentication or accounts; app assumes a single shared device by host and players. [US 29]
  - Maintain a single shared device workflow where all interactions follow the same sequential flow. [US 30]

- Non‑Functional Requirements
  - Performance: Interaction latency <200ms even when debouncing/guarding actions.
  - Reliability: Guard against race conditions from rapid taps; ensure consistent state transitions.
  - Accessibility: Clear, readable confirmations; buttons have sufficient touch targets (≥44px) and disabled states.
  - Privacy: All state in memory only; nothing persisted or transmitted.
  - Simplicity: Minimal UI text; confirmations should be terse and unambiguous.

## 6. Success Metrics

- Edge Confirmation Accepted Rate: % of edge confirmations that proceed without subsequent errors.
- Idempotency Robustness: Incidence of duplicate actions or broken states from rapid taps (target ~0 in manual tests).
- Allocation Completion Rate: % of sessions that complete allocation even under edge conditions.
- Time to Recover: Average time from an edge prompt to successful allocation.

## 7. Out of Scope

- Advanced roles or conditional rules beyond Mafia/Villager.
- Authentication, user accounts, persistence, or multi‑device coordination.
- Complex modals or heavy UI libraries; keep confirmations simple (native confirm or a lightweight modal).

## 8. Business Value

- Value: Medium–High. Robust edge handling prevents stalls and mistrust, ensuring the MVP works reliably in real social settings where mistakes and rapid taps are common.

## Context Template

- Epic Idea: Handle alternative flows and edge cases to keep the experience reliable and predictable on a single shared device.
- Target Users: Hosts and players using one shared mobile device; no authentication.
