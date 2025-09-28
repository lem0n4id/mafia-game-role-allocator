# Mafia Game Role Allocator — Copilot Development Instructions

## 🚨 **MANDATORY: DOCUMENTATION UPDATE PROTOCOL** 🚨

### **⚠️ STOP: Read This Before Making ANY Changes ⚠️**

**EVERY architectural change MUST include documentation updates. No exceptions.**

#### **🔥 IMMEDIATE ACTION REQUIRED After ANY Code Change:**

**Before considering your work "complete", you MUST complete this checklist:**

✅ **1. UPDATE copilot-instructions.md (THIS FILE):**
   - [ ] Update "Current Architecture Status" section (lines 150-200)
   - [ ] Update relevant code patterns and examples  
   - [ ] Update file structure if files were added/moved
   - [ ] Update component patterns if new patterns introduced
   - [ ] Add new development guidelines if applicable

✅ **2. UPDATE DEVELOPMENT.md:**
   - [ ] Mark completed steps with ✅ **COMPLETE** status
   - [ ] Update current phase/step status
   - [ ] Add new architectural decisions to the log
   - [ ] Update timeline estimates and next steps
   - [ ] Document any breaking changes or migration steps

✅ **3. VALIDATE DOCUMENTATION CONSISTENCY:**
   - [ ] Search for outdated patterns that conflict with changes
   - [ ] Remove or update deprecated examples
   - [ ] Verify all code examples reflect current architecture
   - [ ] Update import statements and API references

✅ **4. TEST DOCUMENTATION ACCURACY:**
   - [ ] Ensure new contributors could follow the updated docs
   - [ ] Verify code examples compile and work
   - [ ] Check that docs reflect actual codebase state
   - [ ] Test that documented patterns match implemented code

### **🎯 Documentation Update Triggers (NEVER SKIP):**
- ✅ Creating new hooks, components, or utilities
- ✅ Modifying existing architectural patterns  
- ✅ Completing any refactoring step or phase
- ✅ Adding new development tools or workflows
- ✅ Changing file structure or organization
- ✅ Introducing new performance optimizations
- ✅ Adding new state management patterns

### **💥 ENFORCEMENT: If Documentation Is Not Updated**
- **Your changes are incomplete** - Documentation debt creates confusion
- **Future developers will be misled** - Outdated docs are worse than no docs
- **Architecture will deteriorate** - Patterns won't be followed consistently
- **Project velocity will slow** - Time wasted on confusion and rework

### **🎪 Quick Documentation Health Check:**
Before submitting any architectural change, ask yourself:
- ❓ Could a new team member understand the current architecture from the docs?
- ❓ Do all code examples in copilot-instructions.md work with current code?
- ❓ Does DEVELOPMENT.md accurately reflect what's been completed?
- ❓ Are there conflicting patterns or outdated instructions anywhere?

---

## Project Context
- Mobile-only, portrait layout, minimal and lightweight web app
- Frontend only; no backend; no analytics; no persistence
- Roles: Mafia vs Villagers only (no advanced roles)
- Core flows: Input & Validation → Allocation (with confirmation) → Sequential Reveal → Reset/Re-Allocate

## 🚨 **CRITICAL: UI Styling Requirements**

### **⚠️ TAILWIND CSS VERSION REQUIREMENT**
**NEVER upgrade to Tailwind CSS v4+ without extensive testing!**

- ✅ **Required**: Tailwind CSS v3.4.0 or compatible v3.x version
- ❌ **Incompatible**: Tailwind CSS v4.x+ 

---

### **PostCSS Configuration (CRITICAL)**
**File**: `postcss.config.js`
```javascript
// ✅ CORRECT (Tailwind v3):
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

// ❌ WRONG (Tailwind v4 - DO NOT USE):
export default {
  plugins: {
    '@tailwindcss/postcss': {}, // This breaks shadcn
    autoprefixer: {},
  },
}
```

## Code Organization Principles

### Component Architecture
**Follow the simplified component pattern:**
[UPDATE THIS WHEN ENCOUNTERED]

### **📋 File Organization Checklist**

Before creating any new file, ask:
- [ ] Is this a core project file? → Root directory (rare)
- [ ] Is this documentation? → `docs/` directory
- [ ] Is this a test or development tool? → `dev-tools/` directory  
- [ ] Is this application source code? → `src/` directory
- [ ] Does the file follow established naming conventions?
- [ ] Is there a README in the target directory explaining its purpose?

### **🔧 Maintenance Guidelines**

**Regular cleanup (monthly):**
- [ ] Review `dev-tools/` for obsolete test files
- [ ] Update `docs/README.md` when adding new documentation
- [ ] Ensure root directory remains clean and essential-only
- [ ] Verify all directories have explanatory README files

**Documentation organization:**
- [ ] Group related docs by feature or phase
- [ ] Use consistent naming: `FEATURE_IMPLEMENTATION.md`, `PHASE_X_PLAN.md`
- [ ] Link between related documents
- [ ] Keep navigation clear in `docs/README.md`

## Development Workflow

**🚨 DOCUMENTATION-FIRST WORKFLOW - Follow This Sequence:**

1. **Build common components** - Create basic UI components  
2. **Create stores** - Set up state management
3. **Assemble features** - Create complex functional components
4. **Test integration** - Ensure components work together
5. **Optimize performance** - Profile and optimize bottlenecks
6. **📋 UPDATE DOCUMENTATION** - Complete the mandatory protocol checklist above

**⚠️ Your work is NOT complete until step 6 is done!**

## Code Quality Standards

- Use ESLint + Prettier for consistent formatting
- Prefer explicit over implicit code
- Write self-documenting code with clear naming
- Add JSDoc comments for complex functions
- Prefer immutable updates over mutations
- Use semantic commit messages
- **Use Tailwind CSS v3.x only** - Do not upgrade to v4+ without compatibility testing
- **Scope custom CSS** - Avoid universal selectors

## When Working on Mafia Game Role Allocator

**🚨 FINAL CHECKPOINT: Before considering ANY work "complete":**
- [ ] Code implements the intended functionality
- [ ] Tests pass and code works as expected  
- [ ] Performance impact has been considered/measured
- [ ] **copilot-instructions.md has been updated**
- [ ] **DEVELOPMENT.md has been updated**
- [ ] **Documentation reflects current architecture**

**If any checkbox above is unchecked, your work is not finished!**

## Current Architecture Status (September 29, 2025):

- Documentation scaffold created. Epic PRDs authored for Phases 1–6 and "Alternative / Edge Cases" under `docs/ways-of-work/plan/*/epic.md`.
- No application code implemented yet (project scaffolding not initialized). Next step: Phase 1 setup & project scaffolding.
- Architecture specs added for all phases (1–6) and Alternative / Edge Cases under `docs/ways-of-work/plan/*/arch.md`.
- ✅ **Feature breakdown completed for ALL epics** into implementable features:
  - **Setup & Project Scaffolding:** 4 features (Vite React, Tailwind, Dev Tooling, Mobile Optimization)
  - **Input & Validation:** 3 features (Player Count Management, Mafia Count Validation, Player Name Input System)
  - **Role Allocation:** 3 features (Allocation Confirmation Flow, Role Assignment Engine, Re-allocation System)  
  - **Role Display & Reveal:** 3 features (Card List Interface, Role Reveal Dialog, Sequential Order Enforcement)
  - **Reset & Re-Allocate:** 1 feature (Reset Button System)
  - **Minimal Styling & UI Clarity:** 2 features (Visual Differentiation System, Mobile Layout Optimization)
  - **Alternative & Edge Cases:** 2 features (Edge Case Validation, Error Recovery System)
- **Total: 18 independent, implementable features** with complete user stories, acceptance criteria, and technical requirements
- Each feature PRD includes functional/non-functional requirements, integration boundaries, and clear scope definitions
- ✅ **Implementation plans completed for ALL 18 features** with complete technical specifications:
  - **React component implementations** with hooks, state management, and prop interfaces
  - **System architecture diagrams** with mermaid flowcharts showing data flow and integration
  - **Performance optimization** strategies for mobile-first responsive design
  - **Accessibility compliance** with WCAG AA standards and mobile screen reader support
  - **Step-by-step implementation** instructions with clear dependency management
- Location: `docs/ways-of-work/plan/{epic-name}/{feature-name}/implementation-plan.md`
- ✅ **Project plans and issues checklists created** for all features:
   - Project plans: `docs/ways-of-work/plan/{epic-name}/{feature-name}/project-plan.md`
   - Issues checklists: `docs/ways-of-work/plan/{epic-name}/{feature-name}/issues-checklist.md`
   - Generated using `.github/prompts/breakdown-plan.prompt.md` for GitHub project planning
- ✅ **Implementation plan prompt template created** at `.github/prompts/breakdown-feature-implementation.prompt.md`:
  - **Comprehensive prompt template** for generating consistent technical implementation plans
  - **System architecture documentation** with Mermaid diagrams and integration patterns
  - **Database schema design** with ERD specifications and migration strategies
  - **API design guidelines** with tRPC endpoints and TypeScript type definitions
  - **Frontend component hierarchy** with state management and custom component patterns
  - **Security and performance** optimization guidelines and deployment architecture
  - Used to generate all 18 implementation plans with consistent technical specifications
- **Ready for development phase** with actionable technical architecture and working code examples

## 📋 **Architectural Decisions Log**

### Initial project setup (September 28, 2025)

### Epic documentation authored (September 29, 2025)
- Added Epic PRDs:
   1. Setup & Project Scaffolding
   2. Input & Validation
   3. Role Allocation
   4. Role Display & Reveal
   5. Reset / Re-Allocate
   6. Minimal Styling & UI Clarity
   7. Alternative / Edge Cases (stories 25–30)
- Location: `docs/ways-of-work/plan/{epic-name}/epic.md`
- Note: No code changes yet; these documents guide upcoming implementation.

### Architecture specification added (September 29, 2025)
- Added `arch.md` for Setup & Project Scaffolding to define the high-level technical approach.
- Added `arch.md` for Input & Validation defining React hook-based validation architecture.
- Added `arch.md` for Role Allocation defining confirmation modal and Fisher-Yates shuffle architecture.
- Added `arch.md` for Role Display & Reveal defining dialog state management and order enforcement.
- Added `arch.md` for Reset & Re-Allocate defining state cleanup and data preservation patterns.
- Added `arch.md` for Minimal Styling & UI Clarity defining Tailwind v3 utility-first styling system.
- Added `arch.md` for Alternative / Edge Cases defining idempotency guards and error recovery patterns.

### Feature breakdown completed (September 29, 2025)
- ✅ **ALL EPICS broken down** into 18 independent features with complete PRDs:
  - **Setup & Project Scaffolding (4 features)**: Vite React Initialization, Tailwind Integration, Development Tooling, Mobile Optimization
  - **Input & Validation (3 features)**: Player Count Management, Mafia Count Validation, Player Name Input System  
  - **Role Allocation (3 features)**: Allocation Confirmation Flow, Role Assignment Engine, Re-allocation System
  - **Role Display & Reveal (3 features)**: Card List Interface, Role Reveal Dialog, Sequential Order Enforcement
  - **Reset & Re-Allocate (1 feature)**: Reset Button System
  - **Minimal Styling & UI Clarity (2 features)**: Visual Differentiation System, Mobile Layout Optimization
  - **Alternative & Edge Cases (2 features)**: Edge Case Validation, Error Recovery System
- Location: `docs/ways-of-work/plan/{epic-name}/{feature-name}/prd.md`
- Each PRD maps to specific user stories (US 1-30), includes complete acceptance criteria, functional/non-functional requirements, and clear scope boundaries
- Ready for parallel development - all 18 features can be implemented independently with clear integration boundaries

### Implementation plans and prompt template creation (September 29, 2025)
- ✅ **Implementation plans completed** for all 18 features with comprehensive technical specifications
- ✅ **Prompt template created** at `.github/prompts/breakdown-feature-implementation.prompt.md`:
  - Standardized prompt for generating consistent implementation plans
  - Includes system architecture, database design, API specifications, frontend patterns
  - Security, performance, and deployment guidelines integrated
  - Template ensures consistency across all feature implementations
- Location: Implementation plans at `docs/ways-of-work/plan/{epic-name}/{feature-name}/implementation-plan.md`
- **7,601+ lines of technical documentation** committed with actionable development specifications

## �📝 **DOCUMENTATION ENFORCEMENT (Detailed Checklist)**

**This section provides the detailed checklist referenced in the mandatory protocol at the top of this file.**

### **Detailed Steps for Documentation Updates:**

**1. Update copilot-instructions.md (THIS FILE):**
   - [ ] Update "Current Architecture Status" section (around line 200)
   - [ ] Add/modify relevant code patterns and examples
   - [ ] Update "Directory Structure" if files were added/moved
   - [ ] Update component patterns if new patterns introduced
   - [ ] Add new development guidelines if applicable
   - [ ] Update performance patterns if optimizations added
   - [ ] Update hook patterns if new hooks created

**2. Update DEVELOPMENT.md:**
   - [ ] Mark completed steps with ✅ **COMPLETE** status  
   - [ ] Update current phase/step status section
   - [ ] Add new architectural decisions to the log
   - [ ] Update timeline estimates and next steps
   - [ ] Document any breaking changes or migration steps
   - [ ] Update file structure documentation
   - [ ] Add new features to the feature summary

**3. Check for Outdated Instructions:**
   - [ ] Search for old patterns that conflict with new changes
   - [ ] Remove or update deprecated examples in both files
   - [ ] Verify all code examples still compile and work
   - [ ] Update import statements and API references
   - [ ] Check for inconsistent architecture descriptions

**4. Validation:**
   - [ ] Ensure new contributors could follow the updated docs
   - [ ] Test that documented examples actually work
   - [ ] Verify docs reflect actual codebase state
   - [ ] Check that patterns are consistently described

**🎯 Remember: Documentation updates are NOT optional - they're part of the development process!**

---

## 🎪 **TEMPLATE: Completion Message for Any Architectural Change**

**Copy this template for use when completing any work that affects architecture:**

```
## ✅ [Feature/Step Name] - IMPLEMENTATION COMPLETE

### 📊 **Changes Made**
- [List files created/modified]
- [List architectural patterns introduced/changed]
- [List performance impacts]

### 📋 **Documentation Updates Completed**
✅ **copilot-instructions.md Updated:**
- [ ] Current Architecture Status section updated
- [ ] New patterns/examples added
- [ ] File structure updated
- [ ] Development guidelines enhanced

✅ **DEVELOPMENT.md Updated:**  
- [ ] Step marked as ✅ COMPLETE
- [ ] Current status updated
- [ ] New architectural decisions documented
- [ ] Timeline/next steps updated

✅ **Validation Completed:**
- [ ] Code examples tested and working
- [ ] Documentation reflects actual implementation
- [ ] No conflicting patterns remain
- [ ] New contributors can follow updated docs

### 🎯 **Ready for Next Steps**
[Describe what's now possible/what should be done next]

**All documentation requirements satisfied - implementation truly complete!** 🚀
```

Use this template to ensure consistent, complete documentation with every change.
   - [ ] Update dependency information if needed

---

## Commit Message Guidelines

**Do NOT include tool references (e.g., #get_changed_files) in commit messages.**
Commit messages should be clear, concise, and describe the change in natural language only.

Example:
```
feat: init commit

Initial commit. Project setup for Mafia Game Role Allocator. Includes PRD.md, DEVELOPMENT.md, README.md, and copilot-instructions.md.
```

### Documentation Review Triggers:
- ✅ **After completing any refactoring step**
- ✅ **When changing component architecture** 
- ✅ **When adding new patterns or conventions**
- ✅ **When major file structure changes**
- ✅ **Before marking any phase as complete**
 - ✅ When adding automation/workflows that impact planning or issue creation

## Tech & Tooling Requirements
- React 18 (functional components + Hooks)
- Vite (Node.js 20, npm)
- JavaScript only (no TypeScript)
- Tailwind CSS v3.4.17 strictly (do not upgrade to v4)
- State: useState/useReducer for in-memory session state
- No external tracking/analytics; no backend calls; no persistent storage

Tailwind guidance:
- Keep CSS minimal; prefer utilities
- Avoid global selectors that can degrade mobile button UI (e.g., `* {}`)
- Ensure viewport meta and touch-friendly sizes

Performance budgets (PRD):
- Load < 2s on mobile
- Interaction latency (buttons, reveal) < 200ms
- JS bundle < 500KB

---


## Product Behavior Requirements (enforce in code)
Input & Validation
- Dynamic name fields follow player count changes; deleting fields drops values
- Disallow submission with any blank name
- Allow duplicate names
- Block invalid mafia counts (mafia >= players); show error/confirmation

Role Allocation
- "Allocate Roles" triggers confirmation before shuffling
- Assign exactly `mafiaCount` Mafia; others Villagers
- Re-click reshuffles all roles (no previous allocation preserved)

Role Display & Reveal
- Show vertical list of cards
- Only one reveal dialog open at a time
- Enforce strict reveal order; show current player cue at top at all times
- "Reveal Role" → show role → button changes to "Close"
- Role remains visible after reveal (no hide)

Reset / Re-Allocate
- Show Reset button after allocation
- Reset returns to input screen, keeps names prefilled, clears allocations

Edge Cases & UX
- Allow mafia = 0 or mafia = players (warn/confirm)
- Double-taps on buttons must be idempotent (debounce/guards)
- Reset allowed during reveal; clears allocations and returns to input with names kept

---

## Coding Guidelines
- Use controlled inputs for all fields
- Confirmations: native confirm() or a simple modal; block actions until confirmed
- Idempotency: guard against rapid double-clicks (disable button while processing)
- Dialog accessibility: focus trap, Escape to close, return focus to trigger
- Mobile touch targets: 44px minimum touch area for buttons
- Keep state in memory only; never write to localStorage or network

Randomization
- Use Fisher–Yates shuffle; avoid biased shuffles
- Derive role list (mafiaCount true flags + villagers) and shuffle assignments

Testing (minimum)
- Happy path: 8 players, 2 mafia → allocate → reveal sequentially → reset
- Edge: mafia = 0 and mafia = players (confirm and proceed)
- Validation: blank names blocked; mafia >= players blocked
- Re-allocation: roles reshuffle when clicked again
- Double-tap: reveal/close/allocate/reset remains consistent
- Performance: quick load and responsive taps on mobile

---

## Acceptance Criteria Mapping (Quick Reference)
- Inputs: dynamic fields; blank names blocked; duplicates allowed; mafia < players
- Allocation: confirmation; correct counts; reshuffle on repeat
- Reveal: single dialog; strict order; current player cue; role persists
- Reset: returns to inputs; names retained; allocations cleared
- Performance: load < 2s; interactions < 200ms; bundle < 500KB

---

## Non-Goals (Must Not Implement)
- Advanced roles (Doctor, Detective, etc.)
- Chat, timers, voting, or scoring mechanics
- Persistence (localStorage, backend), analytics, or user accounts
- Heavy UI libraries or complex styling systems

---

## Quick Start (for contributors)
- Install Node.js 20; npm install
- Run dev server; open on mobile viewport; verify flows against Acceptance Criteria
- If you change behavior, update PRD.md and this file accordingly

## Project Automation (Actions)
- Workflow: `.github/workflows/create-feature-issues.yml`
- Purpose: Automate creation of Feature issues (and optional child issues) with labels and documentation links.
- Inputs (current simplified workflow):
   - `feature_name` (required)
   - `epic_issue` (required): Epic issue number to inherit milestone from
   - `docs_path` (optional): Path to docs folder for this feature, e.g. `docs/ways-of-work/plan/<epic>/<feature>`
- Behavior:
   - Creates a single Feature issue titled `Feature: <feature_name>`.
   - Attempts to inherit the Epic's milestone if `epic_issue` is valid.
   - If `docs_path` is provided, auto-inserts a Docs section with links to:
      - PRD.md, implementation-plan.md, project-plan.md, issues-checklist.md
      - Matching is case-insensitive; if a file is missing, the issue notes that it was not found.
- Output: Created Feature issue (with optional Docs links). Previously present Epic/child issue linking has been simplified per current workflow.

## Prompt Library (for planning and issues)
- `.github/prompts/breakdown-feature-implementation.prompt.md` — Generate detailed technical implementation plans
- `.github/prompts/breakdown-plan.prompt.md` — Produce project plans and issue checklists
- `.github/prompts/generate-issue-bodies.prompt.md` — Generate paste-ready Epic/Feature GitHub issue bodies from a single planning doc
   - Input: `file_path` to `epic.md` or `PRD.md`
   - Behavior: Auto-detects Epic vs Feature; scans the same directory for sibling docs (PRD.md, implementation-plan.md, project-plan.md, issues-checklist.md) case-insensitively
   - Output: Strictly formatted Markdown per templates; references include repo-relative paths or "not found in <dir>" when missing
