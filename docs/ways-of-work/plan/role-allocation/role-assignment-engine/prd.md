# Feature PRD: Role Assignment Engine

## 1. Feature Name

Role Assignment Engine

## 2. Epic

- **Parent Epic:** [Role Allocation](../epic.md)
- **Architecture:** [Role Allocation Architecture](../arch.md)

## 3. Goal

### Problem
The game requires fair, unbiased role distribution that players can trust. Without proper randomization, role assignment could be predictable or biased, undermining game integrity. Manual assignment is error-prone and time-consuming. The system needs to reliably assign exactly the specified number of Mafia roles while ensuring the remaining players are Villagers, using cryptographically sound randomization.

### Solution
Implement a robust role assignment engine using the Fisher-Yates shuffle algorithm to ensure unbiased, uniformly random role distribution. The engine assigns exactly the specified number of Mafia roles and designates remaining players as Villagers, creating a reliable data structure for the reveal phase while maintaining mathematical fairness in randomization.

### Impact
- Ensures mathematically fair and unbiased role distribution
- Builds player trust through proven randomization algorithms
- Eliminates human error in role assignment
- Provides reliable role data for subsequent game phases
- Supports reproducible testing and validation of allocation logic

## 4. User Personas

### Primary: All Players
- **Role:** Game participants who receive role assignments
- **Context:** Depend on fair, random role distribution for balanced gameplay
- **Requirements:** Unbiased assignment that cannot be predicted or manipulated

### Secondary: Game Host
- **Role:** Person triggering role assignment
- **Context:** Needs confidence that allocation is fair and correct
- **Requirements:** Reliable assignment that matches specified parameters

## 5. User Stories

### Core Assignment Stories
- **US-11:** As a player, the app randomly assigns roles based on the number of Mafia so that exactly the specified number of Mafia and remaining Villagers are distributed fairly

### Enhanced Assignment Stories
- **US-11.1:** As a player, I want role assignment to be truly random so that no one can predict or influence who gets which role
- **US-11.2:** As a player, I want exactly the right number of Mafia roles assigned so that game balance is maintained
- **US-11.3:** As a host, I want role assignment to be mathematically fair so that all players have equal probability within their role type
- **US-11.4:** As a player, I want role assignment to be fast and reliable so that game setup doesn't get delayed by technical issues
- **US-11.5:** As a developer, I want the assignment algorithm to be testable so that fairness can be verified

## 6. Requirements

### Functional Requirements
- Implement Fisher-Yates shuffle algorithm for unbiased randomization
- Assign exactly the specified number of Mafia roles (mafiaCount)
- Assign Villager roles to all remaining players (playerCount - mafiaCount)
- Create reliable role-to-player mapping for reveal phase
- Validate input parameters before assignment (non-negative counts, valid ratios)
- Generate deterministic role counts, non-deterministic role distribution
- Provide assignment results in structured format for integration
- Handle edge cases (0 Mafia, all Mafia, single player)
- Support multiple assignment calls with independent randomization
- Integrate with JavaScript's cryptographically secure random number generator

### Non-Functional Requirements
- Assignment must complete within 200ms for up to 30 players
- Algorithm must provide mathematically uniform distribution
- Memory usage must remain minimal for mobile devices
- Assignment must be repeatable for testing with seeded randomization
- Code must be maintainable and well-documented
- Algorithm must handle concurrent assignment requests independently
- Implementation must be testable with deterministic scenarios
- Performance must remain consistent regardless of player count

## 7. Acceptance Criteria

### AC-1: Fisher-Yates Shuffle Implementation
- [ ] Algorithm implements proper Fisher-Yates shuffle technique
- [ ] Randomization uses cryptographically secure random source
- [ ] Shuffle provides mathematically uniform distribution
- [ ] Implementation handles arrays of 1-30 elements efficiently
- [ ] Algorithm is implemented correctly without off-by-one errors
- [ ] Shuffle is stateless and doesn't affect external data

### AC-2: Role Assignment Logic
- [ ] Assigns exactly mafiaCount players as Mafia
- [ ] Assigns exactly (playerCount - mafiaCount) players as Villagers
- [ ] Each player receives exactly one role assignment
- [ ] Role assignment matches input player list order
- [ ] Assignment creates valid role-to-player mapping
- [ ] Assignment handles player name duplicates correctly

### AC-3: Input Validation and Edge Cases
- [ ] Validates mafiaCount is non-negative and < playerCount
- [ ] Handles mafiaCount = 0 (all Villagers) correctly
- [ ] Handles mafiaCount = playerCount - 1 (nearly all Mafia) correctly
- [ ] Rejects invalid input parameters with clear error messages
- [ ] Handles single player scenario appropriately
- [ ] Validates player list completeness and format

### AC-4: Assignment Output Format
- [ ] Returns structured assignment data (player name + role pairs)
- [ ] Output format integrates cleanly with reveal phase components
- [ ] Assignment data includes all necessary information for gameplay
- [ ] Output maintains player order from input for reveal sequence
- [ ] Data structure is serializable and debuggable
- [ ] Assignment includes metadata (timestamp, counts) for validation

### AC-5: Performance and Reliability
- [ ] Assignment completes within 200ms for 30 players on mobile
- [ ] Memory usage remains minimal during assignment
- [ ] Multiple assignments execute independently without interference
- [ ] Algorithm performance scales linearly with player count
- [ ] System handles rapid repeated assignments without degradation
- [ ] Assignment results are immediately available after completion

### AC-6: Testability and Verification
- [ ] Algorithm supports seeded randomization for testing
- [ ] Assignment results can be validated against input parameters
- [ ] Test suite verifies uniform distribution over many iterations
- [ ] Edge cases are covered by comprehensive test scenarios
- [ ] Implementation includes debugging and logging capabilities
- [ ] Assignment fairness can be measured and verified

### AC-7: Integration and Error Handling
- [ ] Component integrates cleanly with confirmation flow
- [ ] Assignment errors are handled gracefully with recovery
- [ ] Component provides assignment status and progress feedback
- [ ] Integration with role reveal system works reliably
- [ ] Error states don't corrupt application state
- [ ] Assignment can be triggered multiple times safely

## 8. Out of Scope

### Explicitly Not Included
- Confirmation prompt or user interaction (handled by Allocation Confirmation Flow)
- Re-allocation or reshuffling logic (handled by Re-allocation System)
- Role reveal interface or player interaction (handled by Role Display & Reveal epic)
- Advanced role types beyond Mafia/Villager
- Assignment history or persistence across sessions
- Custom randomization algorithms or alternative assignment methods
- Assignment analytics or statistical tracking
- Integration with external randomness sources

### Future Considerations
- Could add support for additional role types (Doctor, Detective, etc.)
- Could implement weighted randomization for advanced game modes
- Could add assignment verification and audit capabilities
- Could integrate with external entropy sources for enhanced randomization
- Could implement assignment templates or presets
- Could add statistical analysis of assignment fairness over time

### Integration Boundaries
- **Receives:** Confirmed allocation parameters from Allocation Confirmation Flow
- **Provides:** Complete role assignments for Role Display & Reveal epic
- **Dependencies:** Allocation Confirmation Flow (for assignment trigger)
- **Dependents:** Role Display & Reveal epic (consumes assignment data)

### Algorithm Scope
- **Included:** Fisher-Yates shuffle, role distribution, input validation, structured output
- **Excluded:** Complex game balance algorithms, external randomness, advanced role mechanics
- **Edge Cases:** 0 Mafia, all Mafia, single player handled with appropriate role distribution

## Context Template

- **Epic:** Role Allocation - providing mathematically fair and reliable role assignment foundation
- **Feature Idea:** Unbiased role assignment engine using proven algorithms to ensure fair game setup
- **Target Users:** All players who depend on fair role distribution for balanced gameplay experience