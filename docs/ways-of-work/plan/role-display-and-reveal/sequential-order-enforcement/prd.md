# Feature PRD: Sequential Order Enforcement

## 1. Feature Name

Sequential Order Enforcement

## 2. Epic

- **Parent Epic:** [Role Display & Reveal](../epic.md)
- **Architecture:** [Role Display & Reveal Architecture](../arch.md)

## 3. Goal

### Problem
Without order control, players might reveal roles out of sequence, leading to confusion about whose turn it is next. The reveal process needs structure to ensure smooth device passing and prevent chaos during role revelation.

### Solution
Implement strict sequential order enforcement with a prominent current player cue that guides the reveal process and prevents out-of-order reveals while maintaining clear visual indication of progression.

### Impact
- Eliminates confusion about reveal order
- Provides clear guidance for device passing
- Maintains structured, organized reveal process
- Reduces setup errors and restart attempts

## 4. User Personas

### Primary: Game Host
- **Role:** Person managing device passing and reveal order
- **Context:** Needs clear indication of whose turn it is
- **Requirements:** Obvious current player indication, order control

### Secondary: All Players  
- **Role:** Participants following reveal sequence
- **Context:** Need to know when it's their turn
- **Requirements:** Clear turn indication, prevented out-of-order access

## 5. User Stories

- **US-15:** Cards must be revealed in strict order; the current player's name is visible at the top of the screen
- **US-24:** The current player cue is visible at the top at all times during the reveal phase

## 6. Requirements

### Functional Requirements
- Current player cue always visible at top of screen during reveal phase
- Only current player's card allows reveal interaction
- Other players' cards disabled until their turn
- Automatic progression to next player after reveal completion
- Order follows player list sequence from allocation
- Visual differentiation between current, completed, and pending players
- Order enforcement persists through re-allocation

### Non-Functional Requirements
- Current player cue updates within 100ms of reveal completion
- Order enforcement works reliably on all mobile browsers
- Visual cues are clear and accessible
- Performance remains smooth with order tracking

## 7. Acceptance Criteria

### AC-1: Current Player Cue Display
- [ ] Current player name prominently displayed at top of screen
- [ ] Cue remains visible during scrolling and interactions
- [ ] Cue updates immediately when player completes reveal
- [ ] Cue styling is clear and attention-grabbing

### AC-2: Order Enforcement Logic
- [ ] Only current player can access reveal functionality
- [ ] Other players' cards are disabled/non-interactive
- [ ] Order follows sequence from player input phase
- [ ] Progression is automatic after reveal completion

### AC-3: Visual State Management
- [ ] Completed reveals show persistent visual state
- [ ] Pending reveals are visually distinct from current
- [ ] Current player card is highlighted or emphasized
- [ ] Order progression is visually clear to all users

## 8. Out of Scope

- Role reveal dialog implementation (handled by Role Reveal Dialog)
- Card list layout and styling (handled by Card List Interface)
- Reset functionality (handled by Reset epic)
- Advanced order customization or reordering
- Skip or jump functionality for reveal order

## Context Template

- **Epic:** Role Display & Reveal - ensuring organized, sequential reveal process
- **Feature Idea:** Order enforcement system with clear current player indication  
- **Target Users:** Host and players who need structured, guided reveal process