# Feature PRD: Reset Button System

## 1. Feature Name

Reset Button System

## 2. Epic

- **Parent Epic:** [Reset & Re-Allocate](../epic.md)
- **Architecture:** [Reset & Re-Allocate Architecture](../arch.md)

## 3. Goal

### Problem
Hosts need ability to restart game setup without losing entered player names. Without reset functionality, hosts must manually clear data or refresh browser, losing all setup progress and requiring complete re-entry of information.

### Solution
Implement reset button that clears role allocations and returns to input screen while preserving all entered player names, enabling quick restart of allocation process without data loss.

### Impact
- Enables quick game restart without losing setup progress
- Preserves valuable player name data across resets
- Reduces setup frustration and time waste
- Supports iterative game configuration

## 4. User Personas

### Primary: Game Host
- **Role:** Person managing game setup who may want to restart
- **Context:** Needs to clear allocations while keeping names
- **Requirements:** Quick reset that preserves entered data

## 5. User Stories

- **US-19:** After allocation, a Reset button appears at the bottom of the card list screen
- **US-20:** Pressing Reset returns to the input screen with all previously entered names prefilled
- **US-21:** Previous role allocations are cleared after Reset, ready for a new allocation

## 6. Requirements

### Functional Requirements
- Reset button visible at bottom of card screen after allocation
- Button clears all role assignments and allocation state
- Returns user to input screen with names prefilled
- Preserves player count and Mafia count settings
- Clears reveal progress and dialog states
- Button accessible during reveal process
- Integration with form validation state

### Non-Functional Requirements
- Reset completes within 200ms
- Button meets 44px touch target minimum
- Works reliably across mobile browsers
- Accessible with proper labeling

## 7. Acceptance Criteria

### AC-1: Reset Button Availability
- [ ] Reset button appears after successful role allocation
- [ ] Button visible at bottom of card list screen
- [ ] Button remains available during reveal process
- [ ] Button styling is clear and recognizable

### AC-2: State Cleanup and Navigation
- [ ] Reset clears all role assignments completely
- [ ] Reset clears reveal progress and dialog states
- [ ] Reset returns to input screen immediately
- [ ] Navigation transition is smooth and reliable

### AC-3: Data Preservation
- [ ] All player names remain prefilled after reset
- [ ] Player count setting is preserved
- [ ] Mafia count setting is preserved
- [ ] Form validation state is properly restored

## 8. Out of Scope

- Input validation logic (handled by Input & Validation epic)
- Role allocation logic (handled by Role Allocation epic)
- Advanced reset options or partial resets
- Confirmation prompts for reset action
- Reset history or undo functionality

## Context Template

- **Epic:** Reset & Re-Allocate - enabling quick restart while preserving setup progress
- **Feature Idea:** Reset system that clears allocations while preserving valuable input data
- **Target Users:** Hosts who need flexibility to restart allocation without losing names