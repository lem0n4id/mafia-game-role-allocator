# Feature PRD: Role Configuration UI System

## 1. Feature Name

**Role Configuration UI System**

## 2. Epic

- **Parent Epic PRD:** [Extensible Special Roles System](../epic.md)
- **Architecture Specification:** [Epic Architecture](../arch.md)
- **Dependencies:** [Role Registry System](../role-registry-system/prd.md), [Multi-Role Validation Framework](../multi-role-validation-framework/prd.md)

## 3. Goal

**Problem:** The current UI only supports configuring a single role count (Mafia via `MafiaCountValidator`), hardcoded with a single counter control and validation logic. With the introduction of special roles (Police, Doctor), the application needs to render multiple role inputs dynamically based on the role registry. The existing component architecture cannot scale—adding Police and Doctor would require duplicating MafiaCountValidator with hardcoded component names, validation hooks, and state management for each role. This approach creates maintenance burden, inconsistent UI patterns, and prevents the extensibility goal of adding roles via registry configuration alone.

**Solution:** Implement a data-driven Role Configuration UI System with two new components: `RoleConfigurationManager` (orchestrator) and `RoleInput` (generic reusable control). The RoleConfigurationManager reads the role registry, renders a RoleInput for each special role (Mafia, Police, Doctor), and manages their state through a new `usePlayerRoleConfiguration` hook. Each RoleInput dynamically consumes role metadata (name, color, constraints) from the registry to render counter controls, labels, and validation feedback. The system will calculate villager count in real-time (`totalPlayers - sum(specialRoleCounts)`) and display a prominent role distribution summary with color-coded badges, providing users with clear visibility into their configuration before allocation.

**Impact:** This feature delivers the user-facing interface for special roles configuration, enabling:
- **User Experience:** Intuitive multi-role configuration with real-time villager calculation and validation feedback within 100ms
- **Visual Clarity:** Role distribution summary showing "5 Mafia, 1 Police, 1 Doctor, 13 Villagers (20 total)" with color-coded badges
- **Developer Extensibility:** New roles automatically render in UI when added to registry (zero UI code changes)
- **Mobile Optimization:** Touch-optimized counter controls (← N →) with 44px+ touch targets matching existing patterns
- **Accessibility:** Full WCAG AA compliance with ARIA labels, keyboard navigation, screen reader support

## 4. User Personas

**Primary Persona - Advanced Game Facilitator:**
- **Age:** 22-35
- **Context:** Configuring games with special roles for 10-20 player game nights
- **Pain Points:** Confusion about how special roles affect villager counts, unclear role distributions
- **Goals:** Configure Police/Doctor counts easily, see villager calculation in real-time, understand role distribution before allocation
- **Technical Comfort:** High mobile literacy, expects intuitive UI with immediate visual feedback

**Secondary Persona - New-to-Advanced Mafia Players:**
- **Age:** 18-30
- **Context:** Learning to configure games with special roles
- **Pain Points:** Not understanding role math, uncertain about valid configurations
- **Goals:** Learn valid role ratios through guided interface, see clear labels and error messages
- **Technical Comfort:** Moderate, needs clear visual hierarchy and progressive disclosure

**Tertiary Persona - Mobile-First Casual Organizers:**
- **Age:** 16-40
- **Context:** Setting up quick games at parties on mobile devices
- **Pain Points:** Limited time, small screen real estate, need fast configuration
- **Goals:** Touch-friendly controls, quick setup with sensible defaults, confidence in configuration
- **Technical Comfort:** Variable, expects mobile-optimized interface

## 5. User Stories

**US-51: As a game facilitator, I want to configure Police and Doctor counts so that I can run games with special roles**
- **Benefit:** Enables advanced Mafia gameplay with strategic role variety
- **Acceptance:** Police and Doctor inputs visible below Mafia input with counter controls (← N →)

**US-52: As a game facilitator, I want to see villager count update in real-time so that I understand how special roles affect distribution**
- **Benefit:** Eliminates mental math, provides transparent view of role composition
- **Acceptance:** Villager count displays dynamically: "13 Villagers" updates to "12 Villagers" when Police increased to 2

**US-53: As a game facilitator, I want a role distribution summary so that I can verify my configuration before allocation**
- **Benefit:** Provides confidence in setup before committing to role assignment
- **Acceptance:** Summary displays "5 Mafia, 1 Police, 1 Doctor, 13 Villagers (20 total)" with color-coded badges

**US-54: As a game facilitator, I want validation feedback so that I know if my configuration is invalid before clicking allocate**
- **Benefit:** Prevents wasted time configuring invalid setups, provides actionable error messages
- **Acceptance:** Error messages appear below inputs: "Total roles (21) exceeds total players (20). Reduce role counts."

**US-55: As a mobile user, I want touch-friendly counter controls so that I can easily adjust role counts on my phone**
- **Benefit:** Smooth mobile experience without fat-finger errors or tiny click targets
- **Acceptance:** Counter buttons 44px+ touch targets, increment/decrement work reliably on mobile devices

**US-56: As a user with visual impairments, I want screen reader support so that I can configure roles accessibly**
- **Benefit:** Ensures inclusive design meeting WCAG AA accessibility standards
- **Acceptance:** All inputs have proper ARIA labels, validation errors announced via `role="alert"`

**US-57: As a developer adding new roles, I want UI to render automatically so that I don't write new components**
- **Benefit:** Maintains extensibility promise of registry-driven architecture
- **Acceptance:** Adding "Detective" to registry makes Detective input appear in UI automatically

## 6. Requirements

### Functional Requirements

**RoleConfigurationManager Component:**
- Create `src/components/RoleConfigurationManager.jsx` as orchestrator for multi-role configuration
- Component reads special roles from registry via `getSpecialRoles()` excluding Villager
- Renders RoleInput component dynamically for each special role (Mafia, Police, Doctor)
- Manages role counts state via `usePlayerRoleConfiguration` custom hook
- Calculates villager count: `totalPlayers - sum(specialRoleCounts)` with real-time updates
- Renders role distribution summary with color-coded badges using hex colors from registry (`role.color.secondary` background, `role.color.text` text)
- Integrates validation framework via `useRoleValidation` displaying errors/warnings below inputs
- Notifies parent (App.jsx) of state changes via callback: `onRoleConfigurationChange(roleConfiguration)`

**RoleInput Component (Generic):**
- Create `src/components/RoleInput.jsx` as reusable data-driven input component
- Accept props: `role` (registry object), `value` (current count), `onChange` (callback), `totalPlayers`, `disabled`
- Render role label from `role.name` (e.g., "Number of Police Players")
- Render CounterControl component consuming role constraints: `min={role.constraints.min}`, `max={role.constraints.maxCalculator ? role.constraints.maxCalculator(totalPlayers) : role.constraints.max}`
- Apply role-specific color accents from `role.color.text` (hex) for labels and focus states
- Display role constraint hints: "Max: 2" below input (read from constraints)
- Support accessibility: `aria-label={role.name}`, `aria-describedby` for validation messages
- Component memoized with React.memo preventing unnecessary re-renders

**usePlayerRoleConfiguration Hook:**
- Create `src/hooks/usePlayerRoleConfiguration.js` custom hook for role configuration state management
- Initialize state: `{ [ROLES.MAFIA]: 1, [ROLES.POLICE]: 0, [ROLES.DOCTOR]: 0 }` reading defaults from registry
- Provide update function: `updateRoleCount(roleId, newCount)` updating specific role count
- Implement validation: Integrate `useRoleValidation` hook for real-time validation feedback
- Calculate derived state: `villagerCount`, `totalRoles`, `isValid`, `validationErrors`
- Return hook interface: `{ roleConfiguration, villagerCount, validation, updateRoleCount, reset }`
- Use `useCallback` and `useMemo` for performance optimization

**Role Distribution Summary:**
- Render prominent summary section showing all role counts including Villagers
- Format: "X Mafia, Y Police, Z Doctor, W Villagers (Total: N)"
- Display role counts as color-coded badges using role colors from registry (hex values)
- Example: Mafia (red hex badge), Police (blue hex badge), Doctor (green hex badge), Villager (gray hex badge)
- Summary updates in real-time as role counts change (<100ms response time)
- Position summary between role inputs and player names section for logical flow

**Villager Count Display:**
- Render calculated villager count prominently: "Villagers: 13" or "13 Villagers remaining"
- Update in real-time as special role counts change
- Color-code based on validity: Green if ≥1, Yellow if 0 (warning), Red if negative (error)
- Display with appropriate icon: ✓ (valid), ⚠️ (warning), ✗ (error)
- Position near role distribution summary or as inline feedback

**Validation Integration:**
- Display validation errors below respective role inputs (field-level feedback)
- Display global validation errors/warnings below summary (form-level feedback)
- Error styling: Red text, red border on invalid inputs, error icon
- Warning styling: Yellow text, yellow border, warning icon
- Success styling: Green checkmark when configuration valid
- ARIA attributes: `aria-invalid`, `aria-describedby` for accessibility

**Layout & Positioning:**
- Position RoleConfigurationManager between PlayerCountManager and player name inputs
- Logical flow: Player Count → Role Configuration (Mafia/Police/Doctor) → Villager Display → Player Names
- Vertical stacking on mobile (single column), responsive scaling for tablets
- Consistent spacing: 24px gaps between sections (matching existing design)
- Sticky summary on scroll (optional enhancement for long player lists)

**Default Values & Reset:**
- Initialize role counts from registry defaults: Mafia=1, Police=0, Doctor=0
- Preserve role configuration across player count changes (don't reset unnecessarily)
- Reset role counts to defaults when "Reset Game" clicked (via parent component)
- Support initialValues prop for pre-populating configuration (e.g., previous game settings)

### Non-Functional Requirements

**Performance:**
- Component renders in <50ms on mount (initial render)
- Role count updates render within 100ms of user interaction (debounced if needed)
- Villager calculation updates within 50ms of role count changes (memoized)
- No unnecessary re-renders: React.memo on RoleInput, useMemo/useCallback in hook
- Bundle size impact: <3KB for new components (RoleConfigurationManager, RoleInput, hook)

**Mobile Optimization:**
- Touch targets 44px+ minimum (counter buttons, role inputs)
- Responsive layout: 320px (iPhone SE) to 768px+ (tablets)
- Touch-optimized counter controls using existing CounterControl component pattern
- No horizontal scrolling at any viewport width
- Proper viewport handling: Safe area insets for notched devices

**Accessibility (WCAG AA Compliance):**
- All inputs have proper `<label>` elements or `aria-label` attributes
- Validation errors announced via `role="alert"` for screen readers
- Keyboard navigation: Tab through inputs, Enter to increment/decrement counters
- Focus visible indicators meeting 4.5:1 contrast ratio
- Screen reader support: Role names, current counts, validation messages announced
- Semantic HTML: Proper heading hierarchy, form structure, button labels

**Visual Design:**
- Consistent styling with existing components (Tailwind CSS classes)
- Role-specific color accents from registry (subtle, not overwhelming)
- Clear visual hierarchy: Labels bold, values large, constraints small/gray
- Error/warning/success states visually distinct (color + icon)
- Mobile-first design matching existing PlayerCountManager patterns

**Browser Compatibility:**
- iOS Safari 14+ (primary mobile target)
- Chrome Mobile 90+
- Android Chrome 90+
- Desktop browsers (fallback support, not primary focus)
- No IE11 support (modern browsers only per project requirements)

**Code Quality:**
- Prop validation with PropTypes for all components
- Comprehensive JSDoc documentation for hook and component APIs
- Unit tests for RoleInput (rendering, interactions, props)
- Integration tests for RoleConfigurationManager (state management, validation)
- Storybook stories (optional) for component documentation

## 7. Acceptance Criteria

### AC-1: RoleConfigurationManager Component
- [ ] Component created at `src/components/RoleConfigurationManager.jsx`
- [ ] Reads special roles from registry via `getSpecialRoles()`
- [ ] Renders RoleInput for Mafia, Police, Doctor dynamically (reads from registry, not hardcoded)
- [ ] Manages role counts state via `usePlayerRoleConfiguration` hook
- [ ] Displays role distribution summary: "5 Mafia, 1 Police, 1 Doctor, 13 Villagers (20 total)"
- [ ] Integrates validation framework showing errors/warnings
- [ ] Notifies parent via `onRoleConfigurationChange` callback

### AC-2: RoleInput Component (Generic)
- [ ] Component created at `src/components/RoleInput.jsx`
- [ ] Accepts props: `role`, `value`, `onChange`, `totalPlayers`, `disabled`
- [ ] Renders label from `role.name` (e.g., "Number of Police Players")
- [ ] Renders CounterControl with constraints from `role.constraints` (min/max/maxCalculator)
- [ ] Displays constraint hints: "Max: 2" below input
- [ ] Uses hex colors from `role.color` for styling
- [ ] Component memoized with React.memo
- [ ] Full PropTypes validation for all props

### AC-3: usePlayerRoleConfiguration Hook
- [ ] Hook created at `src/hooks/usePlayerRoleConfiguration.js`
- [ ] Initializes state from registry defaults: `{ [ROLES.MAFIA]: 1, [ROLES.POLICE]: 0, [ROLES.DOCTOR]: 0 }`
- [ ] Provides `updateRoleCount(roleId, newCount)` function
- [ ] Calculates `villagerCount = totalPlayers - sum(specialRoles)`
- [ ] Integrates `useRoleValidation` for real-time validation
- [ ] Returns interface: `{ roleConfiguration, villagerCount, validation, updateRoleCount, reset }`
- [ ] Uses `useCallback` and `useMemo` for optimization

### AC-4: Role Distribution Summary
- [ ] Summary displays all role counts: "5 Mafia, 1 Police, 1 Doctor, 13 Villagers (20 total)"
- [ ] Roles displayed as color-coded badges using registry hex colors
- [ ] Mafia badge red, Police badge blue, Doctor badge green, Villager badge gray (using hex values)
- [ ] Summary updates in real-time (<100ms after role count changes)
- [ ] Positioned between role inputs and player names section

### AC-5: Villager Count Display
- [ ] Villager count displayed prominently: "13 Villagers remaining"
- [ ] Updates in real-time as special role counts change
- [ ] Color-coded: Green (≥1), Yellow (0), Red (negative)
- [ ] Includes appropriate icon: ✓ (valid), ⚠️ (warning), ✗ (error)
- [ ] Calculation correct: 20 players - 5 Mafia - 1 Police - 1 Doctor = 13 Villagers

### AC-6: Validation Integration
- [ ] Field-level errors displayed below respective inputs
- [ ] Global errors/warnings displayed below summary
- [ ] Error styling: Red text, red border, error icon
- [ ] Warning styling: Yellow text, yellow border, warning icon
- [ ] Success styling: Green checkmark when valid
- [ ] ARIA attributes set correctly: `aria-invalid`, `aria-describedby`

### AC-7: Layout & Positioning
- [ ] RoleConfigurationManager positioned between PlayerCountManager and player name inputs
- [ ] Vertical stacking on mobile (single column layout)
- [ ] Consistent spacing: 24px gaps between sections
- [ ] Responsive layout works on 320px (iPhone SE) to 768px+ (tablets)
- [ ] No horizontal scrolling at any viewport width

### AC-8: Touch Optimization
- [ ] Counter buttons 44px+ touch targets (measured)
- [ ] Increment/decrement work reliably on touch devices (tested on iOS/Android)
- [ ] Tap feedback immediate (<100ms visual response)
- [ ] No accidental double-taps (debounced if needed)
- [ ] Touch-manipulation CSS applied for optimal mobile interactions

### AC-9: Accessibility (WCAG AA)
- [ ] All inputs have proper labels or `aria-label` attributes
- [ ] Validation errors announced via `role="alert"`
- [ ] Keyboard navigation works: Tab through inputs, arrow keys adjust counts
- [ ] Focus indicators visible meeting 4.5:1 contrast ratio
- [ ] Screen reader announces role names, counts, validation messages
- [ ] Semantic HTML used: Proper headings, form structure, button labels

### AC-10: Default Values & Reset
- [ ] Initial values read from registry: Mafia=1, Police=0, Doctor=0
- [ ] Role configuration preserved when player count changes
- [ ] Reset functionality clears role counts to defaults
- [ ] Support for `initialValues` prop (pre-population)

### AC-11: Extensibility (Developer Goal)
- [ ] Adding "Detective" role to registry makes it appear in UI automatically
- [ ] No RoleConfigurationManager code changes required for new roles
- [ ] No RoleInput code changes required for new roles
- [ ] New role rendered with correct label, constraints, colors from registry
- [ ] Validation automatically includes new role in calculations

### AC-12: Performance Requirements
- [ ] Component mounts in <50ms (initial render measured)
- [ ] Role count updates render within 100ms (interaction latency measured)
- [ ] Villager calculation updates within 50ms (memoized, measured)
- [ ] No unnecessary re-renders (React DevTools Profiler verified)
- [ ] Bundle size impact <3KB (measured in production build)

### AC-13: Testing Coverage
- [ ] Unit tests for RoleInput: Props, rendering, interactions
- [ ] Unit tests for usePlayerRoleConfiguration: State management, calculations
- [ ] Integration tests for RoleConfigurationManager: End-to-end flow
- [ ] Accessibility tests: ARIA attributes, keyboard navigation
- [ ] Visual regression tests (optional): UI consistency

## 8. Out of Scope

**Explicitly NOT included in this feature:**

**Player Name Inputs:**
- Player name input fields or management (handled by existing PlayerCountManager)
- Name validation or duplicate detection
- Dynamic field generation based on player count
- Name persistence or prefilling

**Allocation Flow:**
- Allocation confirmation dialog enhancements
- Role breakdown display in confirmation modal
- Assignment execution or engine integration
- Re-allocation button or logic

**Reveal Phase:**
- Card list interface rendering
- Role reveal dialog enhancements
- Sequential reveal order enforcement
- Progress tracking UI

**Reset & State Management:**
- Application-level state management (App.jsx changes minimal)
- Reset button functionality (handled by ResetButtonSystem)
- State persistence or local storage
- Undo/redo configuration changes

**Advanced UI Features:**
- Role configuration presets or templates
- Save/load configuration profiles
- Role recommendation engine
- Configuration history or analytics

**Role Registry:**
- Role definitions or metadata (handled by Role Registry System feature)
- Registry API functions
- Role constraints or color palettes

**Validation Framework:**
- Validation rule definitions (handled by Multi-Role Validation Framework feature)
- Cross-role constraint logic
- Edge case detection algorithms

**Visual Enhancements (Beyond Requirements):**
- Dark mode or theme customization
- Advanced animations or micro-interactions
- Role-specific icons/badges (optional, nice-to-have)
- Tooltips or contextual help

**Internationalization:**
- Multi-language support
- Localized role names or descriptions
- Locale-specific number formatting

This feature focuses on **user-facing multi-role configuration UI** consuming the role registry and validation framework. It provides the interface layer enabling users to configure Police and Doctor roles with clear visual feedback and accessibility compliance.
