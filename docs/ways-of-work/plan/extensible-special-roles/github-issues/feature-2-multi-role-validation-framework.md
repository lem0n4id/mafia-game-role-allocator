# Feature: Multi-Role Validation Framework

## Feature Description

Implement a composable Multi-Role Validation Framework providing real-time validation for complex multi-role configurations. Creates a rule-based validation engine executing 5+ built-in rules (TotalRoleCountRule, IndividualMinMaxRule, MinimumVillagersRule, NegativeCountRule, AllSpecialRolesRule) plus extensible custom rules. Integrates with Role Registry to access constraints, exposes `useRoleValidation` React hook for component consumption, and provides user-friendly error/warning messages with actionable guidance. Achieves <100ms validation response time with automatic debouncing and 95%+ test coverage.

## Agent Instructions

This issue is a prompt for an LLM implementation agent. Follow these directives:

- Read and follow the step-by-step instructions in `implementation-plan.md` (see References)
- Closely examine these source docs in the same directory and reconcile them:
  - `prd.md` (requirements and acceptance criteria)
  - `implementation-plan.md` (step-by-step execution with validation rule implementations)
  - `project-plan.md` (sequencing/estimates/risks)
  - `issues-checklist.md` (task tracking)
  When conflicts arise, defer to PRD for scope/requirements and note discrepancies in the Pull Request.
- Implement changes in small, logically grouped commits with clear messages
- Open a Pull Request linking back to this issue; summarize changes and verification steps
- Ensure lint/build/preview checks pass before requesting review

## Business Value

- Outcome: Composable validation framework preventing invalid game configurations while allowing edge cases with appropriate warnings
- KPIs / Signals:
  - <100ms real-time validation response maintaining smooth UI interactions
  - 5 built-in validation rules covering all PRD requirements
  - Custom rule additions take <30 minutes enabling rapid validation extensions
  - 95%+ test coverage ensuring reliability

## Acceptance Criteria

- [ ] Validation engine created at `src/utils/roleValidationEngine.js` with rule-based architecture
- [ ] Five built-in validation rules implemented:
  - TotalRoleCountRule (ERROR: roles exceed players)
  - IndividualMinMaxRule (ERROR: role violates min/max constraints)
  - MinimumVillagersRule (WARNING: 0 villagers, ERROR: negative)
  - NegativeCountRule (ERROR: negative role counts)
  - AllSpecialRolesRule (WARNING: no villagers in game)
- [ ] `validateRoleConfiguration(roleCounts, totalPlayers)` function returns validation state with errors/warnings arrays
- [ ] `useRoleValidation` React hook with 100ms debouncing and useMemo caching
- [ ] `calculateVillagerCount(roleCounts, totalPlayers)` memoized helper function
- [ ] Error messages formatted with user-friendly guidance (e.g., "Reduce role counts" vs technical errors)
- [ ] Custom rule addition documented with interface and examples
- [ ] Comprehensive test suite covering all rules, edge cases, performance benchmarks
- [ ] Integration with Role Registry confirmed (accesses constraints via registry API)
- [ ] Documentation with usage examples for consumers

## Subtasks (suggested)

- [ ] Follow implementation-plan.md Phase 1-6 steps end-to-end; commit validation engine, rules, React hook, tests separately
- [ ] Tests: Unit tests for each rule, integration tests for rule execution, edge case tests (0/negative/boundary), performance benchmarks (<100ms)
- [ ] Docs updated: Add VALIDATION_FRAMEWORK.md guide, update DEVELOPMENT.md with validation patterns, update copilot-instructions.md with useRoleValidation examples
- [ ] Cross-check deliverables against PRD acceptance criteria (AC-1 through AC-12), project-plan.md phases, issues-checklist.md tasks

## Dependencies

- Feature 1: Role Registry System (required - validation rules access registry constraints)

## Definition of Done

- [ ] Meets all 12 acceptance criteria (AC-1 through AC-12 in PRD)
- [ ] Passes lint/build/preview smoke tests
- [ ] Performance validated: <100ms validation response measured
- [ ] Documentation updated: VALIDATION_FRAMEWORK.md created, DEVELOPMENT.md and copilot-instructions.md updated
- [ ] Pull Request opened and linked; CI/build checks are green
- [ ] Work validated against PRD requirements and aligned with project-plan.md timeline

## Labels

`feature`, `validation`, `react-hook`, `extensibility`

## Milestone

Extensible Special Roles Epic

## Estimate

5 story points (2-3 days)

## References

- PRD: `docs/ways-of-work/plan/extensible-special-roles/multi-role-validation-framework/prd.md`
- Sibling docs in same directory:
  - Implementation Plan: `docs/ways-of-work/plan/extensible-special-roles/multi-role-validation-framework/implementation-plan.md`
  - Project Plan: `docs/ways-of-work/plan/extensible-special-roles/multi-role-validation-framework/project-plan.md`
  - Issues Checklist: `docs/ways-of-work/plan/extensible-special-roles/multi-role-validation-framework/issues-checklist.md`

## Parent

- Epic: Extensible Special Roles (#53 )
