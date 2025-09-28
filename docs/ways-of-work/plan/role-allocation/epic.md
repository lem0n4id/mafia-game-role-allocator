# Epic Product Requirements Document: Role Allocation

## Epic Name

Role Allocation

## Goal

### Problem
After input validation, the host needs a reliable, fair, and transparent way to assign roles. Without a clear confirmation step and unbiased randomization, hosts may make mistakes or doubt the fairness of the assignments. Repeated allocations must be supported (reshuffle) without carrying over previous results.

### Solution
Provide a confirmation-gated, unbiased allocation flow that:
- Confirms with the host before shuffling
- Assigns exactly N Mafia and the rest Villagers
- Uses an unbiased Fisher–Yates shuffle to randomize
- Allows re-allocation (reshuffle) on demand, discarding prior assignments

### Impact
- Ensures trust in fairness of role assignment
- Prevents accidental allocations via confirmation step
- Supports quick retries if hosts want to reshuffle

## User Personas

- Host: Confirms allocation and triggers randomization; may reshuffle if desired.
- Players: Indirectly benefit from fair, unbiased role assignments.

## High-Level User Journeys

1. Host taps "Allocate Roles" on a valid input set
2. App displays confirmation prompt (with warning if mafia=0 or mafia=players)
3. On confirm, app assigns exactly mafiaCount Mafia; remaining are Villagers
4. App stores the allocation for the reveal phase
5. Host can tap "Allocate Roles" again to reshuffle, discarding prior allocation

## Business Requirements

### Functional Requirements
- Confirmation prompt appears before allocation
- Allocation assigns exactly `mafiaCount` Mafia; others are Villagers
- Use unbiased Fisher–Yates shuffle for randomization
- Re-allocation fully reshuffles and discards previous allocations
- Allocation is blocked if any name is blank or mafiaCount ≥ players (relies on Input epic validation)

### Non-Functional Requirements
- Mobile-first performance: allocation and shuffle must complete within 200ms on typical mobile devices
- Deterministic in count, non-deterministic in ordering (uniform random)
- No persistence; allocation lives only in memory for the session

## Success Metrics
- 100% correctness in role counts per allocation
- Shuffle latency <200ms for up to 20 players
- Zero reports of biased or repeating patterns under basic manual testing
- Re-allocation works reliably across multiple consecutive attempts

## Out of Scope
- Card layout, reveal sequencing, and current player cues (handled in Reveal epic)
- Input field validation and dynamic fields (handled in Input epic)
- Persistence, analytics, or backend integrations

## Business Value
High. The app’s core promise is fast, fair role assignment. This epic ensures trust and usability by enforcing confirmation and unbiased shuffling, enabling smooth game starts.

## Context Template

- Epic Idea: Implement confirmation-gated, unbiased Mafia role assignment with reshuffle capability.
- Target Users: Hosts preparing a Mafia game who need trustworthy, quick role assignments.
