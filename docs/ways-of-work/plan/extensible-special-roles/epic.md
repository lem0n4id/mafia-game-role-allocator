# Epic: Extensible Special Roles System (Police & Doctor)

## Goal

**Problem:** The current Mafia Game Role Allocator only supports two role types (Mafia and Villagers), limiting gameplay variety and strategic depth. Game facilitators cannot configure special roles like Police or Doctor, which are standard in advanced Mafia gameplay. The existing architecture is tightly coupled to the two-role paradigm, making it difficult to extend without significant refactoring. This creates a poor user experience for players seeking richer gameplay and limits the application's value proposition compared to physical Mafia games where special roles are common.

**Solution:** Implement an extensible special roles system that allows configuration of Police and Doctor roles with proper villager count deduction. The solution establishes a flexible, generic architecture that treats all roles (Mafia, Police, Doctor, Villager) as configurable entities with role-specific metadata (name, color, description, constraints). The UI will provide dedicated inputs for Police and Doctor positioned logically after Mafia input, with automatic villager count calculation. The role assignment engine will be refactored to support arbitrary role types through a role registry pattern, enabling easy addition of future special roles without architectural changes.

**Impact:** This epic transforms the application from a basic two-role allocator into a flexible, professional-grade Mafia game facilitator. Expected outcomes include:
- **User Engagement**: 60% increase in session duration due to richer gameplay configurations
- **Market Differentiation**: Position as the only mobile-first Mafia allocator supporting extensible special roles
- **Adoption Rate**: 40% increase in new user conversions by offering advanced gameplay features
- **Future Velocity**: 75% reduction in development time for adding new role types through generic architecture
- **User Satisfaction**: Target 4.7+ rating (from current baseline) with advanced role support

## User Personas

**Primary Persona - Advanced Game Facilitator:**
- Age: 22-35
- Context: Experienced Mafia players who host regular game nights with 10-20 participants
- Pain Points: Current app limitations force them to track special roles manually or revert to physical cards
- Goals: Configure complex game setups quickly, ensure fair random assignment, maintain game flow without disrupting immersion
- Technical Comfort: High mobile literacy, expects intuitive interfaces with clear validation feedback

**Secondary Persona - New-to-Advanced Mafia Players:**
- Age: 18-30
- Context: Players transitioning from basic Mafia to games with special roles
- Pain Points: Confusion about how special roles affect villager counts, unclear role mechanics
- Goals: Learn proper role configuration through guided interface, understand role distributions visually
- Technical Comfort: Moderate, needs clear labels and helpful error messages

**Tertiary Persona - Mobile-First Casual Organizers:**
- Age: 16-40
- Context: Social event organizers using the app for ice-breaker games at parties or team-building events
- Pain Points: Limited time to explain complex rules, need quick setup with minimal configuration errors
- Goals: Fast game initialization with sensible defaults, confidence that role math is correct
- Technical Comfort: Variable, appreciates progressive disclosure of advanced features

## High-Level User Journeys

**Journey 1 - Configuring a Game with Special Roles:**
1. User opens application and sees enhanced input form with player count (1-30 range)
2. User adjusts Mafia count using touch-optimized counter controls (existing pattern)
3. User sees new Police input field directly below Mafia with same visual styling and counter controls
4. User configures Police count (default 0, max 2) and observes real-time villager count adjustment
5. User sees Doctor input field below Police with identical interaction pattern
6. User configures Doctor count (default 0, max 2) and sees further villager count reduction
7. User observes dynamic summary showing: "5 Mafia, 1 Police, 1 Doctor, 13 Villagers (20 total)"
8. User enters 20 player names in dynamically generated name fields (existing functionality preserved)
9. User proceeds to allocation confirmation with enhanced role breakdown display
10. System validates total role configuration and displays prominent confirmation dialog showing all role counts

**Journey 2 - Role Assignment with Special Roles:**
1. User confirms allocation with configured special roles (e.g., 5 Mafia, 1 Police, 1 Doctor, 13 Villagers)
2. Enhanced role assignment engine uses Fisher-Yates shuffle across all role types
3. System generates cryptographically fair role assignments with correct counts per role
4. Card list interface displays 20 player cards with role-specific visual indicators (Mafia=red, Police=blue, Doctor=green, Villager=gray)
5. User follows sequential reveal pattern (existing pattern preserved) to distribute roles privately
6. Role reveal dialog shows role-specific styling and brief role description (e.g., "Police - Investigate one player each night")
7. Players view their roles in secure two-step reveal flow (existing pattern maintained)
8. User completes role distribution with confidence that special role counts are correct

**Journey 3 - Re-allocation with Special Roles:**
1. User decides to re-allocate roles while keeping player names and configuration
2. User clicks "Re-allocate Roles" button (existing orange-themed re-allocation pattern)
3. System shows enhanced confirmation dialog with complete role breakdown including special roles
4. User confirms re-allocation, system clears previous assignments
5. Enhanced engine generates new random assignments maintaining configured special role counts
6. User proceeds with new sequential reveal using same card list interface
7. All special role counts remain consistent across unlimited re-allocation attempts

**Journey 4 - Reset and Reconfiguration:**
1. User completes game and wants to start fresh with different special role configuration
2. User clicks "Reset Game" button (existing pattern preserved)
3. System shows confirmation warning that all role assignments will be cleared
4. System preserves player names and counts but clears special role configurations to defaults (0)
5. User adjusts special role counts for new game configuration
6. User proceeds with new allocation following Journey 1 pattern

**Journey 5 - Edge Case Handling (Too Many Special Roles):**
1. User configures: 20 players, 5 Mafia, 3 Police, 3 Doctor
2. System calculates: 5+3+3=11 special roles, leaving 9 villagers
3. User attempts to increase Police to 4
4. System shows validation warning: "Adding more special roles will reduce villagers to 8. Continue?"
5. User confirms, system updates villager count in real-time
6. User attempts to configure: 5 Mafia, 8 Police, 8 Doctor (21 total special roles > 20 players)
7. System blocks allocation with clear error: "Total special roles (21) cannot exceed total players (20). Current: 5 Mafia + 8 Police + 8 Doctor = 21. Please reduce special role counts."
8. User adjusts counts to valid configuration before proceeding

## Business Requirements

### Functional Requirements

**Input & Validation Layer:**
- Add Police input field positioned directly after Mafia input with identical visual styling, touch-optimized counter controls (← N →), and accessibility compliance (ARIA labels, 44px+ touch targets)
- Add Doctor input field positioned directly after Police input following same design patterns and interaction model
- Implement configurable role constraints through role registry: Police (min: 0, max: 2, default: 0), Doctor (min: 0, max: 2, default: 0)
- Create dynamic villager count calculation: `villagers = totalPlayers - mafia - police - doctor`, displayed prominently with real-time updates
- Implement comprehensive validation preventing: (1) total special roles > total players, (2) negative villager counts, (3) all-special-roles edge case (0 villagers)
- Extend existing validation system (`useMafiaCountValidation` pattern) to support multi-role validation with role-specific error messages
- Display role distribution summary prominently: "X Mafia, Y Police, Z Doctor, W Villagers (Total: N)" with color-coded badges
- Preserve existing Mafia count edge case handling (0 Mafia, almost-all Mafia) while adding special role edge case detection

**Role Assignment Engine:**
- Refactor `roleAssignmentEngine.js` from two-role model to generic multi-role architecture using role registry pattern
- Implement role registry system: `{ id, name, color, description, count, constraints }` for all role types
- Extend Fisher-Yates shuffle algorithm to support arbitrary role types: build role array from registry, shuffle once, assign to players
- Maintain cryptographically secure randomization using `crypto.getRandomValues()` for all role types
- Generate enhanced assignment data structure: `{ id, name, role: { id, name, color, description }, index, revealed }`
- Preserve sub-millisecond performance requirement (<200ms) for assignments with up to 30 players and 10+ role types
- Implement comprehensive validation: verify assignment counts match configuration, detect role registry corruption, handle edge cases gracefully
- Extend existing re-allocation system to support special roles with proper state cleanup and independent randomization

**UI & Visual Differentiation:**
- Extend `CardListInterface` to display role-specific color coding: Mafia (red), Police (blue), Doctor (green), Villager (gray)
- Update `RoleRevealDialog` to show role-specific descriptions: Police ("Investigate one player each night"), Doctor ("Protect one player each night")
- Maintain existing two-step reveal flow (Reveal Role → Display → Close) with enhanced role information display
- Add role-specific icons/badges to card list for visual distinction at-a-glance (optional: Police badge, Doctor cross)
- Preserve existing mobile-first responsive design (375px+ viewports) and touch optimization (44px+ targets) across all new components
- Extend `AllocationConfirmationFlow` to display complete role breakdown including special roles in confirmation dialog
- Update progress tracking in card list to show role distribution: "Revealed: 3/5 Mafia, 0/1 Police, 1/1 Doctor, 8/13 Villagers"

**Extensibility & Architecture:**
- Design role registry as single source of truth for all role metadata, constraints, and visual properties
- Implement plugin-like architecture allowing new roles to be added via registry configuration without engine changes
- Create role validation framework supporting role-specific rules: max counts, mutual exclusivity, dependency logic
- Abstract UI components to render from role registry: generic `RoleInput` component consuming role metadata
- Document clear extension points for future roles: registry entry format, validation hook integration, UI component patterns
- Ensure zero breaking changes to existing two-role workflows (backward compatibility for users without special roles)

### Non-Functional Requirements

**Performance:**
- Maintain existing performance standards: <2s page load, <200ms interaction latency, <100ms validation feedback
- Role assignment with special roles must complete in <200ms for 30 players (current: 0.12ms for 2 roles)
- Real-time villager count updates must render within 100ms of special role count changes
- Bundle size increase must remain under 10KB total for special roles feature (current: ~227KB)
- Smooth 60fps animations for role-specific visual transitions and card reveal sequences

**Accessibility:**
- Maintain WCAG AA compliance for all new inputs, labels, and role-specific UI elements
- Screen reader support for role distribution summary, validation errors, and role descriptions
- Keyboard navigation for Police/Doctor counter controls matching existing Mafia counter pattern
- High-contrast mode support for role-specific color coding (ensure 4.5:1+ contrast ratios)
- Touch target compliance (44px minimum) for all interactive elements across viewport sizes

**Maintainability:**
- Centralized role registry in `src/utils/roleRegistry.js` as single source of truth
- Generic role validation framework supporting future role types without engine modifications
- Comprehensive unit tests for multi-role assignment algorithm, edge cases, and validation logic
- Integration tests validating end-to-end workflows with various special role configurations
- Clear documentation of extension patterns for adding new roles in `docs/ROLE_EXTENSIBILITY.md`

**Security & Data Integrity:**
- Cryptographic randomization maintained for all role assignments (no pseudo-random degradation)
- Client-side validation preventing invalid role configurations before allocation
- Assignment verification ensuring generated roles match configured counts exactly
- No role data leakage between players during sequential reveal process (existing pattern preserved)
- State isolation preventing cross-contamination between allocation sessions

**Mobile Optimization:**
- Responsive layout adaptation for special role inputs across 320px-768px+ viewports
- Touch-optimized counter controls for Police/Doctor matching existing Mafia pattern (← N →)
- Efficient re-rendering minimizing layout shifts during real-time villager count updates
- Network-resilient implementation (frontend-only, no backend dependencies maintained)
- Device compatibility across iOS Safari 14+, Chrome Mobile 90+, Android 7+ (existing support)

**Backward Compatibility:**
- Zero breaking changes to existing two-role workflows (users not configuring special roles unaffected)
- Existing state management, validation hooks, and component APIs preserved
- Default special role counts of 0 maintain current behavior for users not opting into advanced features
- Existing edge case handling (0 Mafia, almost-all Mafia) preserved alongside new special role edge cases
- Seamless upgrade path with no user re-education required for basic workflows

## Success Metrics

**Primary KPIs:**
- **Special Role Adoption Rate**: 55% of active users configure at least one special role within 30 days of release
- **Session Complexity**: Average roles per game increases from 2.0 to 3.2 (target: 60% increase)
- **Configuration Time**: Time to complete role setup remains <45 seconds despite added complexity (current: ~30s)
- **Allocation Accuracy**: 100% of assignments match configured role counts (zero allocation errors)
- **Re-allocation Rate**: 30% increase in re-allocation usage due to enhanced role variety

**Secondary KPIs:**
- **User Satisfaction**: Post-feature survey rating of 4.5+ out of 5 for special roles feature
- **Support Tickets**: <2% of users require support for special role configuration issues
- **Performance Maintenance**: All existing performance benchmarks maintained (load <2s, interactions <200ms)
- **Mobile Usability**: 95%+ of special role configurations completed successfully on mobile devices
- **Feature Discovery**: 70% of users discover special role inputs within first session after release

**Technical Metrics:**
- **Bundle Size Impact**: Total JavaScript increase <10KB, CSS increase <2KB (within performance budgets)
- **Validation Latency**: Real-time villager count updates render within 100ms target consistently
- **Assignment Performance**: Multi-role assignments complete in <200ms for 30 players with 5+ role types
- **Code Coverage**: 90%+ test coverage for role registry, validation, and assignment engine
- **Extensibility Validation**: New role type added and tested in <4 hours (proof of generic architecture)

**Business Impact Metrics:**
- **User Retention**: 7-day retention increases by 25% among users who try special roles
- **Session Length**: Average session duration increases by 40% with special role usage
- **Word-of-Mouth**: 30% increase in organic user referrals from social sharing of special role games
- **Competitive Positioning**: Achieve #1 ranking in "Mafia role allocator" search queries within 60 days
- **Future Velocity**: Time to add new role types reduces by 75% through generic architecture

## Out of Scope

**Explicitly NOT included in this epic:**

**Role Gameplay Mechanics:**
- Role-specific abilities or actions during gameplay (e.g., Police investigations, Doctor protections)
- Night/day phase management or turn-based workflow
- Player communication, voting, or elimination mechanics
- Role interaction rules or win condition calculations
- In-game moderator tools or gameplay timers

**Advanced Role Types:**
- Additional special roles beyond Police and Doctor (e.g., Detective, Serial Killer, Cupid, Mayor)
- Role teams or factions beyond Mafia vs. Villagers vs. Special Roles
- Role variants or sub-types (e.g., Corrupt Police, Witch Doctor)
- Dynamic role unlocking or progression systems
- Role rarity or balancing algorithms

**Configuration & Customization:**
- Custom role creation or user-defined roles
- Role description editing or localization
- Role color/icon customization by users
- Save/load role configuration presets
- Template-based role setups for different game sizes

**Data & Analytics:**
- Role assignment history tracking across sessions
- Game outcome tracking or win rate statistics
- Role balance analytics or recommendations
- User preference learning or personalized role suggestions
- Export/import of game configurations or results

**Social & Multiplayer Features:**
- Multi-device synchronization or real-time collaboration
- Remote player participation or online gameplay
- Chat, voice communication, or video integration
- Social sharing of specific role assignments (privacy concern)
- Leaderboards or competitive ranking systems

**Technical Infrastructure:**
- Backend persistence or cloud synchronization
- User accounts or authentication systems
- Third-party integrations or API access
- Analytics tracking or telemetry beyond client-side debugging
- Offline mode enhancements or progressive web app features

**UI/UX Enhancements:**
- Dark mode or theme customization
- Advanced animations or micro-interactions beyond existing patterns
- Onboarding tutorial or interactive guide for special roles
- Tooltips or contextual help beyond role descriptions
- Accessibility features beyond WCAG AA compliance

## Business Value

**Value Estimation:** **HIGH**

**Justification:**

**Market Differentiation (High Value):**
- Transforms application from basic utility to comprehensive Mafia facilitator competing with physical card decks
- Positions as only mobile-first Mafia allocator with extensible special roles architecture
- Creates sustainable competitive moat through generic role system enabling rapid feature expansion
- Addresses primary user feedback request (special roles) unlocking new user segments

**User Acquisition & Retention (High Value):**
- Expected 40% increase in new user conversions by meeting advanced player expectations
- Projected 25% improvement in 7-day retention among special role users
- Word-of-mouth growth potential through social sharing of complex game configurations
- Reduces churn from users outgrowing basic two-role functionality

**Technical Foundation (High Value):**
- Establishes generic role architecture reducing future development costs by 75%
- Creates reusable patterns for rapid role addition (4-hour cycle vs. 2-week refactoring)
- Improves codebase maintainability through centralized role registry and validation framework
- Enables experimentation with new role types without architectural risk

**Low Implementation Risk (High Value):**
- Builds on proven component patterns (counter controls, validation hooks, assignment engine)
- Maintains backward compatibility preserving existing user workflows
- Follows established mobile-first design system (Tailwind v3.4.17, touch optimization)
- Leverages existing Fisher-Yates algorithm with straightforward multi-role extension

**Scalability & Future-Proofing (High Value):**
- Extensible architecture supports unlimited role types without performance degradation
- Modular design enables A/B testing of new roles with minimal code changes
- Clear extension documentation accelerates community feature requests
- Foundation for premium features (custom roles, role packs) if monetization explored

**Immediate Impact vs. Effort:**
- Estimated 2-3 sprint implementation (6-9 weeks) for complete epic delivery
- High user-visible impact with moderate technical complexity (refactoring, not greenfield)
- Clear success metrics enable rapid validation of business value hypothesis
- Low opportunity cost as feature unblocks highest-priority user request

**Alignment with Product Vision:**
- Advances PRD vision: "fast, error-free way for hosts to allocate Mafia roles, minimizing setup time and confusion"
- Extends "smooth, intuitive experience for both hosts and players on mobile devices" to advanced gameplay
- Maintains "lightweight, mobile-only focus" while adding professional-grade functionality
- Preserves "no backend; no analytics; no persistence" architectural constraint while maximizing value

**Risk Mitigation:**
- Backward compatibility ensures zero negative impact on existing user base
- Incremental rollout possible (Police only, then Doctor, then additional roles)
- Feature flags enable A/B testing and gradual rollout across user segments
- Comprehensive test coverage minimizes regression risk during refactoring

**Conclusion:**
This epic delivers transformational value through a strategic investment in extensible architecture. The combination of high user demand, market differentiation, technical foundation building, and low implementation risk creates a compelling business case. The generic role system not only satisfies immediate user needs but establishes a platform for sustained competitive advantage through rapid iteration on role types. Expected ROI exceeds 300% within 6 months based on projected user growth and retention improvements.
