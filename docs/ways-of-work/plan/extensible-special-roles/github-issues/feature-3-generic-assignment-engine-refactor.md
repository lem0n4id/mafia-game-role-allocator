# Feature: Generic Assignment Engine Refactor

## Feature Description

Refactor the existing role assignment engine from hardcoded two-role boolean array architecture to a generic multi-role object-based system. Replace `[true, true, false, false...]` arrays with role object arrays `[{role: MAFIA}, {role: MAFIA}, {role: POLICE}, {role: VILLAGER}...]`, enabling Fisher-Yates shuffle algorithm to assign any number of special roles. Introduce `buildRoleArray()` function converting role counts to shuffleable arrays, refactor `fisherYatesShuffle()` to operate on role objects, enhance assignment data structure with full role metadata, and implement `verifyAssignment()` integrity checking. Maintain <200ms performance for 30 players with 10 roles, preserve backward compatibility with legacy API, and achieve 95%+ test coverage including randomness distribution validation.

## Agent Instructions

This issue is a prompt for an LLM implementation agent. Follow these directives:

- Read and follow the step-by-step instructions in `implementation-plan.md` (see References)
- Closely examine these source docs in the same directory and reconcile them:
  - `prd.md` (requirements and acceptance criteria)
  - `implementation-plan.md` (step-by-step execution with refactored code examples)
  - `project-plan.md` (sequencing/estimates/risks)
  - `issues-checklist.md` (task tracking)
  When conflicts arise, defer to PRD for scope/requirements and note discrepancies in the Pull Request.
- Implement changes in small, logically grouped commits with clear messages
- Open a Pull Request linking back to this issue; summarize changes and verification steps
- Ensure lint/build/preview checks pass before requesting review

## Business Value

- Outcome: Future-proof assignment engine supporting unlimited special roles with zero engine refactoring required for new roles
- KPIs / Signals:
  - New role additions require zero assignment engine code changes
  - <200ms assignment time for 30 players with 10 roles maintaining UI responsiveness
  - Backward compatibility preserved ensuring existing code continues working
  - <1% randomness deviation over 10,000 iterations confirming fairness

## Acceptance Criteria

- [ ] `buildRoleArray(roleCounts)` function converts `{MAFIA: 5, POLICE: 1, VILLAGER: 14}` to shuffleable role object array
- [ ] `fisherYatesShuffle()` refactored to operate on role objects instead of boolean arrays
- [ ] Enhanced assignment data structure: `{ id, name, role: {fullRoleObject}, index, revealed }`
- [ ] `verifyAssignment()` function validates count integrity and structure correctness
- [ ] `assignRoles()` main function generates assignments with metadata and statistics
- [ ] Backward compatibility adapter: `assignRoles(playerNames, mafiaCount)` legacy signature still works
- [ ] Assignment metadata includes: timestamp, totalPlayers, roleDistribution, assignmentId
- [ ] Randomness distribution testing over 10,000 iterations confirms <1% deviation from expected
- [ ] Performance benchmarks confirm <200ms for 30 players with 10 roles
- [ ] Comprehensive test suite covering happy path, edge cases (0/all/boundary), backward compatibility
- [ ] Documentation updated with migration guide for consumers

## Subtasks (suggested)

- [ ] Follow implementation-plan.md Phase 1-6 steps end-to-end; commit buildRoleArray, refactored shuffle, enhanced data structure, verification, backward adapter separately
- [ ] Tests: Unit tests for buildRoleArray, shuffle, verifyAssignment; integration tests; randomness distribution test (10K iterations); performance benchmarks; backward compatibility tests
- [ ] Docs updated: Add ASSIGNMENT_ENGINE.md migration guide, update DEVELOPMENT.md with refactoring decision, update copilot-instructions.md with new assignment patterns
- [ ] Cross-check deliverables against PRD acceptance criteria (AC-1 through AC-11), project-plan.md phases, issues-checklist.md tasks

## Dependencies

- Feature 1: Role Registry System (required - assignment reads role definitions)
- Feature 2: Multi-Role Validation Framework (required - validates role counts before assignment)

## Definition of Done

- [ ] Meets all 11 acceptance criteria (AC-1 through AC-11 in PRD)
- [ ] Passes lint/build/preview smoke tests
- [ ] Performance validated: <200ms for 30 players measured, randomness <1% deviation confirmed
- [ ] Documentation updated: ASSIGNMENT_ENGINE.md created, DEVELOPMENT.md and copilot-instructions.md updated
- [ ] Pull Request opened and linked; CI/build checks are green
- [ ] Work validated against PRD requirements and aligned with project-plan.md timeline

## Labels

`feature`, `refactoring`, `performance`, `backward-compatibility`

## Milestone

Extensible Special Roles Epic

## Estimate

5 story points (2-3 days)

## References

- PRD: `docs/ways-of-work/plan/extensible-special-roles/generic-assignment-engine-refactor/prd.md`
- Sibling docs in same directory:
  - Implementation Plan: `docs/ways-of-work/plan/extensible-special-roles/generic-assignment-engine-refactor/implementation-plan.md`
  - Project Plan: `docs/ways-of-work/plan/extensible-special-roles/generic-assignment-engine-refactor/project-plan.md`
  - Issues Checklist: `docs/ways-of-work/plan/extensible-special-roles/generic-assignment-engine-refactor/issues-checklist.md`

## Parent

- Epic: Extensible Special Roles (#<add issue number here>)
