# Feature PRD: Card List Interface

## 1. Feature Name

Card List Interface

## 2. Epic

- **Parent Epic:** [Role Display & Reveal](../epic.md)
- **Architecture:** [Role Display & Reveal Architecture](../arch.md)

## 3. Goal

### Problem
After role allocation, players need a clear, organized way to see all participants and access their individual role reveals. Without proper card organization, the reveal process becomes chaotic, players can't find their names, and the sequential reveal order becomes difficult to follow. A poor interface leads to confusion about whose turn it is and disrupts the game flow.

### Solution
Implement a clean, mobile-optimized card list that displays each player as an individual card in a vertical scrolling layout. Each card shows the player name clearly and provides access to role reveal functionality while maintaining visual consistency and supporting the sequential reveal process.

### Impact
- Provides clear visual organization of all players
- Enables efficient navigation during reveal process  
- Supports sequential reveal through consistent card layout
- Reduces confusion about player order and turn management
- Creates foundation for controlled role reveal mechanics

## 4. User Personas

### Primary: All Players
- **Role:** Game participants who need to find their card and reveal their role
- **Context:** Pass device sequentially, find their name, reveal role privately
- **Requirements:** Easy identification of their card, clear visual layout

### Secondary: Game Host
- **Role:** Person managing device passing and reveal order
- **Context:** Needs to guide players to correct cards and maintain order
- **Requirements:** Clear visual organization that supports orderly reveals

## 5. User Stories

### Core Card List Stories
- **US-13:** As a player, the app displays each player's role as a simple vertical scrolling list so that I can find my name and access my role
- **US-14:** As a player, only one card can be expanded at a time in a popup dialog so that role reveals remain private

### Enhanced Interface Stories  
- **US-13.1:** As a player, I want cards to be clearly labeled with names so that I can quickly find my card
- **US-13.2:** As a player, I want consistent card layout so that the interface is predictable as device passes around
- **US-13.3:** As a host, I want cards to scroll smoothly on mobile so that navigation works well for groups of any size
- **US-14.1:** As a player, I want clear indication of which card is active so that I know when someone else is revealing
- **US-14.2:** As a player, I want cards to be touch-friendly so that I can reliably interact on mobile devices

## 6. Requirements

### Functional Requirements
- Display each player as individual card in vertical list layout
- Cards show player names clearly and prominently
- Vertical scrolling works smoothly for 1-30 player cards
- Each card provides access to role reveal functionality
- Only one card can be in expanded/reveal state at any time
- Cards maintain consistent visual layout and spacing
- Card list updates dynamically when roles are re-allocated
- Cards support sequential reveal order enforcement
- Interface works reliably on mobile touch devices
- Card list integrates with reveal dialog system

### Non-Functional Requirements
- Card list must render within 200ms after role allocation
- Scrolling must be smooth on mobile devices (60fps target)
- Cards must meet 44px minimum touch target size
- List must work efficiently with up to 30 cards
- Interface must be responsive across mobile screen sizes (320px-768px)
- Cards must provide immediate visual feedback on touch
- List layout must not cause horizontal scrolling
- Memory usage must remain minimal for large player lists

## 7. Acceptance Criteria

### AC-1: Card Layout and Display
- [ ] Each player appears as individual card in vertical list
- [ ] Player names are clearly visible and prominently displayed
- [ ] Cards maintain consistent visual styling and spacing
- [ ] List layout works correctly for 1-30 players
- [ ] Cards are properly sized for mobile touch interaction (44px+)

### AC-2: Scrolling and Navigation
- [ ] Vertical scrolling works smoothly on mobile devices
- [ ] List scrolls without lag or jank during navigation
- [ ] Scrolling doesn't interfere with card touch interactions
- [ ] List maintains scroll position during reveal interactions
- [ ] Navigation works across all supported mobile browsers

### AC-3: Single Card Expansion Control
- [ ] Only one card can be in expanded/active state at any time
- [ ] Expanding one card automatically closes any other expanded card
- [ ] Card expansion state is visually distinct and clear
- [ ] Expansion control integrates cleanly with reveal dialog system
- [ ] State management prevents multiple simultaneous expansions

### AC-4: Touch Interaction and Responsiveness
- [ ] Cards respond immediately to touch with visual feedback (<100ms)
- [ ] Touch targets work reliably across mobile devices
- [ ] Card interactions don't interfere with scrolling
- [ ] Interface remains usable across mobile screen sizes
- [ ] Double-tap and accidental touches are handled gracefully

### AC-5: Integration with Role System
- [ ] Card list updates immediately when roles are re-allocated
- [ ] Each card integrates correctly with role reveal functionality
- [ ] Card list maintains player order from allocation phase
- [ ] Cards display appropriate state based on reveal progress
- [ ] Integration with sequential order enforcement works correctly

### AC-6: Performance and Reliability
- [ ] Card list renders within 200ms after allocation
- [ ] Performance remains smooth with maximum player count (30)
- [ ] Memory usage is efficient for large lists
- [ ] Interface works reliably across mobile browsers
- [ ] Card list handles state changes without visual glitches

## 8. Out of Scope

### Explicitly Not Included
- Role reveal dialog implementation (handled by Role Reveal Dialog feature)
- Sequential order enforcement logic (handled by Sequential Order Enforcement)
- Reset functionality (handled by Reset / Re-Allocate epic)
- Advanced card animations or transitions
- Card customization or theming options
- Drag-and-drop reordering of cards
- Card filtering or search functionality
- Advanced list virtualization for performance

### Future Considerations
- Could add smooth card animations for state transitions
- Could implement card grouping or categorization
- Could add quick navigation tools for large lists
- Could integrate with advanced accessibility features
- Could add card preview or summary information
- Could implement custom card layouts or themes

### Integration Boundaries
- **Receives:** Player list and role assignments from Role Allocation epic
- **Provides:** Card selection events to Role Reveal Dialog, card state to Sequential Order Enforcement
- **Dependencies:** Role Allocation epic (for player and role data)
- **Dependents:** Role Reveal Dialog (handles card expansion), Sequential Order Enforcement (manages card access)

## Context Template

- **Epic:** Role Display & Reveal - establishing organized foundation for private role revelation process
- **Feature Idea:** Clean, mobile-optimized card list that organizes players and supports sequential role reveals
- **Target Users:** All players who need to efficiently find and access their role cards during reveal process