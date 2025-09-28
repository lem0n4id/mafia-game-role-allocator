# Feature PRD: Re-allocation System

## 1. Feature Name

Re-allocation System

## 2. Epic

- **Parent Epic:** [Role Allocation](../epic.md)
- **Architecture:** [Role Allocation Architecture](../arch.md)

## 3. Goal

### Problem
Hosts sometimes want to reshuffle roles if the initial allocation doesn't seem right or if players request a different distribution. Without a clear re-allocation mechanism, hosts must restart the entire setup process, losing entered names and configuration. Previous allocations might influence new ones, leading to biased re-assignments that undermine fairness.

### Solution
Implement a clean re-allocation system that allows hosts to trigger new role assignments while completely discarding previous allocations. The system maintains all input data (names, counts) while generating fresh, independent role assignments using the same unbiased randomization as initial allocation, ensuring each re-allocation is fair and independent.

### Impact
- Enables quick role reshuffling without losing setup progress
- Maintains fairness through independent randomization on each allocation
- Reduces setup restart frustration and time waste
- Supports host flexibility in achieving desired game dynamics
- Preserves game setup efficiency while allowing iteration

## 4. User Personas

### Primary: Game Host
- **Role:** Person managing game setup who may want to reshuffle roles
- **Context:** Needs ability to generate new role assignments without restarting entire setup
- **Requirements:** Quick, fair re-allocation that preserves names and configuration

### Secondary: All Players
- **Role:** Game participants who may request role reshuffling
- **Context:** Want assurance that re-allocation is as fair as initial allocation
- **Requirements:** Independent, unbiased role assignment on each allocation attempt

## 5. User Stories

### Core Re-allocation Stories
- **US-12:** As a host, if 'Allocate Roles' is clicked again, the app reshuffles all roles randomly so that I can get a different role distribution

### Enhanced Re-allocation Stories
- **US-12.1:** As a host, I want re-allocation to completely discard previous assignments so that new allocation is independent and fair
- **US-12.2:** As a host, I want re-allocation to preserve all my entered names and counts so that I don't have to re-enter information
- **US-12.3:** As a host, I want re-allocation to be as fair as initial allocation so that players trust the reshuffling process
- **US-12.4:** As a host, I want unlimited re-allocation attempts so that I can reshuffle until I'm satisfied with the distribution
- **US-12.5:** As a player, I want each re-allocation to be independent so that previous results don't bias new assignments

## 6. Requirements

### Functional Requirements
- 'Allocate Roles' button remains available after initial allocation
- Clicking the button triggers new allocation with same parameters (names, counts)
- Previous role assignments are completely discarded before new allocation
- New allocation uses independent randomization (fresh Fisher-Yates shuffle)
- Re-allocation preserves all input data (player names, player count, Mafia count)
- Each re-allocation goes through same confirmation flow as initial allocation
- Re-allocation generates completely new role-to-player mapping
- System supports unlimited re-allocation attempts within session
- Re-allocation state management prevents interference between attempts
- Integration with role reveal system updates with new assignments

### Non-Functional Requirements
- Re-allocation must complete within 200ms like initial allocation
- Memory usage must remain stable across multiple re-allocations
- Each re-allocation must be mathematically independent of previous attempts
- Re-allocation must maintain same performance as initial allocation
- System must handle rapid re-allocation attempts without degradation
- State management must prevent corruption during re-allocation
- Re-allocation must be testable and verifiable for independence
- Interface must provide clear feedback about re-allocation progress

## 7. Acceptance Criteria

### AC-1: Re-allocation Trigger and Availability
- [ ] 'Allocate Roles' button remains available after initial allocation
- [ ] Button behavior is identical for initial and subsequent allocations
- [ ] Re-allocation follows same confirmation flow as initial allocation
- [ ] Button state management works correctly across multiple allocations
- [ ] Re-allocation can be triggered unlimited times within session
- [ ] Interface clearly indicates that re-allocation is available

### AC-2: Previous Assignment Cleanup
- [ ] Each new allocation completely discards previous role assignments
- [ ] Previous allocation data doesn't influence new randomization
- [ ] System state is properly reset before new allocation begins
- [ ] Memory from previous allocations is properly cleaned up
- [ ] No residual data from previous attempts affects new allocation
- [ ] State cleanup is atomic and doesn't leave partial data

### AC-3: Input Data Preservation
- [ ] Player names are preserved across all re-allocation attempts
- [ ] Player count remains unchanged during re-allocation
- [ ] Mafia count remains unchanged during re-allocation
- [ ] Input validation state is preserved and remains valid
- [ ] All configuration settings persist through re-allocation
- [ ] Input form state remains consistent and usable

### AC-4: Independent Randomization
- [ ] Each allocation uses fresh, independent randomization
- [ ] Statistical distribution is uniform across all allocation attempts
- [ ] No bias toward or away from previous assignment results
- [ ] Each Fisher-Yates shuffle starts with clean state
- [ ] Randomization entropy is refreshed for each attempt
- [ ] Assignment results are verifiably independent over multiple attempts

### AC-5: State Management and Integration
- [ ] Re-allocation integrates seamlessly with role reveal system
- [ ] New assignments immediately replace previous data in reveal interface
- [ ] Application state remains consistent during re-allocation
- [ ] Error handling works correctly for re-allocation failures
- [ ] Integration with other components handles re-allocation updates
- [ ] State transitions are atomic and don't leave corrupt intermediate states

### AC-6: Performance and Reliability
- [ ] Re-allocation performance matches initial allocation (within 200ms)
- [ ] Multiple rapid re-allocations don't degrade performance
- [ ] Memory usage remains stable across many re-allocation attempts
- [ ] System handles re-allocation errors gracefully with recovery
- [ ] Re-allocation works reliably across all supported mobile browsers
- [ ] Stress testing confirms stability under rapid repeated allocations

### AC-7: User Experience and Feedback
- [ ] Re-allocation provides same user feedback as initial allocation
- [ ] Loading states and completion indicators work for re-allocation
- [ ] Users can distinguish between initial and re-allocation attempts
- [ ] Interface communicates when new allocation is complete
- [ ] Error messages are appropriate for re-allocation context
- [ ] User experience is consistent across all allocation attempts

## 8. Out of Scope

### Explicitly Not Included
- Allocation confirmation interface (handled by Allocation Confirmation Flow)
- Core randomization algorithm (handled by Role Assignment Engine)
- Role reveal interface updates (handled by Role Display & Reveal epic)
- Input validation or modification during re-allocation
- Advanced re-allocation modes or customization options
- Persistence of allocation history across sessions
- Undo/redo functionality for previous allocations
- Statistical analysis or tracking of re-allocation patterns

### Future Considerations
- Could add allocation history view showing previous attempts
- Could implement allocation comparison tools
- Could add "lock" functionality to preserve specific assignments
- Could integrate with statistical analysis of allocation fairness
- Could add batch re-allocation with multiple simultaneous attempts
- Could implement allocation templates or saved configurations
- Could add social features like voting on preferred allocations

### Integration Boundaries
- **Receives:** Re-allocation trigger from Allocation Confirmation Flow
- **Provides:** Fresh role assignments to Role Display & Reveal epic
- **Dependencies:** Allocation Confirmation Flow (for re-allocation trigger), Role Assignment Engine (for fresh randomization)
- **Dependents:** Role Display & Reveal epic (updates with new assignments)

### Re-allocation Scope
- **Included:** Clean state reset, independent randomization, input preservation, unlimited attempts
- **Excluded:** History tracking, comparison tools, advanced configuration, external persistence
- **Edge Cases:** Handles edge allocations (0 Mafia, all Mafia) with same logic as initial allocation

## Context Template

- **Epic:** Role Allocation - completing flexible allocation system with fair re-shuffling capabilities
- **Feature Idea:** Clean re-allocation system that enables role reshuffling while maintaining fairness and preserving setup data
- **Target Users:** Game hosts who need flexibility to reshuffle roles and players who want assurance of continued fairness