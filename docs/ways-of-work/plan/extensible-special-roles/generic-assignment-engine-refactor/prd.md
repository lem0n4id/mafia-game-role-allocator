# Feature PRD: Generic Assignment Engine Refactor

## 1. Feature Name

**Generic Assignment Engine Refactor**

## 2. Epic

- **Parent Epic PRD:** [Extensible Special Roles System](../epic.md)
- **Architecture Specification:** [Epic Architecture](../arch.md)
- **Dependencies:** [Role Registry System](../role-registry-system/prd.md), [Multi-Role Validation Framework](../multi-role-validation-framework/prd.md)

## 3. Goal

**Problem:** The current `roleAssignmentEngine.js` is hardcoded for exactly two role types (Mafia and Villagers), using boolean arrays (true=Mafia, false=Villager) for role assignment. This architecture cannot support special roles like Police or Doctor without complete refactoring. The engine lacks extensibility—adding a third role type requires rewriting the Fisher-Yates shuffle logic, assignment data structures, and verification functions. The tight coupling between role types and assignment logic creates a maintenance burden and prevents the application from scaling to support multiple special roles, limiting gameplay variety and market competitiveness.

**Solution:** Refactor `roleAssignmentEngine.js` to a generic multi-role architecture that operates on role objects from the registry rather than boolean flags. Implement a role array builder that constructs a shuffleable array from role configuration dictionary (e.g., `{[ROLES.MAFIA]: 5, [ROLES.POLICE]: 1, [ROLES.DOCTOR]: 1, [ROLES.VILLAGER]: calculated}`), applies the existing Fisher-Yates shuffle once to randomize all roles, then assigns role objects to players. This approach maintains cryptographic randomization, preserves sub-millisecond performance, and supports unlimited role types without engine modifications. The enhanced assignment data structure will include complete role metadata (id, name, color, description) enabling downstream components to render role-specific UI.

**Impact:** This refactoring establishes the core extensibility foundation for special roles, enabling:
- **Zero Engine Changes:** New roles added via registry configuration without touching assignment engine code
- **Performance Maintained:** Sub-millisecond assignment times preserved (<200ms for 30 players with 10+ roles)
- **Backward Compatibility:** Existing two-role workflows unchanged; Mafia/Villager assignments identical to current behavior
- **Scalability:** Support for 50+ role types without performance degradation (tested conceptually)
- **Developer Velocity:** 4-hour role addition cycle enabled through generic architecture

## 4. User Personas

**Primary Persona - Game Facilitator (End User - Indirect Benefit):**
- **Age:** 22-35
- **Context:** Configuring and running games with special roles (Police, Doctor) for 10-20 participants
- **Pain Points:** Cannot use special roles in current app; forced to track manually or use physical cards
- **Goals:** Configure games with Police/Doctor, receive fair random assignments, trust assignment accuracy
- **Technical Comfort:** High mobile literacy but non-technical (doesn't see engine internals)

**Secondary Persona - Future Developer (Internal - Direct Benefit):**
- **Context:** Adding new role types (Detective, Serial Killer, Cupid) to expand gameplay variety
- **Pain Points:** Current engine hardcoded for two roles; adding third role requires complete rewrite
- **Goals:** Add roles without refactoring engine, understand assignment logic easily, maintain cryptographic randomization
- **Technical Comfort:** Experienced JavaScript developer familiar with algorithms and data structures

## 5. User Stories

**US-45: As a game facilitator, I want roles assigned fairly across all role types so that no player has an advantage**
- **Benefit:** Maintains game integrity with cryptographically secure randomization for Police, Doctor, Mafia, Villagers
- **Acceptance:** Fisher-Yates shuffle applied to all roles uniformly; assignment passes randomness distribution tests

**US-46: As a game facilitator, I want assignment to complete quickly so that I don't wait during game setup**
- **Benefit:** Maintains existing performance standards; no perceived delay when allocating roles
- **Acceptance:** Assignment completes in <200ms for 30 players with 5 role types (current: 0.12ms for 2 roles)

**US-47: As a game facilitator, I want assigned role counts to exactly match my configuration so that I trust the system**
- **Benefit:** Prevents assignment errors; guarantees 1 Police, 1 Doctor, 5 Mafia, 13 Villagers if configured
- **Acceptance:** Assignment verification confirms exact counts; zero count mismatches in 10,000 test assignments

**US-48: As a developer, I want to add new roles without modifying assignment engine code so that I avoid introducing bugs**
- **Benefit:** Reduces regression risk; new roles leverage existing tested shuffle algorithm
- **Acceptance:** Detective role added via registry entry; engine code unchanged; assignment generates Detective assignments

**US-49: As a developer, I want assignment data to include full role metadata so that UI components can render role-specific styling**
- **Benefit:** Enables role-specific colors, descriptions, icons in card list and reveal dialog
- **Acceptance:** Assignment objects include role.color, role.description from registry; UI components access this data

**US-50: As a developer, I want assignment verification to detect registry corruption so that invalid states are caught early**
- **Benefit:** Prevents runtime errors from malformed registry entries or state corruption
- **Acceptance:** Verification detects missing roles, invalid counts, null references; throws descriptive errors

## 6. Requirements

### Functional Requirements

**Role Array Builder:**
- Implement `buildRoleArray(roleConfiguration, totalPlayers, registry)` function converting role count dictionary to shuffleable array
- Algorithm: For each role in configuration, push `count` instances of role object to array; fill remaining slots with Villager role
- Example: `{[ROLES.MAFIA]: 5, [ROLES.POLICE]: 1, [ROLES.DOCTOR]: 1}` with 20 players → array of 5 MAFIA objects, 1 POLICE object, 1 DOCTOR object, 13 VILLAGER objects
- Validate total role count equals total players before building array; throw error if mismatch detected
- Return immutable array of role objects (frozen to prevent mutation during shuffle)

**Generic Fisher-Yates Shuffle:**
- Refactor existing `fisherYatesShuffle()` to operate on role object arrays instead of boolean arrays
- Maintain cryptographically secure randomization using `crypto.getRandomValues()` with Math.random() fallback
- Shuffle algorithm unchanged: iterate backwards, swap with random earlier index
- Preserve O(n) complexity and sub-millisecond performance for arrays up to 100 elements
- Return shuffled array (in-place mutation acceptable as array is local to function)

**Enhanced Assignment Data Structure:**
- Replace current structure: `{ id, name, role: 'MAFIA'|'VILLAGER', index, revealed }` 
- New structure: `{ id, name, role: {id, name, team, color, description, displayOrder, isSpecialRole}, index, revealed }`
- `id`: Player index (0-based integer)
- `name`: Player name (string from input)
- `role`: Complete role object from registry including metadata
- `index`: Assignment order (0-based, matches id for consistency)
- `revealed`: Boolean tracking reveal status (default: false)

**Assignment Function Refactor:**
- Update `assignRoles(playerNames, roleConfiguration)` signature to accept role configuration dictionary instead of `mafiaCount`
- Internal logic: Build role array → Shuffle → Zip with player names → Create assignment objects
- Generate unique assignment ID: `assign_{timestamp}_{random}` for tracking/debugging
- Return assignment result: `{ id, timestamp, players: [...], metadata: {...}, statistics: {...} }`
- Maintain backward compatibility: Support legacy signature `assignRoles(playerNames, mafiaCount)` via adapter function

**Assignment Verification:**
- Implement `verifyAssignment(assignment, expectedRoleCounts, registry)` function validating assignment integrity
- Verification checks: (1) Player count matches expected, (2) Role counts match configuration, (3) No null/undefined roles, (4) All roles exist in registry
- Return verification result: `{ isValid: boolean, errors: string[] }` with specific error messages for each issue
- Throw descriptive errors for critical issues (missing registry, null players); return validation errors for count mismatches
- Integrate verification into `assignRoles()` as final step before returning assignment

**Assignment Metadata & Statistics:**
- Include metadata in assignment result: `{ totalPlayers, roleConfiguration, timestamp, assignmentId, version }`
- Calculate statistics: `{ roleDistribution: {roleId: count}, teamDistribution: {team: count} }`
- Example statistics: `{ roleDistribution: {MAFIA: 5, POLICE: 1, DOCTOR: 1, VILLAGER: 13}, teamDistribution: {mafia: 5, special: 2, villager: 13} }`
- Statistics used for UI display (confirmation dialog, progress tracking) and debugging
- Version field tracks engine version for future compatibility (current: '2.0.0-multi-role')

**Error Handling & Edge Cases:**
- Handle empty player names array: throw error "Player names array cannot be empty"
- Handle role configuration exceeding total players: throw error "Total role counts ({sum}) exceeds total players ({count})"
- Handle missing registry roles: throw error "{roleId} not found in role registry"
- Handle fractional role counts: throw error "Role counts must be integers"
- Handle negative counts: throw error "Role counts cannot be negative" (should be caught by validation framework first)

### Non-Functional Requirements

**Performance:**
- Assignment completes in <200ms for 30 players with 10 role types (target: <50ms)
- Role array building: O(n) complexity where n = totalPlayers (acceptable overhead)
- Shuffle operation: O(n) complexity maintained from existing implementation
- No memory leaks: Arrays garbage collected after assignment; no retained references
- Bundle size impact: <5KB increase (new functions, enhanced data structures)

**Backward Compatibility:**
- Existing `assignRoles(playerNames, mafiaCount)` signature supported via adapter function
- Adapter converts `mafiaCount` to `{MAFIA: mafiaCount, VILLAGER: calculated}` configuration
- Legacy assignment structure compatible with existing components during migration period
- Existing tests pass without modifications (legacy signature paths covered)
- Gradual migration path: Components update to new signature independently

**Code Quality:**
- Comprehensive JSDoc documentation for all functions with parameter types and examples
- Pure functions with no side effects (except shuffle array mutation)
- Unit tests achieve 95%+ coverage for assignment logic, edge cases, verification
- Integration tests validate end-to-end assignment flow with various role configurations
- Performance benchmarks measure assignment time across role type variations

**Maintainability:**
- Separation of concerns: Role array building, shuffling, verification are distinct functions
- Clear function naming: `buildRoleArray()`, `shuffleRoles()`, `verifyAssignment()`, `createAssignmentResult()`
- Minimal cyclomatic complexity: Each function single responsibility, <10 branches
- Comprehensive error messages with context for debugging
- Code comments explain algorithmic decisions and performance optimizations

**Extensibility:**
- Engine code agnostic to specific role types; operates on generic role objects
- New roles supported without engine changes (demonstrated with 10+ test roles)
- Assignment data structure extensible: Future fields (e.g., role.priority, role.icon) automatically included
- Verification framework extensible: Custom verification rules added via composition
- Future enhancements possible: Weighted random assignment, role synergy optimization (out of scope now)

**Testing & Validation:**
- Unit tests for role array builder: Valid configurations, edge cases (0 special roles, all special roles)
- Unit tests for shuffle: Randomness distribution over 10,000 iterations (each role type appears uniformly)
- Unit tests for verification: Valid assignments pass, invalid assignments caught with specific errors
- Integration tests: End-to-end assignment flow with various role configurations (2-10 role types)
- Performance tests: Measure assignment time for 1, 10, 30, 50, 100 players with varying role counts

## 7. Acceptance Criteria

### AC-1: Role Array Builder Implementation
- [ ] `buildRoleArray(roleConfiguration, totalPlayers, registry)` function created and exported
- [ ] Function converts role configuration dictionary to array of role objects
- [ ] Example: `{MAFIA: 2, POLICE: 1}` with 5 players → array of 2 MAFIA, 1 POLICE, 2 VILLAGER objects
- [ ] Function fills remaining slots with VILLAGER role automatically
- [ ] Function throws error if total role counts exceeds total players
- [ ] Function validates all role IDs exist in registry before building

### AC-2: Generic Fisher-Yates Shuffle
- [ ] Shuffle function operates on role object arrays (not boolean arrays)
- [ ] Cryptographic randomization maintained using `crypto.getRandomValues()`
- [ ] Shuffle passes randomness distribution test (1% max deviation over 10,000 iterations)
- [ ] O(n) complexity preserved; performance <1ms for 100-element arrays
- [ ] Function pure: Does not modify input when immutability required (or documents in-place mutation)

### AC-3: Enhanced Assignment Data Structure
- [ ] Player objects include full role metadata: `{ id, name, role: {id, name, team, color, description}, index, revealed }`
- [ ] Role object contains complete registry data (not just role ID or name)
- [ ] Assignment result includes metadata: `{ id, timestamp, players, metadata, statistics }`
- [ ] Statistics calculated correctly: `roleDistribution` and `teamDistribution` match configuration
- [ ] Assignment ID generated uniquely for each assignment (`assign_{timestamp}_{random}` format)

### AC-4: Assignment Function Refactor
- [ ] `assignRoles(playerNames, roleConfiguration)` accepts role configuration dictionary
- [ ] Function builds role array → shuffles → creates player objects → verifies → returns result
- [ ] Backward compatibility: Legacy signature `assignRoles(playerNames, mafiaCount)` supported via adapter
- [ ] Adapter converts `mafiaCount` to `{MAFIA: mafiaCount, VILLAGER: calculated}` automatically
- [ ] Existing tests pass without modifications using legacy signature

### AC-5: Assignment Verification
- [ ] `verifyAssignment(assignment, expectedRoleCounts, registry)` function implemented
- [ ] Verification checks player count, role counts, null roles, registry existence
- [ ] Function returns `{ isValid: boolean, errors: string[] }` with specific error messages
- [ ] Verification integrated into `assignRoles()` as final step before return
- [ ] Invalid assignments throw descriptive errors preventing return of corrupted data

### AC-6: Edge Case Handling
- [ ] Configuration: 20 players, {MAFIA: 5, POLICE: 1, DOCTOR: 1} → 13 Villagers assigned correctly
- [ ] Configuration: 10 players, {MAFIA: 0, POLICE: 2, DOCTOR: 2} → 6 Villagers, all roles assigned
- [ ] Configuration: 5 players, {MAFIA: 2, POLICE: 1, DOCTOR: 1, VILLAGER: 1} → Assignment correct (0 auto-filled villagers)
- [ ] Error case: 10 players, {MAFIA: 11} → Throws error "Total role counts exceed total players"
- [ ] Error case: Empty player names → Throws error "Player names array cannot be empty"
- [ ] Error case: Role ID not in registry → Throws error "{roleId} not found in role registry"

### AC-7: Performance Requirements
- [ ] Assignment completes in <200ms for 30 players with 10 role types (measured)
- [ ] Assignment completes in <50ms for typical configs: 20 players, 4 role types (measured)
- [ ] Role array building executes in <5ms for 30 players (measured)
- [ ] Shuffle executes in <1ms for 30-element array (measured)
- [ ] No memory leaks detected after 1000 sequential assignments (profiled)

### AC-8: Randomness Validation
- [ ] Randomness distribution test: 10,000 assignments of 20 players, {MAFIA: 5, POLICE: 1, DOCTOR: 1}
- [ ] Each player receives each role approximately equally across iterations (±1% deviation)
- [ ] Mafia role distributed evenly: Each player ~25% Mafia assignments (5/20)
- [ ] Police role distributed evenly: Each player ~5% Police assignments (1/20)
- [ ] No bias detected: Chi-squared test passes with p-value > 0.05

### AC-9: Backward Compatibility
- [ ] Legacy signature `assignRoles(playerNames, mafiaCount)` works correctly
- [ ] Legacy assignments produce identical results to current production behavior
- [ ] Existing components (AllocationConfirmationFlow, CardListInterface) work with new assignments
- [ ] Existing tests pass with legacy signature (no test modifications required)
- [ ] Migration path documented: Components update to new signature independently

### AC-10: Code Quality & Testing
- [ ] Unit tests achieve 95%+ coverage for assignment engine functions
- [ ] Each function (buildRoleArray, shuffle, verify, assignRoles) tested independently
- [ ] Integration tests cover end-to-end assignment flow with 2, 4, 6, 10 role types
- [ ] Performance benchmarks run in CI measuring assignment time for various configurations
- [ ] JSDoc documentation complete for all public functions with examples

### AC-11: Integration with Registry & Validation
- [ ] Engine reads role objects from registry (via `getRoleById()`)
- [ ] Engine validates role configuration against registry constraints (via validation framework)
- [ ] Villager role automatically used for remaining slots (read from registry)
- [ ] Assignment result includes role metadata enabling UI to render colors/descriptions
- [ ] Engine throws errors if registry unavailable or corrupted

## 8. Out of Scope

**Explicitly NOT included in this feature:**

**UI Components:**
- Role input components or configuration interface
- Assignment result display or card list rendering
- Role reveal dialog or sequential reveal flow
- Confirmation dialogs or allocation workflows

**State Management:**
- React hooks for managing assignments or configurations
- Application state structure for role configurations
- State persistence, reset, or cleanup logic
- Re-allocation state management or history tracking

**Validation Framework:**
- Role configuration validation (handled by Multi-Role Validation Framework feature)
- Cross-role constraint checking
- Edge case detection or warning messages
- User-facing validation error display

**Role Registry:**
- Role definitions or metadata (handled by Role Registry System feature)
- Registry API functions or access patterns
- Role constraints or configuration schema
- Color palettes or role descriptions

**Advanced Assignment Features:**
- Weighted random assignment (e.g., prefer balanced distributions)
- Role synergy optimization (complementary role pairings)
- Constrained random assignment (e.g., no adjacent Mafia players)
- Assignment history tracking or analytics
- Undo/redo assignment functionality

**Performance Optimization (Beyond Requirements):**
- Memoization of assignment results (unnecessary; assignments always unique)
- Web Workers for parallel shuffle (overkill for <200ms requirement)
- Assembly/WASM optimization (premature optimization)
- Lazy loading of assignment engine module

**Testing Infrastructure:**
- E2E testing framework or scenarios
- Visual regression testing for assignment results
- Load testing or stress testing beyond performance benchmarks
- Mutation testing or property-based testing

This feature focuses solely on **refactoring the assignment engine for multi-role support**. UI integration, state management, and validation are handled by separate features. The goal is a generic, performant, well-tested assignment engine that serves as the foundation for extensible special roles.
