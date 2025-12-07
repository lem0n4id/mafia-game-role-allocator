# Feature PRD: Role Registry System

## 1. Feature Name

**Role Registry System**

## 2. Epic

- **Parent Epic PRD:** [Extensible Special Roles System](../epic.md)
- **Architecture Specification:** [Epic Architecture](../arch.md)

## 3. Goal

**Problem:** The current Mafia Game Role Allocator hardcodes role logic (Mafia vs. Villagers) throughout the codebase, making it extremely difficult to add new roles. Adding a single role requires modifying the assignment engine, validation logic, UI components, and state management—a 2-week refactoring effort with high regression risk. There's no centralized source of truth for role metadata (colors, descriptions, constraints), leading to scattered and inconsistent role definitions. This architectural limitation blocks the ability to support special roles like Police and Doctor, limiting the application's value proposition and market competitiveness.

**Solution:** Implement a centralized Role Registry System (`src/utils/roleRegistry.js`) that serves as the single source of truth for all role metadata. The registry will define roles as immutable configuration objects containing: id, name, team, color palette, description, and constraints (min/max/default counts). The system will provide a clean API (`getRoles()`, `getRoleById()`, `getRolesByTeam()`) for accessing role data throughout the application. By externalizing role definitions from code logic, the registry enables a plugin-like architecture where new roles can be added through simple configuration without modifying existing components.

**Impact:** This feature establishes the architectural foundation for the extensible special roles system, enabling:
- **Developer Velocity:** Reduce time to add new roles from 2 weeks to 4 hours (95% reduction)
- **Code Maintainability:** Eliminate 15+ hardcoded role conditionals across codebase, reducing cyclomatic complexity by 40%
- **Future Extensibility:** Support unlimited role types (tested conceptually to 50+ roles) without performance degradation
- **Technical Debt Reduction:** Centralize role definitions preventing scattered inconsistent implementations
- **Zero Breaking Changes:** Maintain backward compatibility with existing two-role workflows

## 4. User Personas

**Primary Persona - Future Developers (Internal):**
- **Context:** Developers tasked with adding new role types (Detective, Serial Killer, Cupid, etc.) to expand gameplay variety
- **Pain Points:** Current hardcoded architecture requires deep codebase knowledge and extensive refactoring to add single role
- **Goals:** Add new roles quickly with minimal code changes, understand role integration points easily, avoid breaking existing functionality
- **Technical Comfort:** Experienced React developers familiar with modern JavaScript patterns

**Secondary Persona - Advanced Game Facilitator (External - Indirect Benefit):**
- **Context:** Experienced Mafia players who want to configure games with special roles (Police, Doctor)
- **Pain Points:** Current app only supports Mafia/Villagers, forcing manual tracking of special roles
- **Goals:** Configure complex game setups with multiple role types through intuitive interface
- **Technical Comfort:** High mobile literacy but non-technical (doesn't interact with registry directly)

**Note:** This is primarily an **internal infrastructure feature** enabling future user-facing features. End users benefit indirectly through faster delivery of new role types.

## 5. User Stories

**US-31: As a developer, I want a centralized role registry so that I can add new roles without modifying core engine logic**
- **Benefit:** Eliminates need to refactor assignment engine, validation framework, or state management when adding roles
- **Acceptance:** New role added via registry entry, no changes to `roleAssignmentEngine.js` required

**US-32: As a developer, I want role metadata (colors, descriptions, constraints) in one location so that I can maintain consistent role definitions**
- **Benefit:** Prevents scattered inconsistent role configurations across components
- **Acceptance:** All role properties defined in single registry object, accessed via API functions

**US-33: As a developer, I want immutable role configurations so that runtime corruption cannot occur**
- **Benefit:** Prevents accidental mutation bugs that could break role assignment logic
- **Acceptance:** Registry objects frozen with `Object.freeze()`, mutation attempts throw errors in strict mode

**US-34: As a developer, I want clear registry API functions so that I can access role data easily in components**
- **Benefit:** Simplifies component integration with standardized access patterns
- **Acceptance:** `getRoles()`, `getRoleById()`, `getRolesByTeam()` functions documented and tested

**US-35: As a developer, I want JSDoc type annotations on registry schema so that I get IDE autocomplete and type checking**
- **Benefit:** Improves development experience with inline documentation and compile-time validation
- **Acceptance:** All registry functions and schemas have comprehensive JSDoc comments with examples

**US-36: As a developer, I want predefined roles (Mafia, Police, Doctor, Villager) in the registry so that I have working examples to follow**
- **Benefit:** Provides templates for adding new roles with proper metadata structure
- **Acceptance:** Four initial roles defined with complete metadata including colors, descriptions, constraints

**US-37: As a developer, I want role priority ordering so that UI renders roles in logical sequence (Mafia, Police, Doctor, Villagers)**
- **Benefit:** Ensures consistent role presentation order across UI components
- **Acceptance:** Registry supports optional `priority` field for sort ordering

## 6. Requirements

### Functional Requirements

**Registry Core Structure:**
- Define role schema with required fields: `id` (string, unique, uppercase), `name` (string, display name), `team` (enum: 'mafia' | 'special' | 'villager')
- Include color palette for each role: `color: { primary, secondary, border, text, accent }` matching Tailwind CSS color codes
- Store role description (string, 1-2 sentences) explaining role ability for reveal dialog display
- Define role constraints: `constraints: { min: number, max: number, default: number }` for validation framework
- Support optional fields: `icon` (string, SVG path or icon identifier), `priority` (number, sort order)
- Implement role configuration as frozen JavaScript objects preventing runtime mutation

**Predefined Role Definitions:**
- **MAFIA Role:** id='MAFIA', name='Mafia', team='mafia', color palette (red-600, red-50, red-500, red-800, red-700), description="Eliminate villagers to win", constraints (min: 0, max: Infinity, default: 1), priority: 1
- **POLICE Role:** id='POLICE', name='Police', team='special', color palette (blue-600, blue-50, blue-500, blue-800, blue-700), description="Investigate one player each night", constraints (min: 0, max: 2, default: 0), priority: 2
- **DOCTOR Role:** id='DOCTOR', name='Doctor', team='special', color palette (green-600, green-50, green-500, green-800, green-700), description="Protect one player each night", constraints (min: 0, max: 2, default: 0), priority: 3
- **VILLAGER Role:** id='VILLAGER', name='Villager', team='villager', color palette (gray-500, gray-50, gray-300, gray-700, gray-600), description="Work with others to identify Mafia", constraints (min: 0, max: Infinity, default: calculated), priority: 4

**Registry API Functions:**
- `getRoles()`: Returns array of all role definitions sorted by priority (ascending order)
- `getRoleById(id)`: Returns specific role definition object or null if not found, case-insensitive lookup
- `getRolesByTeam(team)`: Returns array of roles filtered by team ('mafia', 'special', 'villager')
- `getSpecialRoles()`: Returns array of roles excluding Villager (convenience function for UI rendering)
- `validateRoleCount(roleId, count, totalPlayers)`: Validates proposed count against role constraints and total player limit, returns validation result object

**Registry Initialization:**
- Export registry as named constant `ROLE_REGISTRY` for direct access in tests/debugging
- Freeze all role definition objects on module load to ensure immutability
- Initialize registry synchronously (no async loading) for immediate availability in React components
- Validate registry structure on module load throwing descriptive errors if schema violations detected

### Non-Functional Requirements

**Performance:**
- Registry access functions (`getRoles()`, `getRoleById()`) execute in <1ms (O(1) or O(n) with small n)
- Registry loaded once at application initialization, cached in memory throughout session
- No runtime overhead from registry lookups; memoization not required due to small dataset (4-10 roles)
- Bundle size impact: Registry file <2KB minified (currently 4 roles × ~0.5KB each)

**Maintainability:**
- Registry schema documented with comprehensive JSDoc comments including @typedef definitions
- Each role definition includes inline comments explaining color choices and constraint rationale
- Registry file structured for readability: clear sections, consistent formatting, logical role ordering
- Unit tests cover all API functions, edge cases (invalid IDs, null checks), and schema validation
- Developer guide (`docs/ROLE_EXTENSIBILITY.md`) includes step-by-step instructions for adding roles

**Type Safety (via JSDoc):**
- Define `@typedef {Object} RoleDefinition` with all required and optional properties
- Define `@typedef {Object} RoleColor` describing color palette structure
- Define `@typedef {Object} RoleConstraints` for min/max/default validation rules
- All API functions annotated with `@param`, `@returns`, and `@throws` JSDoc tags
- Include usage examples in JSDoc comments for each function

**Extensibility:**
- Registry structure supports future fields (e.g., `icon`, `soundEffect`, `animationClass`) without breaking changes
- API functions handle unknown role IDs gracefully returning null rather than throwing errors
- Schema validation extensible via optional `validateRole()` function for custom validation rules
- Registry supports 50+ roles without performance degradation (tested conceptually)

**Backward Compatibility:**
- Registry includes existing MAFIA and VILLAGER roles with identical behavior to current implementation
- Role IDs match current `ROLES.MAFIA` and `ROLES.VILLAGER` constants ensuring seamless migration
- Components using legacy role constants continue to work during transition period
- No breaking changes to existing assignment engine or validation logic during registry integration

**Testing & Validation:**
- Unit tests achieve 100% coverage of registry API functions and schema validation
- Tests verify immutability: mutation attempts on role objects throw errors or fail silently
- Tests validate all predefined roles conform to schema (required fields present, correct types)
- Integration tests verify registry data flows correctly to dependent components (engine, UI, validation)
- Performance tests measure registry access times ensuring <1ms execution

## 7. Acceptance Criteria

### AC-1: Registry Schema & Structure
- [ ] Role schema defined with all required fields: `id`, `name`, `team`, `color`, `description`, `constraints`
- [ ] Optional fields supported: `icon`, `priority`
- [ ] Color palette includes five properties: `primary`, `secondary`, `border`, `text`, `accent`
- [ ] Constraints include three properties: `min`, `max`, `default`
- [ ] Team enum validated to only allow: 'mafia', 'special', 'villager'
- [ ] Registry file located at `src/utils/roleRegistry.js`

### AC-2: Predefined Role Definitions
- [ ] MAFIA role defined with correct metadata (red color palette, team='mafia', priority=1)
- [ ] POLICE role defined with correct metadata (blue color palette, team='special', max=2, priority=2)
- [ ] DOCTOR role defined with correct metadata (green color palette, team='special', max=2, priority=3)
- [ ] VILLAGER role defined with correct metadata (gray color palette, team='villager', priority=4)
- [ ] All role descriptions are 1-2 sentences explaining role ability
- [ ] All roles include complete color palettes with Tailwind CSS color codes

### AC-3: Registry API Functions
- [ ] `getRoles()` returns all roles sorted by priority (Mafia, Police, Doctor, Villager order)
- [ ] `getRoleById('MAFIA')` returns MAFIA role definition object
- [ ] `getRoleById('invalid')` returns null (not undefined or error)
- [ ] `getRoleById()` is case-insensitive: 'mafia', 'MAFIA', 'Mafia' all work
- [ ] `getRolesByTeam('special')` returns array containing Police and Doctor roles only
- [ ] `getSpecialRoles()` returns all non-villager roles (Mafia, Police, Doctor)
- [ ] `validateRoleCount('POLICE', 3, 20)` returns validation error (exceeds max=2)
- [ ] `validateRoleCount('POLICE', 1, 20)` returns valid result

### AC-4: Immutability & Data Integrity
- [ ] All role definition objects frozen with `Object.freeze()` on module load
- [ ] Attempting to modify role properties (e.g., `role.name = 'New Name'`) fails silently or throws error
- [ ] Registry array itself immutable; `ROLE_REGISTRY.push(newRole)` prevented
- [ ] Role definitions validated on module load; invalid schema throws descriptive error
- [ ] Registry initialization is synchronous (no async/await required)

### AC-5: JSDoc Type Annotations
- [ ] `@typedef RoleDefinition` defined with all properties and types documented
- [ ] `@typedef RoleColor` defined describing color palette structure
- [ ] `@typedef RoleConstraints` defined for validation rules
- [ ] All API functions include `@param` annotations with types and descriptions
- [ ] All API functions include `@returns` annotations describing return values
- [ ] Each function includes usage example in JSDoc comments

### AC-6: Performance Requirements
- [ ] `getRoles()` executes in <1ms (average over 1000 calls)
- [ ] `getRoleById()` executes in <1ms (average over 1000 calls)
- [ ] Registry file size <2KB minified and gzipped
- [ ] No runtime performance impact on existing assignment engine (<0.12ms maintained)
- [ ] Registry supports 50 roles without performance degradation (stress tested)

### AC-7: Testing Coverage
- [ ] Unit tests achieve 100% code coverage for registry module
- [ ] Tests verify all API functions return expected data structures
- [ ] Tests validate immutability (mutation attempts properly handled)
- [ ] Tests confirm all predefined roles conform to schema
- [ ] Tests verify role priority sorting works correctly
- [ ] Tests validate constraint checking in `validateRoleCount()`
- [ ] Tests confirm graceful handling of invalid inputs (null, undefined, empty strings)

### AC-8: Documentation & Developer Experience
- [ ] `docs/ROLE_EXTENSIBILITY.md` includes "Adding a New Role" section with step-by-step guide
- [ ] Developer guide includes copy-paste template for new role definition
- [ ] Registry schema fully documented with field explanations and examples
- [ ] JSDoc comments provide IDE autocomplete for all API functions
- [ ] Code comments explain design decisions (why frozen objects, priority ordering rationale)

## 8. Out of Scope

**Explicitly NOT included in this feature:**

**Role Assignment Logic:**
- Actual role assignment algorithm (handled by separate Assignment Engine refactor feature)
- Fisher-Yates shuffle implementation or modifications
- Player-to-role mapping logic
- Assignment validation or verification

**UI Components:**
- Role input components or controls
- Role display in card list interface
- Role reveal dialog enhancements
- Visual styling or color application in components

**State Management:**
- React hooks for managing role configurations
- Application state structure for role counts
- Integration with App.jsx or component state
- State persistence or cleanup logic

**Validation Framework:**
- Multi-role validation rules or framework
- Cross-role constraint checking (mutual exclusivity, dependencies)
- Edge case detection for role configurations
- Validation error messaging or UI feedback

**Advanced Role Features:**
- Custom user-defined roles
- Role editing or customization interface
- Dynamic role loading from external sources
- Role localization or internationalization

**Gameplay Mechanics:**
- Role-specific abilities or actions
- Night/day phase management
- Role interaction rules or effects
- Win condition calculations

**Performance Optimization:**
- Component memoization strategies
- Lazy loading of role definitions
- Dynamic imports or code splitting
- Cache invalidation or refresh mechanisms

**Testing Infrastructure:**
- Integration test setup or framework
- E2E testing scenarios
- Performance benchmarking tools
- Test data generation utilities

This feature is purely the **foundational data layer** (registry + API) that other features will consume. It does not include any UI, state management, or business logic beyond data access.
