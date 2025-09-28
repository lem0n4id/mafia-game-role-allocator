# Product Requirements Document

> prd_instructions: The focus for this product is mobile only web app, as lightweight as possible and as minimal barebones as possible. It will be a frontend app with no backend as such.

## Product Overview

### Project Title
mafia game role allocator

### Version Number
0.0.1

### Project Summary
The Mafia Game Role Allocator is a lightweight, mobile-only web app designed to simplify role distribution for the classic party game Mafia. The host enters all player names, and the app randomly assigns each player as either a Villager or Mafia, displaying roles as individual cards that can be revealed one at a time as the phone is passed around.

## Vision

The app provides a fast, error-free way for hosts to allocate Mafia roles, minimizing setup time and confusion. It ensures a smooth, intuitive experience for both hosts and players on mobile devices.

## Tech Stack

### Frontend
React 18 using functional components and Hooks only.

### Build Tool
Vite with Node.js 20 and npm.

### UI Components
Purely custom React components styled with Tailwind CSS v3.4.17. No third-party UI libraries.

### State Management
React `useState` and `useReducer` for local in-memory state.

### Styling
Tailwind CSS v3.4.17; minimal and mobile-optimized. Portrait-only layout.

### Testing
Manual testing on mobile devices, plus basic unit tests for input validation and role allocation logic.

### Other Tooling
Standard npm scripts for build, dev, and testing.

## Goals

### Business Goals
- Provide a lightweight, mobile-only web app that makes Mafia game setup fast and frictionless.
- Ensure simplicity and reliability by focusing only on the role allocation process.
- Make the tool accessible for casual friend groups and meetup strangers, with a clean and straightforward interface.

### User Goals
- Hosts can enter player names quickly and let the app assign roles randomly.
- Each player can privately reveal their role by opening their designated card when the phone is passed around.
- Minimize confusion or manual errors in assigning roles, ensuring a smooth game start.

### Non-Goals
- No support for advanced roles (e.g., Doctor, Detective).
- No chat, timers, voting, or scoring mechanics.
- No persistent data (e.g., saving player lists or game history).
- No emphasis on complex styling/design in v0.0.1 (only minimal CSS for clarity).

## User Personas

### Key User Types
- Host – The person managing the game, entering names, and facilitating role allocation.
- Players – Participants who will reveal their roles one at a time as the phone is passed around.

### Basic Persona Details
- Host Persona:
  - Who they are: Any individual facilitating a Mafia game, could be a friend in a casual group or a meetup organizer.
  - Context: Uses a single mobile device to enter player names, verify entries, and allocate roles.
  - Experience Level: Irrelevant; app provides simple guidance and requires no prior Mafia experience.

- Player Persona:
  - Who they are: Game participants (5–20 people per group).
  - Context: Each player receives the phone when prompted to reveal their assigned role.
  - Experience Level: Irrelevant; roles are self-explanatory and explained by the host.

### Role-Based Access
- Host: Enter player names, verify name inputs, click “Allocate Roles”, pass device to players.
- Player: Reveal assigned role when prompted, then pass device to the next player.

## Functional Requirements

## Core Features

### 1. Player Setup

#### Number of Players
Host enters total number of players; dynamic player name input fields generated or removed accordingly.

#### Number of Mafia
Host manually specifies Mafia count; prevents invalid entries (≥ total players).

#### Player Name Inputs
Sequential input fields; blank names blocked; duplicates allowed; prefilled if returning from allocation or reset.

### 2. Role Allocation

#### Confirmation Prompt
Before assigning roles, the host confirms allocation via prompt.

#### Randomization Logic
Randomly assigns roles based on Mafia count; remaining players are Villagers.

#### Re-allocation
Clicking ‘Allocate Roles’ again reshuffles all roles; previous allocation discarded.

### 3. Role Display & Reveal

#### Card List Layout
Vertical scrolling card list; each player has one card; only one card expanded at a time.

#### Reveal Dialog Behavior
‘Reveal Role’ button shows role; changes to ‘Close’ once revealed; player taps Close before passing device.

#### Strict Order & Current Player Cue
Players reveal in strict order; current player cue visible at top of screen.

### 4. Reset / Re-Allocate

#### Reset Behavior
Reset button clears allocations, returns to input screen.

#### Prefilled Names
Previously entered names remain in input fields after reset.

### 5. Minimal Styling & UI Clarity

#### Mobile-optimized Layout
Portrait-only, mobile-friendly layout with clear functional cues.

#### Visual Differentiation
Basic styling for cards and buttons; current player cue prominent; functional clarity prioritized over aesthetics.

- Feature: Number of Players Input (Priority: High)
  - Description: Host can enter the total number of players. The app dynamically generates that many input fields for player names. If the number is increased, new empty fields are added; if decreased, removed fields’ values are deleted. Existing fields remain prefilled. No minimum or maximum enforced (practically 5–20 expected).

- Feature: Number of Mafia Input (Priority: High)
  - Description: Host manually specifies the number of Mafia. Input prevents invalid entries: number of Mafia must be less than total players. No default suggestions; fully manual. Changing the number allows re-allocation of roles.

- Feature: Player Name Input (Priority: High)
  - Description: Enter player names in sequential input boxes. Blank names not allowed; form cannot be submitted if any field is empty. Duplicate names allowed. Input fields remain prefilled if returning from allocation or reset.

- Feature: Role Allocation (Priority: High)
  - Description: Randomly assign roles according to the specified number of Mafia; remaining players are Villagers. Clicking “Allocate Roles” opens a confirmation prompt before shuffling. Re-allocation reshuffles all roles; no previous allocation is preserved. Allocation cannot proceed if any names are blank or number of Mafia exceeds total players.

- Feature: Role Display as Cards (Priority: High)
  - Description: Each player’s role displayed as a simple vertical scrolling list. Only one card can be expanded at a time in a popup dialog. Cards must be revealed in strict order. Current player cue visible at top of screen at all times. Roles remain visible after reveal; no “hide role” option.

- Feature: Card Reveal / Device Pass Flow (Priority: High)
  - Description: Popup contains 'Reveal Role' button. After revealing, button changes to 'Close', which player taps before passing device. Ensures only one player views their role at a time. Current player cue remains visible during process.

- Feature: Reset / Re-Allocate (Priority: Medium)
  - Description: After allocation, Reset button available at bottom of cards screen. Pressing Reset returns to input screen with names prefilled. Allocated roles are cleared; allocation process can restart.

- Feature: Minimal Styling / Visual Clarity (Priority: Medium)
  - Description: Basic visual differentiation for cards and buttons. Functional clarity prioritized over aesthetics. Current player cue visible at top with minimal styling. Lightweight styling for fast, mobile-friendly performance.

## User Experience

### Entry Points & First-time User Flow
- Users access the app via a shared link (e.g., sent by a friend or meetup organizer).
- No separate signup, onboarding, or instructions screens — the app is self-explanatory.
- The first screen displayed is the Number of Players & Mafia input with dynamic player name fields.

### Core Experience
- Host enters total number of players and number of Mafia. Invalid entries blocked with confirmation/error messages. Dynamic input fields appear for player names.
- Names are entered sequentially; blank names not allowed. Duplicate names allowed. Host can adjust number of players which adds/removes fields and deletes removed values.
- Host clicks 'Allocate Roles' triggering confirmation prompt before shuffling. Roles randomly assigned according to number of Mafia; remaining players Villagers.
- Cards displayed as simple vertical scrolling list. Strict order enforced; current player cue visible. Player taps 'Reveal Role', role shown, button changes to 'Close', player taps Close before passing device. Roles remain visible once revealed.
- Reset button available at bottom; pressing Reset returns to input screen with names prefilled and clears previous allocations.

### Advanced Features & Edge Cases
- Number of Mafia = 0 or = total players allowed but warned via confirmation.
- Reset during card reveal permitted; returns to input screen with allocations cleared, names prefilled.
- Accidental double-tap on Reveal/Close handled gracefully; duplicate taps do not break flow.
- Invalid entries blocked with error messages for blank names or Mafia ≥ players.

### UI/UX Highlights
- Functional clarity prioritized over aesthetics.
- Minimal styling for cards and buttons; current player cue always visible at top.
- Layout is portrait-only, mobile-optimized.
- Fully self-explanatory; no onboarding or tooltips required.

## User Interface Layout

* Input Screen: Number of players and Mafia fields at top; dynamic player name inputs below; ‘Allocate Roles’ button at bottom.
* Role Reveal Screen: Vertical scrolling list of cards; current player cue at top; each card has ‘Reveal Role’ / ‘Close’ button.
* Reset Button: Fixed at bottom of card list screen.

## Performance Requirements

### Load Time Budget
Target mobile load time <2 seconds.

### Interaction Latency Budget
Button interactions and card reveal <200ms.

### Memory/Bundle Budget
Target JS bundle size <500KB to ensure fast mobile performance.

## Narrative

The host opens the app on a mobile phone, enters the number of players and Mafia, and fills in each player’s name in the dynamic input fields. Once confirmed, they tap “Allocate Roles,” and the app randomly assigns Villager or Mafia roles to each player. The players then take turns revealing their roles by tapping the “Reveal Role” button on their card, following the strict sequence enforced by the app, while the current player’s name remains visible at the top as a cue. After viewing their role, each player taps “Close” before passing the device to the next person. The host and players benefit from a fast, error-free setup, with roles clearly distributed and revealed without confusion, making the game ready to start within minutes.

## Success Metrics

### User-Centric Metrics
- Time to Allocate Roles: Average time from opening the app to completed role allocation.
- Error Prevention: Number of invalid submissions prevented (e.g., blank names, Mafia ≥ players).
- Smooth Flow: All players able to reveal roles in the correct order without confusion or misclicks.

### Business Metrics
- Reliability & Adoption: Number of groups successfully using the app without crashes or major errors.
- Allocation Completion Rate: Percentage of sessions where role allocation completes successfully.

### Technical Metrics
- Page Load Speed: Time taken for the app to load on mobile devices.
- Responsiveness: Input fields and buttons respond immediately without lag.
- Successful Role Allocation: Roles are assigned correctly according to user input every time.
- Lightweight Bundle Size: Minimal file size to ensure fast mobile performance.
- Ease of Development: Developers can implement, debug, and extend the app quickly, with minimal complexity.

## Technical Considerations

### Integration Points
- Frontend Framework: React 18.
- Styling: Tailwind CSS v3.4.17 (strictly no v4).
- Build Tools: Node.js 20, npm, Vite.
- Language: JavaScript (no TypeScript).
- No external analytics or tracking libraries.
- No backend integrations; the app is purely frontend.

### Data Storage & Privacy
- All player data remains in-memory; no persistent storage is used.
- No data is shared externally; names and allocations exist only during the session.
- Player data is cleared when the browser tab is closed or the page is refreshed.

### Scalability & Performance
- MVP targets 5–20 players per session; no current plans to support larger groups.
- Performance should remain fast on mobile devices due to lightweight bundle and minimal styling.
- Multiple simultaneous groups on separate devices are independent, as there is no shared backend.

### Potential Challenges
- Ensuring random role allocation is fair and behaves correctly on every allocation.
- Handling accidental double-clicks on buttons (Reveal/Close, Allocate, Reset) without breaking the flow.
- Ensuring the app remains responsive and usable on different mobile browsers.
- Keeping the app lightweight and fast, despite using React and Tailwind.

## Project Management

### Local Storage
All state in-memory; no local storage used.

### Import/Export
Not implemented for MVP.

### Project Metadata
* Version: 0.0.1
* Author: Lenin Edward Kennedy
* Last Updated: 28 September 2025

## Milestones & Sequencing

### Project Estimate
- Size: Small
- Timeline: 1 week
- Development Approach: Agentic AI-assisted coding to automate as much of the implementation as possible

### Team Size & Composition
- Team Size: 1
- Role: Core developer (responsible for coding, basic styling, testing, and QA)

### Suggested Phases
- Phase 1: Setup & Project Scaffolding
  - Description: Initialize project with React 18, Vite, Tailwind v3.4.17; configure Node.js/npm environment; prepare basic file structure
  - Duration: 0.5 day
  - Key Deliverables: Working React project with Tailwind integrated, ready for feature development

- Phase 2: Input & Validation
  - Description: Implement Number of Players, Number of Mafia, and dynamic player name inputs; validation for blank names and invalid Mafia counts
  - Duration: 1 day
  - Key Deliverables: Functional input screen with dynamic fields and error handling

- Phase 3: Role Allocation
  - Description: Implement random role assignment, confirmation prompt, and reshuffling logic
  - Duration: 1 day
  - Key Deliverables: Allocate Roles button functional with proper randomization and confirmation workflow

- Phase 4: Role Reveal & Card Flow
  - Description: Implement vertical scrolling card list, strict reveal order, Reveal/Close button behavior, and current player cue
  - Duration: 2 days
  - Key Deliverables: Functional card reveal flow for all players, sequential order enforced, current player cue visible

- Phase 5: Reset / Re-Allocate
  - Description: Implement Reset button at bottom of cards screen to return to input screen with names prefilled and allocations cleared
  - Duration: 0.5 day
  - Key Deliverables: Reset workflow functional, prefilled names retained, previous allocations cleared

- Phase 6: Minimal Styling & UI Clarity
  - Description: Add basic visual differentiation for cards and buttons; ensure mobile-friendly, portrait-only layout
  - Duration: 1 day
  - Key Deliverables: Lightweight styling applied; functional clarity maintained; responsive mobile layout

- Phase 7: Testing & QA
  - Description: Manual testing of full workflow on mobile devices; verify validation, allocation, card reveal order, and Reset flow; address any bugs
  - Duration: 1 day
  - Key Deliverables: Tested MVP with verified functional flow, edge cases handled, ready for internal use

  ## Development Phases & Status

  ### Phase 1: Setup & Project Scaffolding
  #### Status
  Completed
  #### Checklist
  * Initialize Vite + React 18 project
  * Integrate Tailwind CSS v3.4.17
  * Configure Node.js/npm

  ### Phase 2: Input & Validation
  #### Status
  Not Started
  #### Checklist
  * Number of Players input field
  * Number of Mafia input field
  * Dynamic player name fields
  * Blank name validation
  * Invalid Mafia count validation

  ### Phase 3: Role Allocation
  #### Status
  Not Started
  #### Checklist
  * Allocate Roles button
  * Confirmation prompt
  * Random role assignment
  * Re-allocation logic

  ### Phase 4: Role Reveal & Card Flow
  #### Status
  Not Started
  #### Checklist
  * Vertical card list layout
  * Reveal/Close button logic
  * Strict reveal order enforcement
  * Current player cue

  ### Phase 5: Reset / Re-Allocate
  #### Status
  Not Started
  #### Checklist
  * Reset button at bottom
  * Clear previous allocations
  * Prefill names after reset

  ### Phase 6: Minimal Styling & UI Clarity
  #### Status
  Not Started
  #### Checklist
  * Mobile-optimized portrait layout
  * Basic card/button styling
  * Functional clarity check

  ### Phase 7: Testing & QA
  #### Status
  Not Started
  #### Checklist
  * Manual testing of full workflow on mobile
  * Unit tests for input validation
  * Verify edge cases (0/all Mafia, double-tap, blank names)

## User Stories

- As a host, I can enter the total number of players in an input field.
- As a host, I can enter the number of Mafia in an input field.
- As a host, when I change the number of players, the app dynamically adds new empty input fields for player names.
- As a host, when I decrease the number of players, the extra input fields are removed and their values deleted.
- As a host, I can enter player names in each input field sequentially.
- The app prevents submission if any player name field is blank.
- The app allows duplicate names without errors.
- The app prevents invalid Mafia counts (≥ number of players) and shows a confirmation/error message.
- As a host, I can click ‘Allocate Roles’ to start the random assignment.
- Before shuffling roles, the app shows a confirmation prompt.
- The app randomly assigns roles based on the number of Mafia; remaining players are Villagers.
- If ‘Allocate Roles’ is clicked again, the app reshuffles all roles randomly.
- The app displays each player’s role as a vertical scrolling card list.
- Only one card can be expanded at a time in a popup dialog.
- Cards must be revealed in strict order; the current player’s name is visible at the top of the screen.
- A player taps ‘Reveal Role’ to view their role.
- After viewing, the ‘Reveal Role’ button changes to ‘Close,’ which the player taps before passing the device.
- Roles remain visible after reveal; there is no hide-after-view option.
- After allocation, a Reset button appears at the bottom of the card list screen.
- Pressing Reset returns to the input screen with all previously entered names prefilled.
- Previous role allocations are cleared after Reset, ready for a new allocation.
- All cards and buttons have basic visual differentiation.
- The layout is mobile-optimized and portrait-only.
- The current player cue is visible at the top at all times during the reveal phase.
- The app allows Number of Mafia = 0 or equal to total players, but warns the host via confirmation.
- Reset during card reveal works and returns to the input screen with names prefilled.
- Accidental double-tap on buttons (Reveal/Close, Allocate, Reset) does not break the workflow.
- Invalid inputs (blank names, Mafia ≥ players) block allocation until corrected.
- No authentication or login is required; all users use the app from a shared device.
- The host and players share one device sequentially; all interactions follow the same workflow.
