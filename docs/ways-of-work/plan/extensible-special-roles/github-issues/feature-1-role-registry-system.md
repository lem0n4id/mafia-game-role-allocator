# Feature: Role Registry System

## Feature Description

Implement a centralized Role Registry System providing a single source of truth for all role definitions (Mafia, Villager, and future special roles like Police, Doctor, Detective). The registry stores structured metadata including role identifiers, display names, team affiliations, color schemes, count constraints, and descriptions. Exposes a clean JavaScript API with functions like `getRoles()`, `getRoleById()`, `getRolesByTeam()`, and `validateRoleCount()` enabling data-driven UI rendering and validation. Acts as the foundation layer for the Extensible Special Roles epic, enabling 4-hour role additions with zero UI code changes.

## Agent Instructions

This issue is a prompt for an LLM implementation agent. Follow these directives:

- Read and follow the step-by-step instructions in `implementation-plan.md` (see References)
- Closely examine these source docs in the same directory and reconcile them:
  - `prd.md` (requirements and acceptance criteria)
  - `implementation-plan.md` (step-by-step execution with code examples)
  - `project-plan.md` (sequencing/estimates/risks)
  - `issues-checklist.md` (task tracking)
  When conflicts arise, defer to PRD for scope/requirements and note discrepancies in the Pull Request.
- Implement changes in small, logically grouped commits with clear messages
- Open a Pull Request linking back to this issue; summarize changes and verification steps
- Ensure lint/build/preview checks pass before requesting review

## Business Value

- Outcome: Single source of truth for role metadata enabling extensible multi-role gameplay without UI refactoring
- KPIs / Signals:
  - Role additions take <4 hours (down from estimated 40+ hours with hardcoded approach)
  - Zero UI code changes required when adding new roles
  - <1ms registry access time maintaining real-time UI responsiveness
  - <2KB bundle size impact per new role

## Acceptance Criteria

- [ ] Role registry created at `src/utils/roleRegistry.js` with MAFIA, VILLAGER, POLICE, DOCTOR definitions
- [ ] Each role includes: id, name, team, color (primary/secondary/text), constraints (min/max/default), description, displayOrder
- [ ] `getRoles()` returns all roles sorted by displayOrder
- [ ] `getRoleById(id)` returns specific role or throws error if not found
- [ ] `getRolesByTeam(team)` filters roles by MAFIA/VILLAGE team affiliation
- [ ] `getSpecialRoles()` returns non-VILLAGER roles for UI rendering
- [ ] `validateRoleCount(roleId, count, totalPlayers)` validates count against constraints
- [ ] JSDoc type definitions created for RoleDefinition, RoleColor, RoleConstraints types
- [ ] Comprehensive test suite achieving 100% coverage with 50+ test cases
- [ ] Performance benchmarks confirm <1ms access time, <2KB bundle impact
- [ ] Documentation created with usage examples for consumers

## Subtasks (suggested)

- [ ] Follow implementation-plan.md Phase 1-6 steps end-to-end; commit in small chunks (registry creation, API functions, types, tests, docs)
- [ ] Tests: Unit tests for all API functions, boundary tests for constraints, error handling tests, performance benchmarks
- [ ] Docs updated: Add ROLE_REGISTRY.md guide, update DEVELOPMENT.md with architectural decision, update copilot-instructions.md with registry patterns
- [ ] Cross-check deliverables against PRD acceptance criteria (AC-1 through AC-11), project-plan.md timeline, and issues-checklist.md tasks

## Dependencies

- None (foundation feature for Extensible Special Roles epic)

## Definition of Done

- [ ] Meets all 11 acceptance criteria (AC-1 through AC-11 in PRD)
- [ ] Passes lint/build/preview smoke tests
- [ ] Performance impact measured: <1ms access, <2KB bundle
- [ ] Documentation updated: ROLE_REGISTRY.md created, DEVELOPMENT.md and copilot-instructions.md updated
- [ ] Pull Request opened and linked; CI/build checks are green
- [ ] Work validated against PRD requirements and aligned with project-plan.md phases

## Labels

`feature`, `foundation`, `architecture`, `extensibility`

## Milestone

Extensible Special Roles Epic

## Estimate

5 story points (2-3 days)

## References

- PRD: `docs/ways-of-work/plan/extensible-special-roles/role-registry-system/prd.md`
- Sibling docs in same directory:
  - Implementation Plan: `docs/ways-of-work/plan/extensible-special-roles/role-registry-system/implementation-plan.md`
  - Project Plan: `docs/ways-of-work/plan/extensible-special-roles/role-registry-system/project-plan.md`
  - Issues Checklist: `docs/ways-of-work/plan/extensible-special-roles/role-registry-system/issues-checklist.md`

## Parent

- Epic: Extensible Special Roles (#<add issue number here>)
