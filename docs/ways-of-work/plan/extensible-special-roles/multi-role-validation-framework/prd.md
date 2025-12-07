# Feature PRD: Multi-Role Validation Framework

## 1. Feature Name

**Multi-Role Validation Framework**

## 2. Epic

- **Parent Epic PRD:** [Extensible Special Roles System](../epic.md)
- **Architecture Specification:** [Epic Architecture](../arch.md)
- **Related Feature:** [Role Registry System](../role-registry-system/prd.md)

## 3. Goal

**Problem:** The current validation system (`useMafiaCountValidation`) only validates a single role count (Mafia) against total players. With the introduction of special roles (Police, Doctor), the application needs to validate multiple role counts simultaneously with complex constraints: (1) total special roles cannot exceed players, (2) individual roles must respect min/max constraints, (3) villagers cannot be negative or zero, (4) cross-role dependencies may exist (e.g., mutual exclusivity). The existing validation logic is tightly coupled to the two-role paradigm and cannot be extended without significant refactoring. Without proper multi-role validation, users could configure invalid game states leading to assignment errors or poor gameplay experiences.

**Solution:** Implement an extensible Multi-Role Validation Framework (`src/utils/roleValidation.js`) that validates role configurations against registry-defined constraints. The framework will support composable validation rules (total count, individual min/max, minimum villagers, cross-role constraints) that can be added without modifying core validation logic. A new React hook (`useRoleValidation`) will integrate the framework with the UI, providing real-time validation feedback with role-specific error messages. The framework will differentiate between blocking errors (prevent allocation) and warnings (require confirmation), maintaining consistency with existing edge case validation patterns.

**Impact:** This feature ensures data integrity and user confidence in role configurations, enabling:
- **Zero Invalid Allocations:** 100% prevention of invalid role configurations reaching assignment engine
- **User Experience:** Real-time validation feedback within 100ms with clear, actionable error messages
- **Extensibility:** New validation rules added via array composition without engine changes
- **Edge Case Handling:** Support for 0 villagers, all special roles, unusual distributions with appropriate warnings
- **Developer Velocity:** Validation framework supports future role types without modifications

## 4. User Personas

**Primary Persona - Advanced Game Facilitator:**
- **Age:** 22-35
- **Context:** Configuring games with special roles (Police, Doctor) for 10-20 player game nights
- **Pain Points:** Uncertainty about valid role configurations, confusion about how special roles affect villager counts
- **Goals:** Receive immediate feedback on role configuration validity, understand constraints clearly, proceed confidently to allocation
- **Technical Comfort:** High mobile literacy, expects intuitive validation with helpful error messages

**Secondary Persona - New-to-Advanced Mafia Players:**
- **Age:** 18-30
- **Context:** Transitioning from basic Mafia to games with special roles, learning proper configurations
- **Pain Points:** Not understanding role math, accidentally creating invalid configurations, unclear error messages
- **Goals:** Learn valid role ratios through guided validation, avoid configuration mistakes, understand villager calculation
- **Technical Comfort:** Moderate, needs clear labels and visual feedback for validation states

**Tertiary Persona - Future Developers (Internal):**
- **Context:** Adding new role types with custom validation rules
- **Pain Points:** Current validation logic hardcoded for Mafia/Villager, no extension points for role-specific rules
- **Goals:** Add validation rules easily without modifying framework, understand validation architecture quickly
- **Technical Comfort:** Experienced React developers familiar with functional composition patterns

## 5. User Stories

**US-38: As a game facilitator, I want real-time validation when configuring roles so that I know immediately if my configuration is valid**
- **Benefit:** Prevents wasting time on invalid configurations, provides instant feedback during setup
- **Acceptance:** Validation updates within 100ms of role count changes, UI shows validation state clearly

**US-39: As a game facilitator, I want clear error messages explaining why my configuration is invalid so that I can fix it easily**
- **Benefit:** Reduces frustration and support requests by providing actionable guidance
- **Acceptance:** Error messages specify which role violates which constraint with suggested fixes

**US-40: As a game facilitator, I want to know when my configuration is unusual but allowed so that I can make informed decisions**
- **Benefit:** Differentiates between invalid (blocked) and edge case (allowed with warning) configurations
- **Acceptance:** Warning messages displayed for 0 villagers, all special roles scenarios without blocking allocation

**US-41: As a game facilitator, I want automatic villager count calculation so that I don't have to manually compute remaining villagers**
- **Benefit:** Eliminates mental math errors, provides transparent view of role distribution
- **Acceptance:** Villager count updates in real-time as special role counts change, clearly displayed in UI

**US-42: As a developer, I want to add validation rules without modifying the core framework so that I can support new role constraints**
- **Benefit:** Maintains framework stability while enabling extensibility for future roles
- **Acceptance:** New validation rule added to rule array, no changes to validation engine required

**US-43: As a developer, I want validation rules to have access to role registry metadata so that constraints are data-driven**
- **Benefit:** Eliminates hardcoded validation logic, ensures consistency between registry and validation
- **Acceptance:** Validation rules read min/max/constraints from registry, no duplicate definitions

**US-44: As a game facilitator, I want validation to prevent allocating with too many special roles so that games have sufficient villagers**
- **Benefit:** Ensures balanced gameplay by enforcing minimum villager counts (configurable)
- **Acceptance:** Validation blocks allocation when total special roles leave <1 villager (or configured minimum)

## 6. Requirements

### Functional Requirements

**Validation Rule System:**
- Implement composable validation rule pattern: each rule is function `(roleConfig, totalPlayers, registry) => ValidationResult`
- Define `ValidationResult` structure: `{ isValid: boolean, severity: 'ERROR' | 'WARNING' | 'INFO', type: string, message: string, details?: object }`
- Create built-in validation rules array: `[TotalRoleCountRule, IndividualMinMaxRule, MinimumVillagersRule, TeamBalanceRule]`
- Execute validation rules sequentially, collect all results, return aggregated validation state
- Support rule priority/ordering: high-severity rules execute first, short-circuit on critical errors (configurable)

**Built-In Validation Rules:**
- **TotalRoleCountRule:** Validates `sum(all role counts) ≤ totalPlayers`, ERROR severity if exceeded, message: "Total roles ({sum}) cannot exceed total players ({totalPlayers})"
- **IndividualMinMaxRule:** Validates each role count against registry `constraints.min` and `constraints.max`, ERROR severity if violated, message: "{roleName} count must be between {min} and {max}"
- **MinimumVillagersRule:** Validates `villagerCount ≥ configurable minimum (default: 1)`, WARNING severity if 0 villagers, ERROR if negative, message: "Configuration leaves {villagerCount} villagers. Consider reducing special roles."
- **NegativeCountRule:** Validates all role counts ≥ 0, ERROR severity, message: "{roleName} count cannot be negative"
- **AllSpecialRolesRule:** Detects when all players are special roles (0 villagers), WARNING severity, message: "All players assigned special roles. No villagers remaining."

**Villager Count Calculation:**
- Implement `calculateVillagerCount(roleConfiguration, totalPlayers)` function: `totalPlayers - sum(specialRoleCounts)`
- Support dynamic calculation based on role registry: iterate special roles, sum counts, subtract from total
- Handle edge cases: negative villager counts (validation error), zero villagers (validation warning), fractional players (impossible state caught earlier)
- Expose villager count in validation result for UI display
- Memoize calculation to prevent unnecessary recomputation on unchanged inputs

**React Hook Integration:**
- Create `useRoleValidation(roleConfiguration, totalPlayers)` custom hook for component integration
- Return validation state object: `{ isValid, hasErrors, hasWarnings, errors: [], warnings: [], villagerCount }`
- Debounce validation execution to 100ms to prevent excessive recalculation during rapid input changes
- Use `useMemo` to cache validation results based on dependencies (roleConfiguration, totalPlayers)
- Provide callback-based notification for parent components: `onValidationChange(validationState)`

**Error Message Formatting:**
- Generate user-friendly error messages with role names (not IDs) from registry
- Include specific constraint values in messages: "Police count must be between 0 and 2 (currently: 3)"
- Provide actionable suggestions: "Reduce special role counts to leave at least 1 villager"
- Support multi-line messages for complex errors listing all violations
- Color-code messages by severity: red for ERROR, yellow for WARNING, blue for INFO

**Integration with Existing Validation:**
- Extend existing `edgeCaseValidation.js` patterns for consistency (severity levels, message formatting)
- Preserve existing Mafia count edge case handling (0 Mafia, almost-all Mafia) as validation rules
- Maintain existing validation result structure for backward compatibility with `AllocationConfirmationFlow`
- Support `requiresConfirmation` flag for WARNING-severity edge cases
- Integrate with existing `useMafiaCountValidation` hook pattern for seamless migration

### Non-Functional Requirements

**Performance:**
- Validation execution completes in <10ms for typical configurations (4 roles, 1-30 players)
- Validation hook debouncing ensures <100ms UI response time to user input changes
- Memoization prevents redundant calculations when inputs unchanged (React.useMemo optimization)
- Framework supports 10+ validation rules without performance degradation
- Bundle size impact: <3KB minified for validation framework (rules + hook)

**Maintainability:**
- Validation rules follow consistent function signature enabling easy addition
- Each rule is pure function with no side effects (testable in isolation)
- Rule array exportable for custom validation pipelines in tests
- Comprehensive JSDoc documentation for ValidationResult schema and rule patterns
- Unit tests achieve 90%+ coverage for all rules and edge cases

**Extensibility:**
- New validation rules added to array without modifying validation engine
- Rules can access role registry for data-driven constraints (no hardcoding)
- Support for custom rule parameters via closure pattern: `createMinimumVillagersRule(minCount)`
- Framework agnostic to role types; supports 50+ roles without modifications
- Future rules can implement cross-role constraints (mutual exclusivity, dependencies)

**User Experience:**
- Validation feedback appears within 100ms of input change (debounced)
- Error messages are concise (1-2 sentences) and actionable
- Visual distinction between ERROR (red), WARNING (yellow), INFO (blue) in UI
- Validation state accessible via ARIA attributes for screen readers
- Graceful degradation: framework errors logged but don't crash application

**Accessibility:**
- Validation errors announced to screen readers via `role="alert"`
- Error messages associated with inputs via `aria-describedby`
- Validation state communicated through `aria-invalid` attributes
- Color-coded feedback supplemented with icons (not color-only indication)
- Keyboard navigation maintains focus on invalid inputs for correction

**Testing & Quality:**
- Unit tests for each validation rule covering valid, invalid, and edge cases
- Integration tests validating hook behavior with React components
- Performance tests measuring validation execution time (<10ms requirement)
- Edge case tests: 0 players, 100 players, all special roles, negative counts, fractional inputs
- Regression tests ensuring existing Mafia validation patterns preserved

## 7. Acceptance Criteria

### AC-1: Validation Rule System Architecture
- [ ] Validation rule pattern defined: `(roleConfig, totalPlayers, registry) => ValidationResult`
- [ ] ValidationResult structure includes: `isValid`, `severity`, `type`, `message`, `details`
- [ ] Severity levels supported: 'ERROR', 'WARNING', 'INFO'
- [ ] Validation rules composable: multiple rules execute sequentially, results aggregated
- [ ] Framework located at `src/utils/roleValidation.js`

### AC-2: Built-In Validation Rules
- [ ] TotalRoleCountRule validates sum of roles ≤ total players (ERROR if exceeded)
- [ ] IndividualMinMaxRule validates each role against registry constraints (ERROR if violated)
- [ ] MinimumVillagersRule validates villager count ≥ 1 (WARNING if 0, ERROR if negative)
- [ ] NegativeCountRule validates all role counts ≥ 0 (ERROR if negative)
- [ ] AllSpecialRolesRule detects 0 villagers configuration (WARNING severity)
- [ ] Each rule generates user-friendly error message with role names and constraint values

### AC-3: Villager Count Calculation
- [ ] `calculateVillagerCount()` function correctly computes: totalPlayers - sum(specialRoles)
- [ ] Calculation iterates role registry to identify special roles dynamically
- [ ] Negative villager counts detected and flagged as validation errors
- [ ] Zero villager counts detected and flagged as validation warnings
- [ ] Villager count exposed in validation result object for UI display
- [ ] Calculation memoized to prevent unnecessary recomputation

### AC-4: React Hook Integration
- [ ] `useRoleValidation(roleConfiguration, totalPlayers)` hook created and exported
- [ ] Hook returns validation state: `{ isValid, hasErrors, hasWarnings, errors, warnings, villagerCount }`
- [ ] Validation debounced to 100ms preventing excessive recalculation
- [ ] Hook uses `useMemo` for result caching based on dependencies
- [ ] Hook integrates with components via callback: `onValidationChange(validationState)`
- [ ] Hook located in `src/hooks/useRoleValidation.js`

### AC-5: Error Message Quality
- [ ] Error messages use role display names (not IDs) from registry
- [ ] Messages include specific constraint values: "Police count must be between 0 and 2"
- [ ] Messages provide actionable suggestions: "Reduce special roles to leave at least 1 villager"
- [ ] Multi-violation errors list all issues clearly
- [ ] Messages are concise (1-2 sentences) and non-technical

### AC-6: Edge Case Handling
- [ ] Configuration: 20 players, 21 total roles → ERROR with clear message
- [ ] Configuration: 20 players, 5 Mafia, 3 Police, 3 Doctor (9 villagers) → VALID
- [ ] Configuration: 20 players, 10 Mafia, 5 Police, 5 Doctor (0 villagers) → WARNING
- [ ] Configuration: 20 players, Police count = 3 (max: 2) → ERROR
- [ ] Configuration: 5 players, 0 Mafia, 2 Police, 2 Doctor (1 villager) → VALID with WARNING
- [ ] Configuration: negative role counts → ERROR (blocked at input level, validated here)

### AC-7: Integration with Existing Patterns
- [ ] Validation result structure compatible with `AllocationConfirmationFlow` component
- [ ] Edge case validation patterns match existing `edgeCaseValidation.js` severity levels
- [ ] Existing Mafia count edge cases (0 Mafia, almost-all Mafia) preserved as rules
- [ ] `requiresConfirmation` flag set for WARNING-severity edge cases
- [ ] Validation hook follows existing pattern: `useMafiaCountValidation` → `useRoleValidation`

### AC-8: Performance Requirements
- [ ] Validation execution completes in <10ms (average over 1000 iterations, 4 roles, 20 players)
- [ ] UI validation feedback appears within 100ms of input change (debounced)
- [ ] No performance degradation with 10+ validation rules (stress tested)
- [ ] Memoization prevents redundant calculations when inputs unchanged (verified via profiling)
- [ ] Bundle size impact <3KB minified and gzipped

### AC-9: Extensibility & Developer Experience
- [ ] New validation rule added to rule array without framework modifications (demonstrated)
- [ ] Rules access role registry for data-driven constraints (no hardcoded values)
- [ ] Developer guide (`docs/ROLE_EXTENSIBILITY.md`) includes validation rule creation section
- [ ] Example custom rule provided: `createMutualExclusivityRule(['POLICE', 'CORRUPT_POLICE'])`
- [ ] JSDoc annotations provide IDE autocomplete for validation patterns

### AC-10: Testing Coverage
- [ ] Unit tests achieve 90%+ coverage for validation framework and rules
- [ ] Each validation rule tested with valid, invalid, and edge case inputs
- [ ] Integration tests verify hook behavior in React component context
- [ ] Performance tests measure validation execution time (<10ms verified)
- [ ] Edge case tests cover: 0 players, 100 players, all special roles, negative counts
- [ ] Regression tests ensure existing Mafia validation patterns unchanged

### AC-11: Accessibility Compliance
- [ ] Validation errors announced to screen readers via `role="alert"` (in UI component)
- [ ] Error messages associated with inputs via `aria-describedby` (in UI component)
- [ ] Validation state communicated through `aria-invalid` (in UI component)
- [ ] Color-coded feedback supplemented with icons (ERROR: ❌, WARNING: ⚠️, INFO: ℹ️)
- [ ] Keyboard navigation works correctly with validation feedback

## 8. Out of Scope

**Explicitly NOT included in this feature:**

**UI Components:**
- Role input components or counter controls
- Error message display components or styling
- Validation state visual indicators (colors, icons in actual UI)
- Form integration or submission handling
- Modal dialogs or confirmation flows

**Role Registry:**
- Role definitions or metadata (handled by Role Registry System feature)
- Role constraints configuration
- Registry API functions or access patterns
- Role color palettes or descriptions

**Assignment Engine:**
- Role assignment algorithm or Fisher-Yates shuffle
- Player-to-role mapping logic
- Assignment verification or integrity checks
- Re-allocation logic or state cleanup

**State Management:**
- Application-level state structure for role configurations
- React context or global state integration
- State persistence or local storage
- State reset or cleanup logic

**Advanced Validation Features:**
- Cross-role dependency validation (e.g., "Detective requires at least 1 Mafia")
- Mutual exclusivity rules (e.g., "Police and Corrupt Police cannot coexist")
- Dynamic constraint generation based on game size
- Role balance recommendations or suggestions
- Historical configuration tracking or analytics

**Backend Integration:**
- Server-side validation or API calls
- Configuration persistence or cloud sync
- Validation logging or telemetry
- User preference storage

**Localization:**
- Multi-language error messages
- Internationalized number formatting
- Locale-specific validation rules
- Translation framework integration

**Complex Validation Scenarios:**
- Team balance validation (Mafia:Villager ratio recommendations)
- Role synergy validation (complementary role suggestions)
- Game difficulty assessment based on role configuration
- Win probability calculations

This feature focuses solely on **client-side validation logic and React hook integration**. UI presentation, state management, and advanced validation features are handled by separate features or considered future enhancements.
