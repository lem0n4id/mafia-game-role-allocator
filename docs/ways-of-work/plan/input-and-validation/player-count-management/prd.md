# Feature PRD: Player Count Management

## 1. Feature Name

Player Count Management

## 2. Epic

- **Parent Epic:** [Input & Validation](../epic.md)
- **Architecture:** [Input & Validation Architecture](../arch.md)

## 3. Goal

### Problem
Hosts need to specify the total number of players and have the interface dynamically adapt to show the correct number of name input fields. Without dynamic field management, hosts either face too many unused fields (clutter) or too few fields (missing players). Manual field management is error-prone and slow, disrupting the game setup flow.

### Solution
Implement a responsive player count input that automatically generates the exact number of name input fields needed. When the count increases, new empty fields appear. When decreased, surplus fields are removed along with their values, while preserving existing valid entries. This creates a streamlined, intuitive interface that adapts to group size.

### Impact
- Reduces interface clutter by showing only necessary fields
- Eliminates manual field management errors
- Speeds up setup for groups of different sizes
- Provides clear visual feedback of group size changes
- Ensures input interface matches actual game requirements

## 4. User Personas

### Primary: Game Host
- **Role:** Person setting up the Mafia game on the mobile device
- **Context:** Needs to quickly configure the game for their specific group size
- **Requirements:** Fast, error-free way to set player count and see corresponding name fields

### Secondary: Indirect Players
- **Role:** Game participants who benefit from efficient setup
- **Context:** Waiting for host to complete setup and start the game
- **Requirements:** Quick setup process without delays or configuration errors

## 5. User Stories

### Core Player Count Stories
- **US-1:** As a host, I can enter the total number of players in an input field so that the app knows how many people are playing
- **US-3:** As a host, when I change the number of players, the app dynamically adds new empty input fields for player names so that I have the right number of fields
- **US-4:** As a host, when I decrease the number of players, the extra input fields are removed and their values deleted so that the interface stays clean and accurate

### Field Management Stories
- **US-1.1:** As a host, I want the player count input to accept valid numbers so that I can specify any reasonable group size
- **US-1.2:** As a host, I want immediate visual feedback when changing player count so that I can see the interface adapt in real-time
- **US-1.3:** As a host, I want preserved values in remaining fields when decreasing count so that I don't lose names I've already entered

## 6. Requirements

### Functional Requirements
- Player count input field accepts positive integers (practical range: 1-30)
- Dynamic generation of player name input fields based on count value
- Immediate addition of empty name fields when count increases
- Immediate removal of surplus name fields when count decreases
- Preservation of existing name values in remaining fields during count changes
- Visual feedback showing field addition/removal in real-time
- Input validation to prevent invalid count values (negative numbers, decimals, non-numbers)
- Clear labeling of the player count input field
- Responsive layout that accommodates field changes on mobile screens
- Controlled input behavior with proper state management

### Non-Functional Requirements
- Field addition/removal must complete within 100ms for responsive feel
- Interface must remain usable on mobile screens (320px-768px width)
- Player count changes must not cause layout shift or visual glitches
- Input field must be accessible with proper labels and ARIA attributes
- Component must be lightweight and not impact bundle size significantly
- State changes must be predictable and testable
- Touch targets must meet 44px minimum size requirement
- Visual feedback must be clear and immediate

## 7. Acceptance Criteria

### AC-1: Player Count Input
- [ ] Player count input field is clearly labeled and visible
- [ ] Input accepts positive integers from 1 to 30
- [ ] Input rejects negative numbers, decimals, and non-numeric values
- [ ] Input shows validation errors for invalid values
- [ ] Input has proper touch target size (44px minimum)

### AC-2: Dynamic Field Generation
- [ ] When player count is set to N, exactly N name input fields appear
- [ ] Increasing count from N to N+X adds X new empty fields at the end
- [ ] Fields appear immediately without delay or animation interruption
- [ ] New fields are properly labeled (Player 1, Player 2, etc.)
- [ ] Field generation works correctly for count changes from 1 to 30

### AC-3: Field Removal and Cleanup
- [ ] Decreasing count from N to N-X removes the last X fields
- [ ] Removed fields' values are permanently deleted
- [ ] Remaining fields preserve their existing values
- [ ] Field removal happens immediately without visual glitches
- [ ] Interface layout adjusts smoothly to fewer fields

### AC-4: State Management
- [ ] Player count value is controlled and persists across renders
- [ ] Name field values are controlled and managed in state
- [ ] State updates are atomic (count and fields change together)
- [ ] Component re-renders efficiently without unnecessary updates
- [ ] State can be reset or initialized with default values

### AC-5: Mobile Responsiveness
- [ ] Interface works correctly on screens 320px-768px width
- [ ] Field addition doesn't cause horizontal scrolling
- [ ] Touch interactions work reliably on mobile devices
- [ ] Visual feedback is clear on small screens
- [ ] Layout remains usable with 20+ fields visible

### AC-6: Integration Readiness
- [ ] Component exposes player count value to parent components
- [ ] Component exposes array of name values to parent components
- [ ] Component accepts initial values for count and names
- [ ] Component can be controlled from parent for reset functionality
- [ ] Component integrates cleanly with form validation

## 8. Out of Scope

### Explicitly Not Included
- Mafia count validation (handled by separate Mafia Count Validation feature)
- Name field validation logic (handled by Player Name Input System feature)
- Form submission or allocation logic (handled by Role Allocation epic)
- Advanced input types (dropdowns, sliders, steppers)
- Animations or transitions for field changes
- Persistence or storage of player count values
- Import/export of player lists
- Advanced accessibility features beyond basic ARIA labels
- Custom validation rules or business logic constraints

### Future Considerations
- Could add smooth animations for field addition/removal
- Could implement preset group sizes (quick buttons for 5, 8, 10, etc.)
- Could add drag-and-drop reordering of name fields
- Could integrate with device contacts for name auto-completion
- Could add validation for reasonable group size limits
- Could implement field templates or naming patterns

### Integration Boundaries
- **Receives:** Initial player count, initial name values (for reset scenarios)
- **Provides:** Current player count, array of current name values
- **Dependencies:** None (standalone input management)
- **Dependents:** Mafia Count Validation (needs player count), Player Name Input System (manages the fields this creates)

## Context Template

- **Epic:** Input & Validation - establishing robust input foundation for game setup
- **Feature Idea:** Dynamic player count input that automatically manages the correct number of name input fields
- **Target Users:** Game hosts needing to quickly configure interface for their group size