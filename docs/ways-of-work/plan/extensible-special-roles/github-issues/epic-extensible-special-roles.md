# Epic: Extensible Special Roles System (Police & Doctor)

## Epic Description

Transform the Mafia Game Role Allocator from a basic two-role system (Mafia vs. Villagers) into a flexible, professional-grade facilitator supporting extensible special roles (Police and Doctor). Implement a generic role architecture through a centralized role registry pattern, enabling configuration of multiple special roles with proper villager count deduction, real-time validation, and cryptographically fair assignment. The solution establishes a foundation for adding future role types in <4 hours without architectural changes, positioning the application as the only mobile-first Mafia allocator with extensible special roles support.

## Business Value

- Primary Goal: Transform application into comprehensive Mafia facilitator with extensible special roles architecture, enabling 4-hour role additions and reducing future development costs by 75%
- Success Metrics (KPIs):
  - Special Role Adoption Rate: 55% of active users configure at least one special role within 30 days of release
  - Session Complexity: Average roles per game increases from 2.0 to 3.2 (60% increase)
  - User Retention: 7-day retention increases by 25% among users who try special roles
  - Configuration Time: Time to complete role setup remains <45 seconds despite added complexity
  - Allocation Accuracy: 100% of assignments match configured role counts (zero allocation errors)
  - Extensibility Validation: New role type added and tested in <4 hours (proof of generic architecture)
- User Impact:
  - Advanced Game Facilitators gain professional-grade tools for complex game configurations with 10-20 participants
  - New-to-Advanced Mafia Players receive guided interface with visual role distribution and clear validation feedback
  - Mobile-First Casual Organizers benefit from fast setup with sensible defaults and confident role math

## Epic Acceptance Criteria

- [ ] Role Registry System implemented as single source of truth for all role metadata (Mafia, Villager, Police, Doctor)
- [ ] Police and Doctor input fields added to UI with touch-optimized counter controls (← N →) and 44px+ touch targets
- [ ] Real-time villager count calculation: `villagers = totalPlayers - mafia - police - doctor` with prominent display
- [ ] Multi-role validation framework preventing invalid configurations (total special roles > players, negative villagers)
- [ ] Role assignment engine refactored to generic multi-role architecture using Fisher-Yates shuffle across all role types
- [ ] Enhanced assignment data structure: `{ id, name, role: {fullRoleObject}, index, revealed }` with role-specific metadata
- [ ] Card list interface displays role-specific color coding: Mafia (red), Police (blue), Doctor (green), Villager (gray)
- [ ] Role reveal dialog shows role-specific descriptions: Police ("Investigate one player each night"), Doctor ("Protect one player each night")
- [ ] Role distribution summary displayed: "5 Mafia, 1 Police, 1 Doctor, 13 Villagers (20 total)" with color-coded badges
- [ ] Performance maintained: <2s load, <200ms assignment for 30 players with 5+ role types, <100ms validation feedback
- [ ] Backward compatibility preserved: zero breaking changes for users not configuring special roles (defaults to 0)
- [ ] WCAG AA accessibility compliance maintained across all new inputs, labels, and role-specific UI elements
- [ ] Comprehensive test coverage: 90%+ for role registry, validation framework, and assignment engine
- [ ] Extensibility validated: new role type (e.g., Detective) added and tested in <4 hours demonstrating generic architecture

## Features in this Epic

- [ ] Feature: Role Registry System
  - Docs: docs/ways-of-work/plan/extensible-special-roles/role-registry-system/
    - prd.md, implementation-plan.md, project-plan.md, issues-checklist.md

- [ ] Feature: Multi-Role Validation Framework
  - Docs: docs/ways-of-work/plan/extensible-special-roles/multi-role-validation-framework/
    - prd.md, implementation-plan.md, project-plan.md, issues-checklist.md

- [ ] Feature: Generic Assignment Engine Refactor
  - Docs: docs/ways-of-work/plan/extensible-special-roles/generic-assignment-engine-refactor/
    - prd.md, implementation-plan.md, project-plan.md, issues-checklist.md

- [ ] Feature: Role Configuration UI System
  - Docs: docs/ways-of-work/plan/extensible-special-roles/role-configuration-ui-system/
    - prd.md, implementation-plan.md, project-plan.md, issues-checklist.md

## Definition of Done

- [ ] All 4 features completed and verified (dev, build, preview) with passing tests
- [ ] Baseline behavior validated: existing two-role workflows unaffected, HMR working, mobile viewport tested (375px+)
- [ ] Performance budgets met: bundle size increase <10KB total, assignments <200ms for 30 players, validation <100ms
- [ ] Documentation updated and consistent:
  - README.md updated with special roles feature description
  - DEVELOPMENT.md updated with architectural decisions and role registry patterns
  - copilot-instructions.md updated with component patterns, validation hooks, and extensibility guidelines
  - New docs created: ROLE_REGISTRY.md, VALIDATION_FRAMEWORK.md, ASSIGNMENT_ENGINE.md, ROLE_EXTENSIBILITY.md
- [ ] Planning artifacts updated: all project-plan.md and issues-checklist.md files reflect completed status
- [ ] Epic acceptance criteria met (all 14 criteria above validated)
- [ ] All 4 feature issues closed with linked Pull Requests merged to main branch
- [ ] Production deployment verified: live at https://mafia-game-role-allocator.vercel.app with special roles functional
- [ ] User acceptance testing completed: 10+ test users successfully configure Police/Doctor roles and complete games
- [ ] Extensibility proof validated: Detective role added to registry and UI renders automatically in <4 hours

## Labels

`epic`, `special-roles`, `extensibility`, `architecture`, `multi-role`, `enhancement`

## Milestone

Extensible Special Roles - Q1 2026

## Estimate

20 story points (4 features × 5 points each = 6-9 weeks total, accounting for integration and testing)

## References

- Epic PRD: docs/ways-of-work/plan/extensible-special-roles/epic.md
- Architecture: docs/ways-of-work/plan/extensible-special-roles/arch.md
- Feature Breakdown: docs/ways-of-work/plan/extensible-special-roles/FEATURE_BREAKDOWN.md
- Feature PRDs and Implementation Plans:
  - Feature 1: docs/ways-of-work/plan/extensible-special-roles/role-registry-system/
  - Feature 2: docs/ways-of-work/plan/extensible-special-roles/multi-role-validation-framework/
  - Feature 3: docs/ways-of-work/plan/extensible-special-roles/generic-assignment-engine-refactor/
  - Feature 4: docs/ways-of-work/plan/extensible-special-roles/role-configuration-ui-system/
- Planning prompts:
  - Implementation plan: .github/prompts/breakdown-feature-implementation.prompt.md
  - Project planning: .github/prompts/breakdown-plan.prompt.md
  - Issue generation: .github/prompts/generate-issue-bodies.prompt.md
