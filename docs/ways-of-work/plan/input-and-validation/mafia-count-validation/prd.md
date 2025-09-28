# Feature PRD: Mafia Count Validation

## 1. Feature Name

Mafia Count Validation

## 2. Epic

- **Parent Epic:** [Input & Validation](../epic.md)
- **Architecture:** [Input & Validation Architecture](../arch.md)

## 3. Goal

### Problem
Hosts must specify a valid number of Mafia players that creates a balanced, playable game. Without proper validation, hosts can enter invalid configurations like having more Mafia than total players, or negative values, which would break the game logic. Invalid Mafia counts lead to allocation failures, confused players, and disrupted game flow.

### Solution
Implement robust Mafia count validation that prevents impossible game configurations while allowing edge cases with proper warnings. The system validates that Mafia count is non-negative and less than total players, provides clear error messages for invalid inputs, and integrates seamlessly with the allocation flow to block progression until valid.

### Impact
- Prevents game-breaking configurations before they reach allocation
- Provides clear feedback about valid vs invalid Mafia counts
- Reduces setup errors and frustrated restart attempts
- Ensures only balanced, playable games proceed to role assignment
- Maintains game flow by catching errors early in the process

## 4. User Personas

### Primary: Game Host
- **Role:** Person configuring the Mafia game setup
- **Context:** Needs to specify a valid Mafia count that creates balanced gameplay
- **Requirements:** Clear validation feedback and prevention of invalid configurations

### Secondary: All Players
- **Role:** Game participants who depend on balanced role allocation
- **Context:** Expect fair game setup with appropriate Mafia-to-Villager ratio
- **Requirements:** Balanced game configuration that supports engaging gameplay

## 5. User Stories

### Core Validation Stories
- **US-2:** As a host, I can enter the number of Mafia in an input field so that I can specify how many Mafia players there should be
- **US-8:** As a host, the app prevents invalid Mafia counts (≥ number of players) and shows a confirmation/error message so that I can't create impossible game configurations

### Enhanced Validation Stories
- **US-2.1:** As a host, I want immediate feedback when entering Mafia count so that I know if my input is valid
- **US-2.2:** As a host, I want clear error messages for invalid Mafia counts so that I understand what needs to be corrected
- **US-2.3:** As a host, I want the system to prevent progression with invalid counts so that I can't accidentally start a broken game
- **US-8.1:** As a host, I want to understand why certain Mafia counts are invalid so that I can make informed adjustments
- **US-8.2:** As a host, I want validation that updates as I change the player count so that my Mafia count remains valid

## 6. Requirements

### Functional Requirements
- Mafia count input field accepts non-negative integers
- Real-time validation that Mafia count is less than total player count
- Clear error messages for invalid Mafia count values
- Prevention of form submission when Mafia count is invalid
- Dynamic revalidation when player count changes affects Mafia count validity
- Visual indicators for valid vs invalid Mafia count states
- Integration with allocation flow to block progression on invalid counts
- Proper handling of edge cases (0 Mafia, all players as Mafia handled at allocation level)
- Clear labeling and instructions for the Mafia count input
- Responsive validation feedback on mobile devices

### Non-Functional Requirements
- Validation feedback must appear within 100ms of input change
- Error messages must be clear and actionable for non-technical users
- Validation must work reliably across mobile browsers
- Input field must meet 44px minimum touch target size
- Component must integrate cleanly with form state management
- Validation logic must be testable and maintainable
- Error states must be visually distinct and accessible
- Performance impact must be minimal (no expensive validation operations)

## 7. Acceptance Criteria

### AC-1: Input Field and Basic Validation
- [ ] Mafia count input field is clearly labeled and visible
- [ ] Input accepts non-negative integers (0, 1, 2, etc.)
- [ ] Input rejects negative numbers with immediate error feedback
- [ ] Input rejects non-numeric values with clear error message
- [ ] Input has proper touch target size (44px minimum)
- [ ] Input integrates with form state management

### AC-2: Mafia-to-Player Ratio Validation
- [ ] When Mafia count equals total players, validation shows error
- [ ] When Mafia count exceeds total players, validation shows error
- [ ] When Mafia count is valid (< total players), no error is shown
- [ ] Error message clearly explains the invalid relationship
- [ ] Validation updates immediately when either count changes

### AC-3: Dynamic Revalidation
- [ ] When player count decreases below current Mafia count, error appears
- [ ] When player count increases above current Mafia count, error clears
- [ ] Validation state updates without requiring re-focus of Mafia input
- [ ] Multiple rapid changes to player count don't cause validation lag
- [ ] Validation remains accurate across all count change scenarios

### AC-4: Error Messaging and Feedback
- [ ] Error messages are specific and actionable (not generic)
- [ ] Error text explains what the valid range should be
- [ ] Error styling is visually distinct and consistent
- [ ] Error messages are accessible to screen readers
- [ ] Error state clears immediately when input becomes valid

### AC-5: Form Integration and Flow Control
- [ ] Invalid Mafia count prevents form submission to allocation
- [ ] Valid Mafia count allows progression to allocation flow
- [ ] Validation state is available to parent form components
- [ ] Component can be reset with new valid default values
- [ ] Integration works with controlled form patterns

### AC-6: Edge Case Handling
- [ ] Mafia count of 0 is accepted (validation passes, but allocation epic handles the confirmation)
- [ ] Maximum valid Mafia count (total players - 1) is accepted
- [ ] Empty Mafia count input shows appropriate validation message
- [ ] Very large numbers are rejected with reasonable limits
- [ ] Decimal inputs are rejected or converted to integers appropriately

### AC-7: Mobile and Accessibility
- [ ] Touch interactions work reliably on mobile devices
- [ ] Error messages are visible and readable on small screens
- [ ] Validation feedback doesn't cause layout shifts
- [ ] Component works with device keyboards and input methods
- [ ] Focus management works correctly with validation state changes

## 8. Out of Scope

### Explicitly Not Included
- Confirmation prompts for edge cases like 0 or all-players Mafia (handled by Role Allocation epic)
- Advanced game balance recommendations or suggestions
- Player count input validation (handled by Player Count Management feature)
- Name field validation logic (handled by Player Name Input System feature)
- Role allocation logic or randomization (handled by Role Allocation epic)
- Persistence of Mafia count values across sessions
- Advanced input types (sliders, steppers, dropdown menus)
- Custom validation rules beyond basic numeric constraints
- Analytics or tracking of validation errors

### Future Considerations
- Could add suggestions for balanced Mafia ratios based on group size
- Could implement warnings for unusual but valid Mafia counts
- Could add quick preset buttons for common ratios (1/4, 1/3, etc.)
- Could integrate with game balance algorithms
- Could add explanation tooltips about optimal Mafia counts
- Could implement validation history or learning from user patterns

### Integration Boundaries
- **Receives:** Current total player count from Player Count Management
- **Provides:** Current Mafia count, validation state, error messages
- **Dependencies:** Player Count Management (for validation comparison)
- **Dependents:** Role Allocation epic (receives validated Mafia count for allocation)

### Validation Scope
- **Included:** Numeric validation, ratio validation, real-time feedback
- **Excluded:** Game balance analysis, strategic recommendations, complex business rules
- **Edge Cases:** Handled at input level (0, max valid), passed to allocation for confirmation workflow

## Context Template

- **Epic:** Input & Validation - ensuring robust input foundation prevents allocation errors
- **Feature Idea:** Validate Mafia count to prevent impossible game configurations while allowing balanced gameplay
- **Target Users:** Game hosts needing clear feedback on valid Mafia counts for their group size