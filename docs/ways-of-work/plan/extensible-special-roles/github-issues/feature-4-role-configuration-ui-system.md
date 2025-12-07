# Feature: Role Configuration UI System

## Feature Description

Implement a data-driven Role Configuration UI System providing the user-facing interface for multi-role game setup. Create `RoleConfigurationManager` orchestrator component and `RoleInput` generic reusable component that read role registry, render dynamic inputs for each special role, and manage state through `usePlayerRoleConfiguration` hook. Display real-time villager count calculation, role distribution summary with color-coded badges, and validation feedback integrated with Multi-Role Validation Framework. Achieve <100ms UI response time, 44px+ touch targets for mobile optimization, and full WCAG AA accessibility compliance. Enable automatic UI rendering when new roles added to registry with zero UI code changes.

## Agent Instructions

This issue is a prompt for an LLM implementation agent. Follow these directives:

- Read and follow the step-by-step instructions in `implementation-plan.md` (see References)
- Closely examine these source docs in the same directory and reconcile them:
  - `prd.md` (requirements and acceptance criteria)
  - `implementation-plan.md` (step-by-step execution with component implementations)
  - `project-plan.md` (sequencing/estimates/risks)
  - `issues-checklist.md` (task tracking)
  When conflicts arise, defer to PRD for scope/requirements and note discrepancies in the Pull Request.
- Implement changes in small, logically grouped commits with clear messages
- Open a Pull Request linking back to this issue; summarize changes and verification steps
- Ensure lint/build/preview checks pass before requesting review

## Business Value

- Outcome: Self-updating UI automatically rendering new roles when added to registry, eliminating manual UI refactoring
- KPIs / Signals:
  - <100ms UI response time to role count changes maintaining smooth interactions
  - Zero UI code changes required when adding new roles (confirmed by adding mock DETECTIVE role)
  - 44px+ touch targets meeting mobile accessibility standards
  - WCAG AA compliance verified through automated accessibility audits

## Acceptance Criteria

- [ ] `RoleConfigurationManager.jsx` orchestrator component created reading special roles from registry
- [ ] `RoleInput.jsx` generic component created consuming role metadata (name, color, constraints)
- [ ] `usePlayerRoleConfiguration` hook manages role counts state with real-time updates
- [ ] Real-time villager count display: `totalPlayers - sum(specialRoleCounts)` with color coding (green: safe, yellow: <3, red: negative)
- [ ] Role distribution summary renders: "5 Mafia, 1 Police, 1 Doctor, 13 Villagers (20 total)" with color-coded badges matching role.color
- [ ] Validation errors/warnings displayed below inputs with clear messaging
- [ ] 44px+ touch targets on all counter controls confirmed
- [ ] WCAG AA compliance: ARIA labels, keyboard navigation, screen reader support verified
- [ ] Performance measured: <50ms mount time, <100ms state updates
- [ ] Bundle impact <3KB for new components
- [ ] Integration with App.jsx complete with proper state lifting
- [ ] Documentation includes extensibility guide: "Adding Detective automatically creates UI"

## Subtasks (suggested)

- [ ] Follow implementation-plan.md Phase 1-6 steps end-to-end; commit hook, RoleInput, RoleConfigurationManager, integration, tests separately
- [ ] Tests: Component tests for RoleConfigurationManager and RoleInput, hook tests for usePlayerRoleConfiguration, integration tests with validation, accessibility tests (screen reader, keyboard nav), performance tests (<100ms)
- [ ] Docs updated: Add ROLE_EXTENSIBILITY.md guide showing UI auto-rendering, update DEVELOPMENT.md with component patterns, update copilot-instructions.md with RoleConfigurationManager usage
- [ ] Cross-check deliverables against PRD acceptance criteria (AC-1 through AC-13), project-plan.md phases, issues-checklist.md tasks

## Dependencies

- Feature 1: Role Registry System (required - reads special roles via getSpecialRoles())
- Feature 2: Multi-Role Validation Framework (required - integrates useRoleValidation hook)

## Definition of Done

- [ ] Meets all 13 acceptance criteria (AC-1 through AC-13 in PRD)
- [ ] Passes lint/build/preview smoke tests
- [ ] Performance validated: <50ms mount, <100ms updates measured
- [ ] Accessibility audit passing: WCAG AA compliance verified
- [ ] Documentation updated: ROLE_EXTENSIBILITY.md created showing automatic UI rendering when adding Detective to registry
- [ ] Pull Request opened and linked; CI/build checks are green
- [ ] Work validated against PRD requirements and aligned with project-plan.md timeline

## Labels

`feature`, `ui`, `react-component`, `accessibility`, `mobile-optimization`

## Milestone

Extensible Special Roles Epic

## Estimate

5 story points (2-3 days)

## References

- PRD: `docs/ways-of-work/plan/extensible-special-roles/role-configuration-ui-system/prd.md`
- Sibling docs in same directory:
  - Implementation Plan: `docs/ways-of-work/plan/extensible-special-roles/role-configuration-ui-system/implementation-plan.md`
  - Project Plan: `docs/ways-of-work/plan/extensible-special-roles/role-configuration-ui-system/project-plan.md`
  - Issues Checklist: `docs/ways-of-work/plan/extensible-special-roles/role-configuration-ui-system/issues-checklist.md`

## Parent

- Epic: Extensible Special Roles (#<add issue number here>)
