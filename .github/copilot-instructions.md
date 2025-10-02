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
**Follow the simplified component pattern established by PlayerCountManager:**

```jsx
// Custom hook pattern for state management
export const useCustomHook = (initialParam = defaultValue) => {
  const [state, setState] = useState(initialParam);
  
  const updateFunction = useCallback((newValue) => {
    // Validation and transformation logic
    const validValue = Math.max(min, Math.min(max, parseInt(newValue) || defaultValue));
    setState(validValue);
  }, []);
  
  const validation = useMemo(() => {
    // Compute validation state
    return { isValid: someCondition, errors: {} };
  }, [state]);
  
  return { state, updateFunction, validation };
};

// Component pattern with prop communication
const FeatureComponent = ({ onStateChange, onValidationChange }) => {
  const { state, updateFunction, validation } = useCustomHook();
  
  // Notify parent of changes
  React.useEffect(() => {
    onStateChange?.(state);
  }, [state, onStateChange]);
  
  React.useEffect(() => {
    onValidationChange?.(validation);
  }, [validation, onValidationChange]);
  
  return (
    <div className="space-y-6">
      {/* Form sections with proper labeling */}
    </div>
  );
};
```

### **Confirmation Flow Pattern (AllocationConfirmationFlow)**
**Follow this pattern for confirmation dialogs with destructive or critical actions:**
**Supports both initial actions and re-actions with dynamic UI adaptation:**

```jsx
// Unified confirmation flow component for initial and re-actions
const ConfirmationFlow = ({ 
  onAction, 
  isFormValid, 
  actionData,
  hasExistingState = false,  // For re-actions
  currentState = null         // Current state info
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Memoized calculations for display
  const actionDetails = useMemo(() => ({
    // Calculate display parameters
    isEdgeCase: /* edge case detection logic */,
  }), [actionData]);

  // Handle action trigger with validation
  const handleActionClick = useCallback(() => {
    if (!isFormValid || isProcessing) return;
    setShowConfirmation(true);
  }, [isFormValid, isProcessing]);

  // Handle confirmation with async processing
  const handleConfirm = useCallback(async () => {
    setIsProcessing(true);
    try {
      await onAction({
        ...actionData,
        isReAction: hasExistingState  // Flag for re-actions
      });
      setShowConfirmation(false);
    } catch (error) {
      console.error('Action failed:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [onAction, actionData, hasExistingState]);

  // Keyboard accessibility (Escape key)
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && showConfirmation && !isProcessing) {
        setShowConfirmation(false);
      }
    };
    if (showConfirmation) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmation, isProcessing]);

  return (
    <>
      {/* Action Button - Always visible with dynamic styling */}
      <button
        onClick={handleActionClick}
        disabled={!isFormValid || isProcessing}
        className={`
          w-full h-14 touch-manipulation transition-all duration-200
          ${isFormValid && !isProcessing
            ? hasExistingState
              ? 'bg-orange-600 hover:bg-orange-700 text-white'  // Re-action
              : 'bg-blue-600 hover:bg-blue-700 text-white'      // Initial action
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
        `}
      >
        {isProcessing 
          ? (hasExistingState ? 'Re-processing...' : 'Processing...') 
          : (hasExistingState ? 'Re-Action Name' : 'Action Name')}
      </button>

      {/* Portal-based Modal with dynamic content */}
      {showConfirmation && createPortal(
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog" aria-modal="true"
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            {/* Dynamic Header */}
            {hasExistingState ? (
              <>
                <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  {/* Refresh icon */}
                </div>
                <h3>Re-Action Name?</h3>
                <p>This will create new state...</p>
              </>
            ) : (
              <>
                <h3>Confirm Action</h3>
                <p>Ready to proceed?</p>
              </>
            )}
            
            {/* Warning for re-actions */}
            {hasExistingState && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                <h4>Current state will be lost</h4>
                <ul>
                  <li>• All current state will be cleared</li>
                  <li>• Configuration will be kept</li>
                  <li>• New state will be generated</li>
                </ul>
              </div>
            )}
            
            {/* Action details, buttons */}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
```

**Re-allocation Pattern Key Points:**
- Same component used for both initial and re-actions
- `hasExistingState` prop triggers re-action UI (orange theme, warning)
- `isReAction` flag passed to handler for proper state cleanup
- Always available button (not hidden after first action)
- **Dynamic button text**: "Allocate Roles" (initial) vs "Re-allocate Roles" (re-action)
- **Dynamic button colors**: Blue (`bg-blue-600`) for initial allocation, Orange (`bg-orange-600`) for re-allocation
- **Processing states**: "Allocating..." vs "Re-allocating..." with matching color themes
- Orange color signals significant/destructive action and matches modal warning theme

### **Role Reveal Dialog Pattern (RoleRevealDialog)**
**Follow this pattern for modal dialogs with two-step reveal flow and role-specific styling:**

```jsx
// Role reveal dialog with portal-based modal and two-step flow
const RoleRevealDialog = ({
  isOpen,
  player,
  onClose,
  onRevealComplete
}) => {
  const [isRoleRevealed, setIsRoleRevealed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const revealButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Reset reveal state when dialog opens with new player
  useEffect(() => {
    if (isOpen && player) {
      setIsRoleRevealed(player.revealed || false);
      setIsClosing(false);
    }
  }, [isOpen, player]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const elementToFocus = isRoleRevealed ? closeButtonRef.current : revealButtonRef.current;
      elementToFocus?.focus();
    }
  }, [isOpen, isRoleRevealed]);

  // Background scroll prevention only (Escape key deliberately ignored for privacy)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle dialog close (called only by buttons)
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 150);
  }, [onClose]);

  if (!isOpen || !player) return null;

  const isMafia = player.role === ROLES.MAFIA;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50
        transition-opacity duration-150 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog" aria-modal="true"
      // Overlay clicks intentionally do nothing; dialog closes via buttons only
    >
      <div ref={dialogRef} className={`bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl
        transform transition-all duration-150 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{player.name}</h2>
          <p className="text-gray-600">
            {isRoleRevealed ? 'Your role:' : 'Ready to see your role?'}
          </p>
        </div>

        <div className="mb-8">
          {isRoleRevealed ? (
            <div className={`text-center p-8 rounded-xl border-4
              ${isMafia ? 'bg-red-50 border-red-500 text-red-900' : 'bg-green-50 border-green-500 text-green-900'}`}>
              <div className="mb-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center
                  ${isMafia ? 'bg-red-600' : 'bg-green-600'}`}>
                  {/* Role icon SVG */}
                </div>
              </div>
              <h3 className={`text-4xl font-bold mb-2 ${isMafia ? 'text-red-700' : 'text-green-700'}`}>
                {player.role}
              </h3>
              <p className={`text-sm font-medium ${isMafia ? 'text-red-600' : 'text-green-600'}`}>
                {isMafia ? 'Work with other Mafia players to eliminate Villagers' 
                         : 'Work with other Villagers to identify the Mafia'}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                {/* Question icon */}
              </div>
              <button
                ref={revealButtonRef}
                onClick={() => { setIsRoleRevealed(true); onRevealComplete?.(); }}
                className="w-full h-14 px-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 
                  text-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200
                  transition-all duration-200 touch-manipulation"
              >
                Reveal Role
              </button>
            </div>
          )}
        </div>

        {isRoleRevealed && (
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="w-full h-12 px-6 text-base font-medium bg-gray-200 hover:bg-gray-300 
              text-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-200
              transition-all duration-200 touch-manipulation"
          >
            Close
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};
```

**Role Reveal Dialog Pattern Key Points:**
- Portal-based rendering to document.body for proper z-index stacking
- Two-step flow: "Reveal Role" button → Role display → "Close" button
- Role-specific styling (red for Mafia, green for Villager)
- Focus management with auto-focus on appropriate button
- Focus trap for accessibility (Tab/Shift+Tab cycling)
- Escape key is ignored; dialog remains open until an action button is pressed (ensures privacy)
- Background scroll prevention when open
- Smooth fade/scale animations (150ms duration)
- Touch-optimized buttons (56px Reveal, 48px Close)
- Overlay clicks are inert; only in-dialog buttons can dismiss it (prevents accidental closure)
- State reset on player change

### **Card List Interface Pattern (CardListInterface)**
**Follow this pattern for mobile-first list interfaces with state management and sequential interactions:**

```jsx
// Card list component with state-driven rendering
const CardListInterface = ({
  assignment,
  currentPlayerIndex,
  onPlayerReveal,
  revealInProgress = false
}) => {
  // Memoized state calculations for performance
  const cardStates = useMemo(() => {
    if (!assignment?.players) return [];
    
    return assignment.players.map((player, index) => {
      const isRevealed = player.revealed;
      const isCurrent = index === currentPlayerIndex;
      const canReveal = isCurrent && !isRevealed && !revealInProgress;
      
      return {
        ...player,
        isRevealed,
        isCurrent,
        canReveal,
        cardState: isRevealed ? 'revealed' : 
                  isCurrent ? 'current' : 'waiting'
      };
    });
  }, [assignment, currentPlayerIndex, revealInProgress]);

  // Progress tracking
  const progress = useMemo(() => {
    const completed = cardStates.filter(card => card.isRevealed).length;
    const total = cardStates.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }, [cardStates]);

  // Touch-optimized interaction handler
  const handleCardClick = useCallback((player, cardState) => {
    if (!cardState.canReveal) return;
    onPlayerReveal?.({ playerName: player.name, playerIndex: player.index });
  }, [onPlayerReveal]);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Player Roles</h2>
          <div className="text-sm text-gray-600">{progress.completed} of {progress.total} revealed</div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Card List */}
      <div className="space-y-3">
        {cardStates.map((cardState, index) => (
          <div
            key={cardState.id}
            onClick={() => handleCardClick(cardState, cardState)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              touch-manipulation cursor-pointer min-h-[72px] flex items-center
              ${cardState.cardState === 'current' && cardState.canReveal
                ? 'border-blue-500 bg-blue-50 shadow-lg hover:shadow-xl'
                : cardState.cardState === 'revealed'
                ? cardState.role === ROLES.MAFIA
                  ? 'border-red-500 bg-red-50'
                  : 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
              }
            `}
            role="button"
            tabIndex={cardState.canReveal ? 0 : -1}
            aria-label={`${cardState.name}: ${cardState.isRevealed ? cardState.role + ' (revealed)' : cardState.isCurrent ? 'Tap to reveal role' : 'Waiting to reveal'}`}
          >
            {/* Player number, name, role badge, status text */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **Reset Button System Pattern (ResetButtonSystem)**
**Follow this pattern for reset/destructive actions with confirmation dialogs and state preservation:**

```jsx
// Reset button component with confirmation dialog
const ResetButtonSystem = ({
  hasActiveGame,
  currentAssignment,
  onReset,
  disabled = false
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Calculate reset state information
  const revealedCount = currentAssignment?.players?.filter(p => p.revealed).length || 0;
  const totalPlayers = currentAssignment?.players?.length || 0;
  const hasRevealedRoles = revealedCount > 0;

  // Handle reset button click
  const handleResetClick = useCallback(() => {
    if (disabled || isResetting) return;
    setShowConfirmation(true);
  }, [disabled, isResetting]);

  // Handle confirmation
  const handleConfirm = useCallback(async () => {
    setIsResetting(true);
    try {
      await onReset();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  }, [onReset]);

  // Handle cancellation
  const handleCancel = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showConfirmation && !isResetting) {
        handleCancel();
      }
    };

    if (showConfirmation) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmation, isResetting, handleCancel]);

  // Focus management
  useEffect(() => {
    if (showConfirmation && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [showConfirmation]);

  return (
    <>
      {/* Reset Button */}
      <button
        type="button"
        onClick={handleResetClick}
        disabled={disabled || isResetting}
        className="w-full h-12 px-4 text-white bg-gray-600 hover:bg-gray-700"
        aria-label="Reset game and return to input screen"
      >
        Reset Game
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            {/* Warning icon and header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                {/* Warning icon */}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Game?</h3>
              <p className="text-gray-600">This will clear all game progress...</p>
            </div>

            {/* Warning Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-red-800 mb-2">This action will clear:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• All current role assignments</li>
                {hasRevealedRoles && <li>• All revealed roles ({revealedCount} of {totalPlayers})</li>}
                <li>• Current game progress and state</li>
              </ul>
              <p className="text-sm text-red-700 mt-3 font-medium">
                ✓ Player names will be kept for easy re-setup.
              </p>
            </div>

            {/* Current Game Summary */}
            {currentAssignment && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Game:</h4>
                {/* Game stats display */}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button ref={cancelButtonRef} onClick={handleCancel} disabled={isResetting}
                      className="flex-1 h-12 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300">
                Keep Playing
              </button>
              <button ref={confirmButtonRef} onClick={handleConfirm} disabled={isResetting}
                      className="flex-1 h-12 px-4 text-white bg-red-600 hover:bg-red-700">
                {isResetting ? 'Resetting...' : 'Reset Game'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
```

**Reset Button System Pattern Key Points:**
- Portal-based modal for confirmation dialog
- Clear warning about what will be cleared vs. preserved
- Two-button choice: "Keep Playing" (cancel) or "Reset Game" (confirm)
- Focus management (auto-focus on cancel button for safety)
- Escape key dismisses confirmation
- Background scroll prevention when modal open
- Async reset handler with loading state
- Shows current game statistics before reset
- Conditional revealed roles warning when applicable
- Touch-optimized buttons (48px height minimum)
- Proper disabled states during reset operation

### **Edge Case Validation Pattern (ValidationUtility)**
**Follow this pattern for comprehensive input validation with edge case handling:**

```javascript
// Import centralized validation utility
import { 
  validateMafiaCount, 
  formatValidationMessages,
  VALIDATION_SEVERITY,
  EDGE_CASE_TYPES 
} from '../utils/edgeCaseValidation';

// Hook pattern for validation state management
export const useValidation = (value, totalPlayers) => {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Memoized validation with edge case detection
  const validation = useMemo(() => {
    return validateMafiaCount(value, totalPlayers);
  }, [value, totalPlayers]);
  
  // Determine UI state
  const shouldShowError = hasUserInteracted && !validation.isValid;
  const shouldShowWarning = validation.isEdgeCase && validation.warning;
  const canProceed = validation.canProceed;
  
  return { validation, shouldShowError, shouldShowWarning, canProceed };
};

// Component pattern with visual feedback
const ValidatorComponent = ({ value, totalPlayers, onChange, onValidationChange }) => {
  const { validation, shouldShowError, shouldShowWarning } = useValidation(value, totalPlayers);
  
  // Notify parent of validation state changes
  React.useEffect(() => {
    onValidationChange?.(validation);
  }, [validation, onValidationChange]);
  
  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        className={`
          ${shouldShowError ? 'border-red-300 focus:border-red-500' : ''}
          ${shouldShowWarning ? 'border-yellow-300 focus:border-yellow-500' : ''}
          ${!shouldShowError && !shouldShowWarning ? 'border-gray-300 focus:border-blue-500' : ''}
        `}
        aria-describedby={shouldShowError ? 'error-id' : shouldShowWarning ? 'warning-id' : undefined}
      />
      
      {/* Error Messages - Red */}
      {shouldShowError && (
        <p id="error-id" className="text-sm text-red-600" role="alert">
          {validation.message}
        </p>
      )}
      
      {/* Warning Messages - Yellow */}
      {shouldShowWarning && (
        <p id="warning-id" className="text-sm text-yellow-600" role="alert">
          <span className="inline-flex items-center">
            <WarningIcon />
            {validation.warning}
          </span>
        </p>
      )}
    </div>
  );
};
```

**Edge Case Validation Pattern Key Points:**
- Centralized validation logic in `src/utils/edgeCaseValidation.js`
- Three severity levels: ERROR (blocks), WARNING (requires confirmation), INFO (informational)
- Edge case types: NO_MAFIA (0), ALMOST_ALL_MAFIA (total-1), LARGE_GROUP (>30), SMALL_GROUP (<3)
- Clear distinction between invalid (blocks allocation) and edge cases (allows with warning)
- Visual feedback: Red for errors, yellow for warnings, blue/green for valid states
- User-friendly messages with icons, explanations, and gameplay impact
- ARIA compliance with role="alert" and proper aria-describedby associations
- Memoized validation prevents unnecessary recalculations
- Parent notification via callback props for state coordination
- Validation result structure includes: `isValid`, `severity`, `type`, `message`, `explanation`, `canProceed`, `requiresConfirmation`, `isEdgeCase`

**Validation Utility Functions:**
- `validateMafiaCount(mafiaCount, totalPlayers)` - Core validation logic
- `detectEdgeCase(mafiaCount, totalPlayers)` - Edge case detection
- `formatValidationMessages(validation)` - UI-friendly message formatting
- `validateGameConfiguration(playerNames, mafiaCount)` - Complete validation including names

**Example Edge Cases:**
```javascript
// 0 Mafia - Allowed with warning
validateMafiaCount(0, 5)
// { isValid: true, isEdgeCase: true, warning: 'No Mafia players...', requiresConfirmation: true }

// Almost all Mafia - Allowed with warning
validateMafiaCount(4, 5) 
// { isValid: true, isEdgeCase: true, warning: 'Almost all players are Mafia...', requiresConfirmation: true }

// All Mafia - Blocked as error
validateMafiaCount(5, 5)
// { isValid: false, error: 'Mafia count must be less than total players (5)', canProceed: false }

// Too many Mafia - Blocked as error
validateMafiaCount(6, 5)
// { isValid: false, error: 'Mafia count cannot exceed total players', canProceed: false }
```

### **Sticky Positioning Pattern (Mobile Layout Optimization)**
**Follow this pattern for keeping important UI elements visible during scrolling:**

```jsx
// Sticky current player indicator in CardListInterface
const CardListInterface = ({ assignment, currentPlayerIndex, onPlayerReveal, revealInProgress }) => {
  // ... state and calculations ...
  
  return (
    <div className="space-y-6">
      {/* Header with Progress (scrolls normally) */}
      <div className="space-y-4">
        <h2>Player Roles</h2>
        {/* Progress bar */}
      </div>
      
      {/* Sticky Current Player Cue - Always visible at top */}
      {currentPlayerIndex < cardStates.length && progress.completed < progress.total && (
        <div 
          className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-blue-50 border-2 border-blue-500 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0 animate-pulse" />
              <div className="min-w-0 flex-1">
                <span className="text-base font-bold text-blue-900 block truncate">
                  Next: {cardStates[currentPlayerIndex].name}
                </span>
                <p className="text-xs text-blue-700 mt-0.5 truncate">
                  Tap card below to reveal role
                </p>
              </div>
            </div>
            <div className="text-sm font-medium text-blue-700 bg-blue-100 rounded-full px-3 py-1 ml-3 flex-shrink-0">
              {currentPlayerIndex + 1} of {cardStates.length}
            </div>
          </div>
        </div>
      )}
      
      {/* Scrollable content below */}
      <div className="space-y-3">
        {/* Player cards */}
      </div>
    </div>
  );
};
```

**Sticky Positioning Pattern Key Points:**
- Use `sticky top-0` for positioning at top during scroll
- Add `z-10` or higher for proper layering above content
- Use `-mx-4 px-4` to extend to container edges (compensates for parent padding)
- Add `backdrop-blur-sm bg-opacity-95` for visibility over scrolling content
- Enhance with `shadow-lg` for depth perception and visual separation
- Use `truncate` on text elements to handle overflow gracefully
- Apply `min-w-0 flex-1` for proper flex text truncation
- Keep `flex-shrink-0` on icons and badges to prevent squishing
- Maintain ARIA live regions for accessibility announcements
- Works automatically across all mobile viewport sizes (320px-768px+)

**Safe Area Inset Support:**
Tailwind configuration enables notch/home indicator handling:
```javascript
// tailwind.config.js
theme: {
  extend: {
    spacing: {
      'safe-top': 'env(safe-area-inset-top)',
      'safe-bottom': 'env(safe-area-inset-bottom)',
      'safe-left': 'env(safe-area-inset-left)',
      'safe-right': 'env(safe-area-inset-right)',
    },
  },
}
```
Usage: `pt-safe-top`, `pb-safe-bottom`, etc. for proper padding on notched devices.

### **Touch-Optimized Counter Control Pattern**
**Follow this pattern for numeric input controls with touch optimization:**

```jsx
// Custom hook for counter state management with boundary validation
export const useCounterControl = (value, min, max, onChange) => {
  const canIncrement = useMemo(() => value < max, [value, max]);
  const canDecrement = useMemo(() => value > min, [value, min]);

  const increment = useCallback(() => {
    if (canIncrement && onChange) onChange(value + 1);
  }, [value, canIncrement, onChange]);

  const decrement = useCallback(() => {
    if (canDecrement && onChange) onChange(value - 1);
  }, [value, canDecrement, onChange]);

  const handleKeyDown = useCallback((event) => {
    switch (event.key) {
      case 'ArrowUp': event.preventDefault(); increment(); break;
      case 'ArrowDown': event.preventDefault(); decrement(); break;
    }
  }, [increment, decrement]);

  return { increment, decrement, canIncrement, canDecrement, handleKeyDown };
};

// Touch-optimized counter component with horizontal layout
const CounterControl = React.memo(({ value, min, max, onChange, label, disabled = false }) => {
  const { increment, decrement, canIncrement, canDecrement, handleKeyDown } = 
    useCounterControl(value, min, max, onChange);

  return (
    <div className="flex flex-row items-center space-x-1" role="group" aria-label={label}>
      {/* Decrement Button (←) */}
      <button
        type="button"
        onClick={decrement}
        disabled={disabled || !canDecrement}
        className={`
          min-h-[44px] min-w-[44px] flex items-center justify-center
          border-2 rounded-lg touch-manipulation font-bold text-lg
          transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled || !canDecrement 
            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100'
          }
        `}
        aria-label={`Decrease ${label}`}
      >
        ←
      </button>

      {/* Value Display */}
      <div
        className="min-h-[44px] min-w-[44px] flex items-center justify-center
                   border-2 rounded-lg text-lg font-medium bg-gray-50 border-gray-200"
        tabIndex="0" role="spinbutton"
        aria-valuemin={min} aria-valuemax={max} aria-valuenow={value}
        aria-label={`${label}: ${value}`}
        onKeyDown={handleKeyDown}
      >
        {value}
      </div>

      {/* Increment Button (→) */}
      <button
        type="button"
        onClick={increment}
        disabled={disabled || !canIncrement}
        className={`
          min-h-[44px] min-w-[44px] flex items-center justify-center
          border-2 rounded-lg touch-manipulation font-bold text-lg
          transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-blue-500
          ${disabled || !canIncrement
            ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100'
          }
        `}
        aria-label={`Increase ${label}`}
      >
        →
      </button>
    </div>
  );
});
```

**Touch-Optimized Counter Control Pattern Key Points:**
- 44px+ touch targets meeting accessibility guidelines with immediate visual feedback
- Horizontal layout (← N →) for intuitive left-to-right interaction pattern
- Boundary enforcement with automatic button disabling at min/max values
- Full ARIA support with role="spinbutton", keyboard navigation via arrow keys
- React.memo optimization for efficient re-rendering with memoized callbacks
- Integration pattern preserves existing validation logic and state management
- Seamless Tailwind CSS integration with consistent design system patterns
- Touch-manipulation CSS for optimized mobile interactions and debouncing
- Reusable component architecture for future numeric input requirements

**Re-allocation Pattern Key Points:**
- Same component used for both initial and re-actions
- `hasExistingState` prop triggers re-action UI (orange theme, warning)
- `isReAction` flag passed to handler for proper state cleanup
- Always available button (not hidden after first action)
- **Dynamic button text**: "Allocate Roles" (initial) vs "Re-allocate Roles" (re-action)
- **Dynamic button colors**: Blue (`bg-blue-600`) for initial allocation, Orange (`bg-orange-600`) for re-allocation
- **Processing states**: "Allocating..." vs "Re-allocating..." with matching color themes
- Orange color signals significant/destructive action and matches modal warning theme

### **Role Reveal Dialog Pattern (RoleRevealDialog)**
**Follow this pattern for modal dialogs with two-step reveal flow and role-specific styling:**

```jsx
// Role reveal dialog with portal-based modal and two-step flow
const RoleRevealDialog = ({
  isOpen,
  player,
  onClose,
  onRevealComplete
}) => {
  const [isRoleRevealed, setIsRoleRevealed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const revealButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Reset reveal state when dialog opens with new player
  useEffect(() => {
    if (isOpen && player) {
      setIsRoleRevealed(player.revealed || false);
      setIsClosing(false);
    }
  }, [isOpen, player]);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      const elementToFocus = isRoleRevealed ? closeButtonRef.current : revealButtonRef.current;
      elementToFocus?.focus();
    }
  }, [isOpen, isRoleRevealed]);

  // Background scroll prevention only (Escape key deliberately ignored for privacy)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Handle dialog close (called only by buttons)
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 150);
  }, [onClose]);

  if (!isOpen || !player) return null;

  const isMafia = player.role === ROLES.MAFIA;

  return createPortal(
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50
        transition-opacity duration-150 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
      role="dialog" aria-modal="true"
      // Overlay clicks intentionally do nothing; dialog closes via buttons only
    >
      <div ref={dialogRef} className={`bg-white rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl
        transform transition-all duration-150 ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{player.name}</h2>
          <p className="text-gray-600">
            {isRoleRevealed ? 'Your role:' : 'Ready to see your role?'}
          </p>
        </div>

        <div className="mb-8">
          {isRoleRevealed ? (
            <div className={`text-center p-8 rounded-xl border-4
              ${isMafia ? 'bg-red-50 border-red-500 text-red-900' : 'bg-green-50 border-green-500 text-green-900'}`}>
              <div className="mb-4">
                <div className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center
                  ${isMafia ? 'bg-red-600' : 'bg-green-600'}`}>
                  {/* Role icon SVG */}
                </div>
              </div>
              <h3 className={`text-4xl font-bold mb-2 ${isMafia ? 'text-red-700' : 'text-green-700'}`}>
                {player.role}
              </h3>
              <p className={`text-sm font-medium ${isMafia ? 'text-red-600' : 'text-green-600'}`}>
                {isMafia ? 'Work with other Mafia players to eliminate Villagers' 
                         : 'Work with other Villagers to identify the Mafia'}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                {/* Question icon */}
              </div>
              <button
                ref={revealButtonRef}
                onClick={() => { setIsRoleRevealed(true); onRevealComplete?.(); }}
                className="w-full h-14 px-6 text-lg font-semibold bg-blue-600 hover:bg-blue-700 
                  text-white rounded-xl shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-200
                  transition-all duration-200 touch-manipulation"
              >
                Reveal Role
              </button>
            </div>
          )}
        </div>

        {isRoleRevealed && (
          <button
            ref={closeButtonRef}
            onClick={handleClose}
            className="w-full h-12 px-6 text-base font-medium bg-gray-200 hover:bg-gray-300 
              text-gray-700 rounded-lg focus:outline-none focus:ring-4 focus:ring-gray-200
              transition-all duration-200 touch-manipulation"
          >
            Close
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};
```

**Role Reveal Dialog Pattern Key Points:**
- Portal-based rendering to document.body for proper z-index stacking
- Two-step flow: "Reveal Role" button → Role display → "Close" button
- Role-specific styling (red for Mafia, green for Villager)
- Focus management with auto-focus on appropriate button
- Focus trap for accessibility (Tab/Shift+Tab cycling)
- Escape key is ignored; dialog remains open until an action button is pressed (ensures privacy)
- Background scroll prevention when open
- Smooth fade/scale animations (150ms duration)
- Touch-optimized buttons (56px Reveal, 48px Close)
- Overlay clicks are inert; only in-dialog buttons can dismiss it (prevents accidental closure)
- State reset on player change

### **Card List Interface Pattern (CardListInterface)**
**Follow this pattern for mobile-first list interfaces with state management and sequential interactions:**

```jsx
// Card list component with state-driven rendering
const CardListInterface = ({
  assignment,
  currentPlayerIndex,
  onPlayerReveal,
  revealInProgress = false
}) => {
  // Memoized state calculations for performance
  const cardStates = useMemo(() => {
    if (!assignment?.players) return [];
    
    return assignment.players.map((player, index) => {
      const isRevealed = player.revealed;
      const isCurrent = index === currentPlayerIndex;
      const canReveal = isCurrent && !isRevealed && !revealInProgress;
      
      return {
        ...player,
        isRevealed,
        isCurrent,
        canReveal,
        cardState: isRevealed ? 'revealed' : 
                  isCurrent ? 'current' : 'waiting'
      };
    });
  }, [assignment, currentPlayerIndex, revealInProgress]);

  // Progress tracking
  const progress = useMemo(() => {
    const completed = cardStates.filter(card => card.isRevealed).length;
    const total = cardStates.length;
    return { completed, total, percentage: total > 0 ? (completed / total) * 100 : 0 };
  }, [cardStates]);

  // Touch-optimized interaction handler
  const handleCardClick = useCallback((player, cardState) => {
    if (!cardState.canReveal) return;
    onPlayerReveal?.({ playerName: player.name, playerIndex: player.index });
  }, [onPlayerReveal]);

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Player Roles</h2>
          <div className="text-sm text-gray-600">{progress.completed} of {progress.total} revealed</div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>

      {/* Card List */}
      <div className="space-y-3">
        {cardStates.map((cardState, index) => (
          <div
            key={cardState.id}
            onClick={() => handleCardClick(cardState, cardState)}
            className={`
              relative p-4 rounded-xl border-2 transition-all duration-200
              touch-manipulation cursor-pointer min-h-[72px] flex items-center
              ${cardState.cardState === 'current' && cardState.canReveal
                ? 'border-blue-500 bg-blue-50 shadow-lg hover:shadow-xl'
                : cardState.cardState === 'revealed'
                ? cardState.role === ROLES.MAFIA
                  ? 'border-red-500 bg-red-50'
                  : 'border-green-500 bg-green-50'
                : 'border-gray-200 bg-white'
              }
            `}
            role="button"
            tabIndex={cardState.canReveal ? 0 : -1}
            aria-label={`${cardState.name}: ${cardState.isRevealed ? cardState.role + ' (revealed)' : cardState.isCurrent ? 'Tap to reveal role' : 'Waiting to reveal'}`}
          >
            {/* Player number, name, role badge, status text */}
          </div>
        ))}
      </div>
    </div>
  );
};
```

### **Reset Button System Pattern (ResetButtonSystem)**
**Follow this pattern for reset/destructive actions with confirmation dialogs and state preservation:**

```jsx
// Reset button component with confirmation dialog
const ResetButtonSystem = ({
  hasActiveGame,
  currentAssignment,
  onReset,
  disabled = false
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Calculate reset state information
  const revealedCount = currentAssignment?.players?.filter(p => p.revealed).length || 0;
  const totalPlayers = currentAssignment?.players?.length || 0;
  const hasRevealedRoles = revealedCount > 0;

  // Handle reset button click
  const handleResetClick = useCallback(() => {
    if (disabled || isResetting) return;
    setShowConfirmation(true);
  }, [disabled, isResetting]);

  // Handle confirmation
  const handleConfirm = useCallback(async () => {
    setIsResetting(true);
    try {
      await onReset();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  }, [onReset]);

  // Handle cancellation
  const handleCancel = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showConfirmation && !isResetting) {
        handleCancel();
      }
    };

    if (showConfirmation) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmation, isResetting, handleCancel]);

  // Focus management
  useEffect(() => {
    if (showConfirmation && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [showConfirmation]);

  return (
    <>
      {/* Reset Button */}
      <button
        type="button"
        onClick={handleResetClick}
        disabled={disabled || isResetting}
        className="w-full h-12 px-4 text-white bg-gray-600 hover:bg-gray-700"
        aria-label="Reset game and return to input screen"
      >
        Reset Game
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && createPortal(
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
             role="dialog" aria-modal="true">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            {/* Warning icon and header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                {/* Warning icon */}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reset Game?</h3>
              <p className="text-gray-600">This will clear all game progress...</p>
            </div>

            {/* Warning Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-red-800 mb-2">This action will clear:</h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• All current role assignments</li>
                {hasRevealedRoles && <li>• All revealed roles ({revealedCount} of {totalPlayers})</li>}
                <li>• Current game progress and state</li>
              </ul>
              <p className="text-sm text-red-700 mt-3 font-medium">
                ✓ Player names will be kept for easy re-setup.
              </p>
            </div>

            {/* Current Game Summary */}
            {currentAssignment && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Game:</h4>
                {/* Game stats display */}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button ref={cancelButtonRef} onClick={handleCancel} disabled={isResetting}
                      className="flex-1 h-12 px-4 text-gray-700 bg-gray-200 hover:bg-gray-300">
                Keep Playing
              </button>
              <button ref={confirmButtonRef} onClick={handleConfirm} disabled={isResetting}
                      className="flex-1 h-12 px-4 text-white bg-red-600 hover:bg-red-700">
                {isResetting ? 'Resetting...' : 'Reset Game'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};
```

**Reset Button System Pattern Key Points:**
- Portal-based modal for confirmation dialog
- Clear warning about what will be cleared vs. preserved
- Two-button choice: "Keep Playing" (cancel) or "Reset Game" (confirm)
- Focus management (auto-focus on cancel button for safety)
- Escape key dismisses confirmation
- Background scroll prevention when modal open
- Async reset handler with loading state
- Shows current game statistics before reset
- Conditional revealed roles warning when applicable
- Touch-optimized buttons (48px height minimum)
- Proper disabled states during reset operation

### **Edge Case Validation Pattern (ValidationUtility)**
**Follow this pattern for comprehensive input validation with edge case handling:**

```javascript
// Import centralized validation utility
import { 
  validateMafiaCount, 
  formatValidationMessages,
  VALIDATION_SEVERITY,
  EDGE_CASE_TYPES 
} from '../utils/edgeCaseValidation';

// Hook pattern for validation state management
export const useValidation = (value, totalPlayers) => {
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  
  // Memoized validation with edge case detection
  const validation = useMemo(() => {
    return validateMafiaCount(value, totalPlayers);
  }, [value, totalPlayers]);
  
  // Determine UI state
  const shouldShowError = hasUserInteracted && !validation.isValid;
  const shouldShowWarning = validation.isEdgeCase && validation.warning;
  const canProceed = validation.canProceed;
  
  return { validation, shouldShowError, shouldShowWarning, canProceed };
};

// Component pattern with visual feedback
const ValidatorComponent = ({ value, totalPlayers, onChange, onValidationChange }) => {
  const { validation, shouldShowError, shouldShowWarning } = useValidation(value, totalPlayers);
  
  // Notify parent of validation state changes
  React.useEffect(() => {
    onValidationChange?.(validation);
  }, [validation, onValidationChange]);
  
  return (
    <div>
      <input
        value={value}
        onChange={onChange}
        className={`
          ${shouldShowError ? 'border-red-300 focus:border-red-500' : ''}
          ${shouldShowWarning ? 'border-yellow-300 focus:border-yellow-500' : ''}
          ${!shouldShowError && !shouldShowWarning ? 'border-gray-300 focus:border-blue-500' : ''}
        `}
        aria-describedby={shouldShowError ? 'error-id' : shouldShowWarning ? 'warning-id' : undefined}
      />
      
      {/* Error Messages - Red */}
      {shouldShowError && (
        <p id="error-id" className="text-sm text-red-600" role="alert">
          {validation.message}
        </p>
      )}
      
      {/* Warning Messages - Yellow */}
      {shouldShowWarning && (
        <p id="warning-id" className="text-sm text-yellow-600" role="alert">
          <span className="inline-flex items-center">
            <WarningIcon />
            {validation.warning}
          </span>
        </p>
      )}
    </div>
  );
};
```

**Edge Case Validation Pattern Key Points:**
- Centralized validation logic in `src/utils/edgeCaseValidation.js`
- Three severity levels: ERROR (blocks), WARNING (requires confirmation), INFO (informational)
- Edge case types: NO_MAFIA (0), ALMOST_ALL_MAFIA (total-1), LARGE_GROUP (>30), SMALL_GROUP (<3)
- Clear distinction between invalid (blocks allocation) and edge cases (allows with warning)
- Visual feedback: Red for errors, yellow for warnings, blue/green for valid states
- User-friendly messages with icons, explanations, and gameplay impact
- ARIA compliance with role="alert" and proper aria-describedby associations
- Memoized validation prevents unnecessary recalculations
- Parent notification via callback props for state coordination
- Validation result structure includes: `isValid`, `severity`, `type`, `message`, `explanation`, `canProceed`, `requiresConfirmation`, `isEdgeCase`

**Validation Utility Functions:**
- `validateMafiaCount(mafiaCount, totalPlayers)` - Core validation logic
- `detectEdgeCase(mafiaCount, totalPlayers)` - Edge case detection
- `formatValidationMessages(validation)` - UI-friendly message formatting
- `validateGameConfiguration(playerNames, mafiaCount)` - Complete validation including names

**Example Edge Cases:**
```javascript
// 0 Mafia - Allowed with warning
validateMafiaCount(0, 5)
// { isValid: true, isEdgeCase: true, warning: 'No Mafia players...', requiresConfirmation: true }

// Almost all Mafia - Allowed with warning
validateMafiaCount(4, 5) 
// { isValid: true, isEdgeCase: true, warning: 'Almost all players are Mafia...', requiresConfirmation: true }

// All Mafia - Blocked as error
validateMafiaCount(5, 5)
// { isValid: false, error: 'Mafia count must be less than total players (5)', canProceed: false }

// Too many Mafia - Blocked as error
validateMafiaCount(6, 5)
// { isValid: false, error: 'Mafia count cannot exceed total players', canProceed: false }
```

### **Sticky Positioning Pattern (Mobile Layout Optimization)**
**Follow this pattern for keeping important UI elements visible during scrolling:**

```jsx
// Sticky current player indicator in CardListInterface
const CardListInterface = ({ assignment, currentPlayerIndex, onPlayerReveal, revealInProgress }) => {
  // ... state and calculations ...
  
  return (
    <div className="space-y-6">
      {/* Header with Progress (scrolls normally) */}
      <div className="space-y-4">
        <h2>Player Roles</h2>
        {/* Progress bar */}
      </div>
      
      {/* Sticky Current Player Cue - Always visible at top */}
      {currentPlayerIndex < cardStates.length && progress.completed < progress.total && (
        <div 
          className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-blue-50 border-2 border-blue-500 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0 animate-pulse" />
              <div className="min-w-0 flex-1">
                <span className="text-base font-bold text-blue-900 block truncate">
                  Next: {cardStates[currentPlayerIndex].name}
                </span>
                <p className="text-xs text-blue-700 mt-0.5 truncate">
                  Tap card below to reveal role
                </p>
              </div>
            </div>
            <div className="text-sm font-medium text-blue-700 bg-blue-100 rounded-full px-3 py-1 ml-3 flex-shrink-0">
              {currentPlayerIndex + 1} of {cardStates.length}
            </div>
          </div>
        </div>
      )}
      
      {/* Scrollable content below */}
      <div className="space-y-3">
        {/* Player cards */}
      </div>
    </div>
  );
};
```

**Sticky Positioning Pattern Key Points:**
- Use `sticky top-0` for positioning at top during scroll
- Add `z-10` or higher for proper layering above content
- Use `-mx-4 px-4` to extend to container edges (compensates for parent padding)
- Add `backdrop-blur-sm bg-opacity-95` for visibility over scrolling content
- Enhance with `shadow-lg` for depth perception and visual separation
- Use `truncate` on text elements to handle overflow gracefully
- Apply `min-w-0 flex-1` for proper flex text truncation
- Keep `flex-shrink-0` on icons and badges to prevent squishing
- Maintain ARIA live regions for accessibility announcements
- Works automatically across all mobile viewport sizes (320px-768px+)

**Safe Area Inset Support:**
Tailwind configuration enables notch/home indicator handling:
```javascript
// tailwind.config.js
theme: {
  extend: {
    spacing: {
      'safe-top': 'env(safe-area-inset-top)',
      'safe-bottom': 'env(safe-area-inset-bottom)',
      'safe-left': 'env(safe-area-inset-left)',
      'safe-right': 'env(safe-area-inset-right)',
    },
  },
}
```
Usage: `pt-safe-top`, `pb-safe-bottom`, etc. for proper padding on notched devices.
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

### **Development Scripts (Available)**
```bash
# Development
npm run dev          # Start Vite development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality (✅ Implemented)
npm run lint         # Run ESLint with React rules
npm run lint:fix     # Automatically fix ESLint issues
npm run format       # Format code with Prettier
npm run format:check # Check if code is properly formatted
```

### **Performance Standards**
- **Lint execution**: <5s (current: 0.713s ✅)
- **Format execution**: <2s (current: 0.446s ✅)
- **Dev server startup**: <2s overhead (current: 309ms ✅)
- **Build time**: Maintain fast builds (current: 1.12s ✅)

### **Code Quality Standards**
- **ESLint**: React plugin with comprehensive rules, prop validation enforced
- **Prettier**: Consistent formatting with React/JSX support, no ESLint conflicts
- **EditorConfig**: Cross-editor consistency (.editorconfig)
- **Git Integration**: Vite ESLint plugin shows errors in browser during development

## Code Quality Standards

- Use ESLint + Prettier for consistent formatting
- Prefer explicit over implicit code
- Write self-documenting code with clear naming
- Add JSDoc comments for complex functions
- Prefer immutable updates over mutations
- Use semantic commit messages
- **Use Tailwind CSS v3.x only** - Do not upgrade to v4+ without compatibility testing
- **Scope custom CSS** - Avoid universal selectors

### Tailwind CSS Utility Patterns (v3.4.17)
- **Mobile-first approach**: Use base classes, then add responsive prefixes (sm:, md:, lg:)
- **Utility-first styling**: Prefer Tailwind utilities over custom CSS classes
- **Component patterns**:
  ```jsx
  // Mobile-first responsive layout
  <div className="min-h-screen flex flex-col p-4 max-w-2xl mx-auto md:p-8">
    <header className="py-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-800">
  ```
- **Available breakpoints**: sm:640px, md:768px, lg:1024px (configured in tailwind.config.js)
- **Performance**: CSS bundle should remain under 50KB after purging (currently 26.17KB)
- **Content paths**: Include all JSX files in tailwind.config.js for proper CSS purging

### Design System (src/utils/designSystem.js)
- **Centralized styling utilities**: Color palettes, typography scales, sizing constants
- **Role-based colors**: Red for Mafia, Green for Villager
- **State-based colors**: Blue (current), Emerald (revealed), Gray (waiting/disabled)
- **Helper functions**: `getRoleStyles()`, `getStateStyles()`, `getCombinedStyles()`
- **Accessibility utilities**: Focus rings, touch-friendly sizing, WCAG AA compliance
- **Usage**: Import constants/functions or use inline Tailwind (both approaches valid)
- **Documentation**: See `docs/DESIGN_SYSTEM.md` for complete guide
- **WCAG AA Compliance**: All color combinations meet 4.5:1+ contrast ratios

## When Working on Mafia Game Role Allocator

**🚨 FINAL CHECKPOINT: Before considering ANY work "complete":**
- [ ] Code implements the intended functionality
- [ ] Tests pass and code works as expected  
- [ ] Performance impact has been considered/measured
- [ ] **copilot-instructions.md has been updated**
- [ ] **DEVELOPMENT.md has been updated**
- [ ] **Documentation reflects current architecture**

**If any checkbox above is unchecked, your work is not finished!**

## Current Architecture Status (September 28, 2025):

- Documentation scaffold created. Epic PRDs authored for Phases 1–6 and "Alternative / Edge Cases" under `docs/ways-of-work/plan/*/epic.md`.
- ✅ **Vite React Project Initialization COMPLETE** - React 18 + Vite foundation implemented with mobile-first architecture
- ✅ **Tailwind CSS Integration COMPLETE** - v3.4.17 integrated with PostCSS, mobile-first breakpoints, and 6.16KB optimized bundle
- Architecture specs added for all phases (1–6) and Alternative / Edge Cases under `docs/ways-of-work/plan/*/arch.md`.
- ✅ **Feature breakdown completed for ALL epics** into implementable features:
  - **Setup & Project Scaffolding:** 4 features (✅ Vite React, ✅ Tailwind, ✅ Dev Tooling, ✅ Mobile Optimization)
  - **Input & Validation:** 3 features (✅ Player Count Management, ✅ Mafia Count Validation, ✅ Player Name Input System)
  - **Role Allocation:** 3 features (✅ Allocation Confirmation Flow, ✅ Role Assignment Engine, ✅ Re-allocation System)
  - **Role Display & Reveal:** 3 features (✅ Card List Interface, ✅ Role Reveal Dialog, ✅ Sequential Order Enforcement)
  - **Reset & Re-Allocate:** 1 feature (✅ Reset Button System)
  - **Minimal Styling & UI Clarity:** 2 features (✅ Visual Differentiation System, ✅ Mobile Layout Optimization)
  - **Alternative & Edge Cases:** 2 features (✅ Edge Case Validation, ✅ Error Recovery System)
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
- ✅ **IMPLEMENTATION STARTED** - Vite React Project Initialization complete with working React 18 application foundation
- ✅ **IMPLEMENTATION CONTINUED** - Tailwind CSS Integration complete with utility-first styling and mobile-first responsive design
- ✅ **INPUT & VALIDATION EPIC COMPLETE** - Player Count Management, Mafia Count Validation, and Player Name Input System completed with comprehensive validation and testing
- ✅ **ROLE ALLOCATION EPIC CONTINUED** - Role Assignment Engine completed with Fisher-Yates shuffle algorithm, comprehensive edge case handling, and complete data structure for card list integration
- ✅ **ROLE DISPLAY & REVEAL EPIC STARTED** - Card List Interface completed with mobile-first vertical layout, sequential reveal enforcement, progress tracking, and comprehensive accessibility support
- ✅ **PRODUCTION DEPLOYMENT COMPLETE** - Live application deployed to Vercel at https://mafia-game-role-allocator-jqhayysnn-lem0n4ids-projects.vercel.app with full Input & Validation epic functionality
- ✅ **ROLE ALLOCATION EPIC COMPLETE** - Re-allocation System completed with unified confirmation flow, independent randomization, and state cleanup. Same "Allocate Roles" button used for both initial allocation and re-allocation with enhanced confirmation dialogs
- ✅ **ROLE DISPLAY & REVEAL EPIC COMPLETE** - Sequential Order Enforcement completed with enhanced current player indicator, strict order validation, and comprehensive accessibility support (ARIA live regions, tooltips, disabled states)
- ✅ **RESET & RE-ALLOCATE EPIC COMPLETE** - Reset Button System completed with confirmation dialog, state preservation (player names, counts), and complete state cleanup (assignments, reveal progress, dialogs)
- ✅ **MINIMAL STYLING & UI CLARITY EPIC COMPLETE** - Visual Differentiation System and Mobile Layout Optimization completed with centralized design system utilities (color palettes, typography scales, sizing constants), WCAG AA compliant contrast ratios, sticky current player cue, safe area inset support, and comprehensive styling documentation
- ✅ **ALTERNATIVE & EDGE CASES EPIC COMPLETE** - Edge Case Validation and Error Recovery System both completed. Edge case validation handles 0/almost-all Mafia scenarios with warnings and blocks invalid configurations. Error Recovery System provides comprehensive runtime error protection with Error Boundary component, global error handlers, and enhanced double-tap protection utilities

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

### Vite React Project Initialization completed (September 28, 2025)
- ✅ **First feature implementation complete** - React 18 + Vite foundation established
- **Technical architecture**: Functional components with Hooks, mobile-first CSS, organized directory structure
- **Performance metrics**: Dev server startup 171ms, build time 755ms, bundle size 148KB (includes React 18)
- **File structure**: Created src/components/, src/hooks/, src/utils/ directories for organized development
- **Development workflow**: Lint, build, and preview scripts working, ESLint configuration active
- **Mobile-first design**: 375px mobile viewport tested, responsive layout implemented
- **Ready for integration**: Foundation prepared for Tailwind CSS, Development Tooling, and Mobile Optimization features

### Mobile Optimization Configuration completed (September 28, 2025)
- ✅ **Second feature implementation complete** - Mobile-first optimization and performance monitoring established
- **Mobile viewport optimization**: Enhanced viewport meta tags with `viewport-fit=cover`, mobile web app capabilities, theme colors
- **Vite mobile configuration**: Network access (`host: '0.0.0.0'`), performance budgets (400KB warning, 500KB error), bundle analysis
- **Browser compatibility**: Browserslist configured for iOS Safari 14+, Chrome 90+, Android 7+ support
- **Performance monitoring**: Core Web Vitals tracking (FCP, LCP, CLS), memory usage monitoring, network-aware patterns
- **Mobile-first utilities**: Touch targets (44px minimum), responsive breakpoints, safe area support, performance optimizations
- **Bundle optimization**: Code splitting (vendor: 141KB, app: 3KB), total size ~148KB (under 400KB warning threshold)
- **Development workflow**: Mobile network scripts (`dev:mobile`, `preview:mobile`), bundle analysis (`build:analyze`)
- **File structure**: Added `src/utils/`, `src/styles/`, `performance/` directories with mobile-specific patterns
- **Ready for integration**: Foundation optimized for real mobile device testing and performance-first development

### Development Tooling Setup completed (September 28, 2025)
- ✅ **Second feature implementation complete** - Professional development tooling ecosystem established
- **ESLint Enhancement**: React plugin integration with comprehensive rules (prop validation, Hooks rules, unused variables)
- **Prettier Integration**: Consistent code formatting with React/JSX support, conflict-free ESLint integration
- **Enhanced npm scripts**: Added lint:fix, format, format:check scripts for complete development workflow
- **Vite Integration**: ESLint plugin for real-time browser error display during development
- **Editor Support**: .editorconfig for cross-editor consistency, .prettierignore for proper file exclusions
- **Performance metrics**: Lint 0.713s, Format 0.446s, Dev server overhead 309ms (all under requirements)
- **Code Quality**: Automated React best practices enforcement, immediate feedback loops established
- **File structure**: Added .prettierrc, .editorconfig, .prettierignore configuration files
- **Ready for integration**: Professional development workflow prepared for Tailwind CSS and Mobile Optimization features

### Player Count Management implementation completed (September 29, 2025)
- ✅ **First Input & Validation feature complete** - Dynamic player count management with real-time field generation
- **Hook Implementation**: Created `usePlayerCountManager` custom hook for state management with player count (1-30) and names array
- **Component Implementation**: Built `PlayerCountManager` component with responsive UI, validation feedback, and accessibility
- **Dynamic Field Management**: Automatic generation/removal of name input fields based on player count changes
- **Value Preservation**: Existing player names preserved when count decreases, new empty fields added when count increases
- **Validation System**: Real-time validation with completion counter, visual status indicators, and error messaging
- **Mobile Responsiveness**: 44px touch targets, responsive layout for 375px+ widths, no horizontal scrolling
- **Performance**: Efficient re-rendering with useCallback/useMemo optimizations, under 100ms response time
- **Accessibility**: Proper ARIA labeling, error announcements, focus management, and semantic HTML
- **Integration**: Component replaces App.jsx placeholder, provides foundation for Mafia Count Validation feature
- **File structure**: Added `src/hooks/usePlayerCountManager.js`, `src/components/PlayerCountManager.jsx`
- **Bundle impact**: +4.28KB JS (8.33KB total), +1.76KB CSS (12.36KB total), still under performance budgets

### Player Count Management bug fix (September 29, 2025)
- ✅ **Dynamic field generation bug resolved** - Fixed array expansion logic in usePlayerCountManager hook
- **Issue**: Player count decrease to 1, then increase to 2+ wasn't properly generating additional input fields
- **Root Cause**: Array expansion using `array.length = count` doesn't handle expansion from smaller arrays
- **Solution**: Replaced with explicit `while` loop using `push('')` for expansion and proper truncation for shrinking
- **Implementation**: Updated `updatePlayerCount` function with robust array resize logic
- **Testing**: Verified 1→2, 1→5, 5→2 player count transitions work correctly
- **Commit**: `ea1d8c5` on branch `copilot/fix-f5bd74f4-9954-48c6-91fd-fff2ad648c27`
- **Impact**: Resolves critical UX issue where dynamic fields weren't appearing correctly

### Player Name Input System enhancement completed (September 29, 2025)
- ✅ **Second Input & Validation feature complete** - Comprehensive player name input validation with enhanced visual feedback
- **Enhanced validation system**: Added touchedFields state tracking, comprehensive validation object with blankFields/completedFields arrays, whitespace handling with trim() validation, detailed error messaging with field counts
- **Rich visual feedback**: Progress bar showing completion percentage, per-field status icons (green checkmarks for valid, red error icons for invalid), color-coded field styling (green borders/backgrounds for valid, red for invalid), individual field-specific error messages, global validation summary with helpful guidance
- **Accessibility enhancements**: Proper ARIA compliance with role="alert" attributes, screen reader accessible error announcements, field-specific aria-describedby associations, semantic HTML structure with proper label associations
- **Mobile optimization**: Touch-friendly design maintained with 44px+ touch targets, proper keyboard navigation and focus management, responsive layout adaptation, efficient performance with 10+ fields tested
- **Component integration**: Enhanced existing PlayerCountManager component, maintained backward compatibility with all props and callbacks, preserved integration points for parent components
- **Technical implementation**: Modified `src/hooks/usePlayerCountManager.js` with enhanced state management, updated `src/components/PlayerCountManager.jsx` with rich UI components
- **Performance impact**: +2.35KB JS (+28%), +1.49KB CSS (+12%) - well within performance budgets (<500KB total)
- **PRD compliance**: All 7 acceptance criteria categories validated (field generation, validation, duplicates, persistence, form integration, mobile usability, reset functionality)
- **File structure**: Enhanced existing `src/hooks/usePlayerCountManager.js` and `src/components/PlayerCountManager.jsx`
- **Bundle impact**: Total bundle size ~153KB (JS: 10.71KB app + 141.74KB vendor, CSS: 13.92KB) - under performance thresholds
- **Commit**: `3d8ec5b` on branch `copilot/fix-ad4e39dc-1fad-4519-8aa7-ab70d26fa0c4`
- **Ready for integration**: Foundation established for Mafia Count Validation feature integration

### Player Name Input System comprehensive testing completed (September 29, 2025)
- ✅ **Feature validation complete** - All 6 testing categories verified with excellent results across comprehensive test suite
- **Testing methodology**: Systematic validation of core validation features, visual feedback system, accessibility compliance, mobile responsiveness, and edge case handling
- **Core Validation Results - EXCEPTIONAL**: Real-time blank field detection working flawlessly, dynamic progress tracking with completion rate calculation active, touchedFields state management verified for user interaction tracking, comprehensive error reporting with field-specific and global messaging confirmed
- **Visual Feedback Results - OUTSTANDING**: Progress bar displaying completion percentage accurately, green checkmarks and red error icons working perfectly, color-coded field borders (green for valid, red for invalid) implemented correctly, real-time updates responding instantly to user interactions
- **Accessibility Results - EXEMPLARY**: Full ARIA compliance verified including role="alert" attributes, aria-live="polite" for dynamic updates, aria-describedby field associations working properly, semantic HTML structure with proper label relationships confirmed, keyboard navigation and screen reader support tested
- **Mobile Responsiveness Results - PERFECT**: 48px touch targets exceeding 44px requirement verified, touch-manipulation CSS applied for optimized mobile interactions, mobile-first responsive design confirmed working across viewport sizes, performance with 10+ fields tested and optimized
- **Edge Case Results - COMPREHENSIVE**: Boundary validation (1-30 player range) strictly enforced, array management with robust expansion/truncation logic verified, whitespace handling with .trim() validation working correctly, duplicate name scenarios allowed as per specifications, reset functionality preserving names while clearing validation state confirmed
- **Technical validation highlights**: Enhanced touchedFields Set tracking user interactions successfully, dynamic completion rate calculation providing smooth user feedback, professional accessibility implementation exceeding WCAG standards, touch-optimized inputs with proper responsive layout performing excellently
- **Performance verification**: Optimized rendering for 10+ fields with smooth transitions confirmed, real-time validation updates maintaining <200ms response times, bundle size within performance budgets validated
- **Integration readiness**: Foundation fully prepared for seamless integration with Mafia Count Validation feature, all API contracts and component interfaces stable and documented

### Mafia Count Validation implementation completed (September 29, 2025)
- ✅ **Second Input & Validation feature complete** - Comprehensive Mafia count validation with edge case handling
- **Hook Implementation**: Created `useMafiaCountValidation` custom hook for real-time validation against player count
- **Component Implementation**: Built `MafiaCountValidator` component with error/warning states and mobile optimization
- **Validation System**: Real-time validation preventing invalid ratios (Mafia ≥ players), immediate feedback <100ms
- **Edge Case Handling**: Supports 0 Mafia and almost-all-Mafia scenarios with warning messages and confirmation flow
- **Dynamic Revalidation**: Auto-adjusts validation when player count changes, maintains valid state
- **Error Messaging**: Clear, actionable error messages with proper accessibility (ARIA labels, screen reader support)
- **Mobile Responsiveness**: 44px touch targets, warning/error styling visible on small screens, no layout shifts
- **Integration**: Combined validation state in App.jsx supporting both player names and Mafia count validation
- **Performance**: Efficient validation with useMemo/useCallback optimizations, memoized validation calculations
- **File structure**: Added `src/hooks/useMafiaCountValidation.js`, `src/components/MafiaCountValidator.jsx`
- **Bundle impact**: +3.3KB JS (11.66KB total), +0.75KB CSS (13.18KB total), still under performance budgets

### UI Layout Integration improvement (September 29, 2025)
- ✅ **Component integration enhanced** - Mafia Count Validator moved to optimal position in user workflow
- **Layout Restructure**: Modified PlayerCountManager to accept `mafiaCountSection` render prop for seamless integration
- **User Experience**: Improved flow from Player Count → Mafia Count → Individual Player Names
- **Component Architecture**: Implemented render prop pattern for clean component composition
- **App.jsx Changes**: Integrated MafiaCountValidator as prop within PlayerCountManager component
- **PlayerCountManager Enhancement**: Added `mafiaCountSection` prop with PropTypes validation
- **Positioning**: Mafia count section now appears between player count input and dynamic name fields
- **Code Quality**: Applied Prettier formatting, maintained all existing functionality and validation
- **Visual Hierarchy**: More logical progression through game setup process
- **Impact**: Improved user experience with cohesive form flow and better semantic grouping

### Allocation Confirmation Flow implementation completed (September 29, 2025)
- ✅ **First Role Allocation feature complete** - Comprehensive confirmation gateway with parameter validation and edge case handling
- **Component Implementation**: Created `AllocationConfirmationFlow` component with smart button state, rich confirmation dialog, and accessibility features
- **Smart Button State**: "Allocate Roles" button dynamically enables/disables based on combined form validation state
- **Rich Confirmation Dialog**: Modal displaying total players, Mafia count, villager count with complete player name preview
- **Edge Case Detection**: Automatic detection and warning for unusual configurations (0 Mafia or nearly all Mafia scenarios)
- **Double-tap Protection**: Prevents multiple confirmation dialogs through processing state management and disabled states
- **Accessibility Compliance**: Full ARIA compliance, keyboard navigation (Escape key), screen reader support, focus management
- **Mobile Optimization**: 44px+ touch targets, responsive modal sizing, touch-friendly interactions, proper viewport handling
- **Performance**: Efficient rendering with useMemo/useCallback optimizations, memoized allocation calculations
- **Integration Architecture**: Clean callback interface providing validated parameters for future Role Assignment Engine integration
- **Portal Implementation**: Uses React.createPortal for proper modal rendering outside component hierarchy
- **File structure**: Added `src/components/AllocationConfirmationFlow.jsx`, integrated in `src/App.jsx`
- **Bundle impact**: +10.6KB total (JS: +8.81KB app bundle, CSS: +5.27KB), well within performance budgets (total: ~162KB)
- **Technical patterns**: Established confirmation flow pattern for future destructive actions, modal accessibility pattern

### Vercel Production Deployment (September 29, 2025)
- ✅ **Production deployment successful** - Complete Input & Validation features live on Vercel
- **Live application**: https://mafia-game-role-allocator-jqhayysnn-lem0n4ids-projects.vercel.app
- **Deployment solution**: Added `@rollup/rollup-linux-x64-gnu: "4.6.1"` as optional dependency to resolve Linux build environment compatibility
- **Technical implementation**:
  - Created `vercel.json` configuration with static build settings and npm install commands
  - Added `.vercel` deployment directory to `.gitignore` for clean repository management
  - Maintained full Vite configuration with development tooling (ESLint, bundle analysis)
- **Production validation**: All features verified working including dynamic player count, name validation, Mafia count validation, mobile responsiveness
- **Performance**: Production bundle optimized at 171KB total size, under performance budgets
- **Infrastructure**: Deployment pipeline established with GitHub integration for future automated deployments
- **Milestone**: Input & Validation epic fully implemented and deployed - ready for Role Allocation phase

### Role Assignment Engine implementation completed (September 29, 2025)
- ✅ **Second Role Allocation feature complete** - Cryptographically fair role assignment system with Fisher-Yates shuffle algorithm
- **Core Implementation**: Created `roleAssignmentEngine.js` utility with `assignRoles()`, `validateAssignment()`, and randomness testing functions
- **Fisher-Yates Algorithm**: Proper implementation with cryptographically secure `crypto.getRandomValues()` and `Math.random()` fallback
- **React Integration**: Built `useRoleAssignment` hook for state management with assignment creation, validation, and re-allocation support
- **Edge Case Handling**: Comprehensive support for 0 Mafia, normal ratios, and almost-all Mafia scenarios with appropriate UI warnings
- **Performance Excellence**: Sub-millisecond assignment time for 30 players (0.12ms average, far exceeds <200ms requirement)
- **Data Structure**: Complete player objects with `id`, `name`, `role`, `index`, `revealed` properties plus assignment metadata and statistics
- **UI Integration**: Enhanced `App.jsx` with role assignment state, results display, reassign functionality, and reset capability
- **Validation System**: Assignment integrity checks, input validation, and error handling with detailed error messaging
- **Testing**: Comprehensive validation including randomness distribution testing (0.90% max deviation over 1000 iterations)
- **File structure**: Added `src/utils/roleAssignmentEngine.js`, `src/hooks/useRoleAssignment.js`
- **Bundle impact**: +9.45KB JavaScript, efficient implementation within performance budgets
- **Acceptance criteria**: All 7 categories validated - algorithm, assignment logic, validation, output format, performance, testability, integration

### Card List Interface implementation completed (October 2, 2025)
- ✅ **First Role Display & Reveal feature complete** - Mobile-first card list component with sequential reveal enforcement
- **Component implementation**: Created `src/components/CardListInterface.jsx` with comprehensive features:
  - Vertical card layout with 72px minimum height for touch accessibility
  - Sequential reveal order enforcement with visual state management
  - Progress tracking with completion percentage and current player indicators
  - Role-based visual differentiation (green for Villagers, red for Mafia)
  - Completion state with "All roles revealed!" celebration message
- **Accessibility compliance**: Full ARIA labeling, keyboard navigation, and screen reader support
- **Performance optimization**: Memoized calculations with useMemo/useCallback for efficient re-rendering
- **Visual design**: Tailwind CSS mobile-first responsive layout with proper touch targets (44px+)
- **State management**: Card states (waiting, current, revealed) with smooth transitions
- **Edge case handling**: Supports 1-30 players with proper layout adaptation
- **Integration**: Enhanced role assignment engine with reveal tracking and card list data structure

### App.jsx integration enhancement completed (October 2, 2025)
- ✅ **Dual-phase application flow** - Seamless transition between input and display phases
- **State management enhancement**: Added assignment, currentPlayerIndex, and revealInProgress state
- **Phase-based rendering**: Conditional display of input forms vs. card list interface
- **Reset functionality**: Clean state reset preserving user workflow patterns
- **Integration architecture**: Clean callback interfaces between components
- **Error handling**: Proper try-catch blocks with user-friendly error messages
- **Performance**: Maintains <200ms interaction response times throughout reveal sequence

### Re-allocation System implementation completed (October 2, 2025)
- ✅ **Third Role Allocation feature complete** - Unified re-allocation flow using same AllocationConfirmationFlow component
- **Unified confirmation flow**: Same "Allocate Roles" button used for both initial allocation and re-allocation (PRD AC-1 requirement)
- **Enhanced AllocationConfirmationFlow component**: Added support for `hasExistingAssignment` and `currentAssignment` props
- **Dynamic UI adaptation**: Different header ("Re-allocate Roles?"), orange theme, refresh icon, and warning section for re-allocation
- **State cleanup integration**: Automatically clears reveal states (currentPlayerIndex, showCardListInterface) on re-allocation
- **Independent randomization**: Each re-allocation uses fresh Fisher-Yates shuffle with new assignment ID
- **Input preservation**: Player names and counts preserved across unlimited re-allocation attempts
- **Performance excellence**: Re-allocation typically completes in <1ms (well under 200ms requirement)
- **Removed duplicate UI**: Eliminated separate "Reassign Roles" button in favor of unified flow
- **App.jsx refactoring**: Updated to always show AllocationConfirmationFlow when appropriate, with `isReallocation` flag
- **File changes**: Modified `src/components/AllocationConfirmationFlow.jsx` and `src/App.jsx`
- **Bundle impact**: Minimal increase (+1.87KB JS) with enhanced functionality
- **Acceptance criteria**: All 7 PRD acceptance criteria categories validated through manual testing

### Role Reveal Dialog implementation completed (October 2, 2025)
- ✅ **Second Role Display & Reveal feature complete** - Professional modal dialog system for private role viewing with clear Reveal/Close workflow
- **Component Implementation**: Created `RoleRevealDialog` component with portal-based modal, two-step reveal process, and role-specific styling
- **Two-Step Reveal Flow**: "Reveal Role" button → Role Display with icon and description → "Close" button (replaces window.confirm())
- **Role-Specific Styling**: Red theme for Mafia (border-red-500, bg-red-50), green theme for Villagers (border-green-500, bg-green-50)
- **Dialog Management Hook**: Created `useRoleRevealDialog` hook for state management (isOpen, currentPlayer, revealInProgress)
- **Accessibility Excellence**: Full ARIA compliance, focus management, focus trap, keyboard navigation (Escape key), screen reader support
- **Mobile Optimization**: 44px+ touch targets (Reveal: 56px, Close: 48px), responsive sizing (max-w-sm), proper viewport handling
- **Privacy Features**: Modal overlay blocks background interaction, role info in memory only, no browser history exposure
- **Integration**: Updated App.jsx to use dialog instead of window.confirm(), enhanced useRoleAssignment with markPlayerRevealed()
- **Animation**: Smooth fade-in/fade-out transitions (150ms duration), scale transform for polish
- **Performance**: Dialog appears <100ms, efficient state management with useCallback optimizations
- **File structure**: Added `src/components/RoleRevealDialog.jsx` (296 lines), `src/hooks/useRoleRevealDialog.js` (45 lines)
- **Bundle impact**: +6.07KB JS, +1.11KB CSS (total ~213KB, under 500KB budget)
- **Acceptance criteria**: All 8 PRD acceptance criteria validated - display, button flow, privacy, security, performance, accessibility

### Sequential Order Enforcement implementation completed (October 2, 2025)
- ✅ **Third Role Display & Reveal feature complete** - Enhanced existing components with strict order validation and prominent current player indication
- **Enhancement Strategy**: Rather than creating new wrapper components, enhanced CardListInterface and App.jsx with minimal changes following "surgical modifications" principle
- **Current Player Indicator Enhancement**: Made indicator more prominent with border-2, bold text, shadow, and position badge (e.g., "1 of 5")
- **ARIA Live Region**: Added `role="status" aria-live="polite"` to current player indicator for screen reader announcements
- **Strict Order Validation**: Added validation guard in App.jsx handlePlayerReveal to block out-of-order attempts
- **Enhanced Card States**: Improved visual differentiation with opacity (revealed: 90%, waiting: 60%) and cursor states (cursor-not-allowed for disabled)
- **Accessibility Improvements**: Added aria-disabled, title tooltips, and enhanced aria-label descriptions
- **User Feedback**: Console warnings for blocked interactions with descriptive messages
- **Performance**: Current player indicator updates within 100ms as required, verified with manual testing
- **File changes**: Modified `src/components/CardListInterface.jsx` and `src/App.jsx` (64 line changes)
- **Bundle impact**: Minimal (+1.04KB JS, +0.35KB CSS), efficient implementation
- **Testing**: All 3 acceptance criteria categories validated - current player cue, order enforcement, visual state management
- **Implementation approach**: Built on existing working code rather than adding new abstractions, maintaining codebase simplicity

### Reset Button System implementation completed (October 2, 2025)
- ✅ **Reset & Re-Allocate epic complete** - Comprehensive reset functionality with confirmation dialog and state preservation
- **Component Implementation**: Created `ResetButtonSystem` component with portal-based confirmation modal
- **Confirmation Dialog**: Warning dialog prevents accidental resets with clear summary of what will be cleared/preserved
- **State Cleanup**: Clears role assignments, reveal progress (currentPlayerIndex, showCardListInterface), and dialog states
- **State Preservation**: Maintains player names, player count, and mafia count as per PRD requirements
- **Critical Fix**: Updated App.jsx to pass preserved `playerNames` and `playerCount` as `initialNames` and `initialCount` to PlayerCountManager
- **Integration**: Reset button available in both Assignment Results phase and Card List Reveal phase
- **Accessibility Excellence**: Full ARIA compliance, focus management (auto-focus cancel button), Escape key handler, background scroll prevention
- **Mobile Optimization**: 48px touch targets (exceeds 44px requirement), responsive modal sizing, touch-friendly interactions
- **Performance**: Reset completes instantly (<200ms requirement exceeded), smooth 150ms fade animations
- **File structure**: Added `src/components/ResetButtonSystem.jsx` (227 lines), modified `src/App.jsx` for integration
- **Bundle impact**: +4.78KB JS, +0.34KB CSS (total ~220KB, well under 500KB budget)
- **Testing**: All 8 PRD acceptance criteria validated - availability, state cleanup, data preservation, accessibility, performance, mobile optimization
- **Pattern Established**: Confirmation dialog pattern for destructive actions with state preservation and clear user warnings

### Visual Differentiation System implementation completed (October 2, 2025)
- ✅ **Minimal Styling & UI Clarity epic started** - Centralized design system with comprehensive visual styling utilities
- **Design System Foundation**: Created `src/utils/designSystem.js` with color palettes, typography scales, sizing constants, and helper functions
- **Color Palettes**: Defined role-based colors (Red for Mafia, Green for Villager) and state-based colors (Blue for current, Emerald for revealed, Gray for waiting/disabled)
- **Typography System**: Comprehensive scale from text-xs to text-4xl with appropriate font weights for headings, body, UI elements, and role displays
- **Sizing Constants**: Touch targets (44px minimum), button heights (h-12/h-14), card padding, icon sizes for consistent spacing
- **Helper Functions**: `getRoleStyles()`, `getStateStyles()`, `getCombinedStyles()` for programmatic style application
- **Accessibility Utilities**: Focus rings, screen reader utilities, touch-friendly sizing, high contrast mode support
- **WCAG AA Compliance**: All color combinations tested and validated (Mafia: 7.60:1, Villager: 8.70:1, Current: 9.52:1, Waiting: 9.86:1)
- **Documentation**: Created comprehensive `docs/DESIGN_SYSTEM.md` guide with usage examples, color specifications, and best practices
- **Bundle Impact**: CSS increased 1.48KB (24.69KB → 26.17KB), well under 50KB budget requirement
- **Performance**: No runtime JavaScript overhead (pure Tailwind utilities), build time unchanged (~2.36s)
- **Acceptance Criteria**: All 8 criteria verified - element differentiation, state indication, mobile optimization, accessibility compliance
- **Pattern Note**: Components can use inline Tailwind (current approach) or import design system functions (both valid and maintainable)

### Mobile Layout Optimization implementation completed (October 2, 2025)
- ✅ **Minimal Styling & UI Clarity epic complete** - Mobile-first responsive layout with sticky current player cue and comprehensive touch optimization
- **Sticky Current Player Cue**: Enhanced CardListInterface with sticky positioning (position:sticky top-0 z-10) to keep current player indicator always visible during scrolling
  - Backdrop blur effect (backdrop-blur-sm bg-opacity-95) for better visibility over content
  - Enhanced shadow (shadow-lg) and prominent border (border-2 border-blue-500) for depth perception
  - Negative margins (-mx-4) with padding (px-4) to extend indicator to container edges
  - Text truncation for long player names to prevent layout issues
- **Safe Area Inset Support**: Added Tailwind utilities for notched devices (iPhone X+, modern Android)
  - Configured safe-area-inset-top/bottom/left/right in tailwind.config.js
  - Enables proper padding on devices with notches and home indicators
  - Uses CSS env() variables for dynamic safe area handling
- **Touch Target Verification**: Comprehensive audit confirmed all interactive elements meet 44px+ minimum
  - Inputs: 48px (h-12)
  - Primary buttons: 56px (h-14)
  - Secondary buttons: 48px (h-12)
  - Player cards: 72px (min-h-[72px])
- **Responsive Layout**: Mobile-first design with proper breakpoints
  - Base padding: p-4 (16px) for mobile
  - Tablet padding: md:p-8 (32px) for larger screens
  - Max width constraints: max-w-2xl on container, max-w-lg on content
  - Viewport configuration: width=device-width, initial-scale=1.0, viewport-fit=cover
- **Performance**: Build time 2.25s, CSS 26.89KB (under 50KB budget), total bundle 220.34KB (under 500KB budget)
- **Testing Documentation**: Created dev-tools/mobile-layout-test.md with comprehensive testing scenarios
- **File changes**: Modified src/components/CardListInterface.jsx, tailwind.config.js
- **Bundle impact**: +0.72KB CSS (26.17KB → 26.89KB), within performance budgets
- **Acceptance criteria**: All 3 PRD categories verified - responsive layout (320px-768px), touch optimization (44px+ targets), current player cue visibility (sticky positioning)

### Edge Case Validation implementation completed (January 2025)
- ✅ **Alternative & Edge Cases epic started** - Edge case validation fully functional with comprehensive validation utility
- **Implementation Analysis**: Verified existing implementation meets all PRD acceptance criteria (AC-1: Edge case allowance, AC-2: Invalid input prevention, AC-3: Validation integration)
- **Existing Validation**: `useMafiaCountValidation` hook already detects 0 Mafia and almost-all-Mafia edge cases with appropriate warnings
- **UI Components**: `MafiaCountValidator` displays yellow warnings for edge cases, red errors for invalid configurations
- **Confirmation Flow**: `AllocationConfirmationFlow` shows edge case warnings in confirmation dialog before allocation
- **Name Validation**: `usePlayerCountManager` validates blank names and blocks allocation with clear error messages
- **Centralized Utility**: Created `src/utils/edgeCaseValidation.js` with comprehensive validation logic for consistency and future enhancements:
  - Edge case types: NO_MAFIA, ALL_MAFIA, ALMOST_ALL_MAFIA, LARGE_GROUP, SMALL_GROUP, INVALID_INPUT
  - Validation severity levels: ERROR (blocks), WARNING (requires confirmation), INFO (informational)
  - Functions: `validateMafiaCount()`, `detectEdgeCase()`, `formatValidationMessages()`, `validateGameConfiguration()`
  - Configurable thresholds: MIN_PLAYERS: 1, MAX_PLAYERS: 50, LARGE_GROUP: 20, SMALL_GROUP: 3, PERFORMANCE_WARNING: 30
- **Documentation**: Created comprehensive `docs/EDGE_CASE_VALIDATION.md` with validation flow diagrams, testing scenarios, and code examples
- **Performance**: Validation executes within 100ms requirement (typically <10ms), no impact on application performance
- **Accessibility**: Full ARIA compliance with role="alert" attributes, screen reader support, WCAG AA color contrast
- **File structure**: Added `src/utils/edgeCaseValidation.js` (305 lines), `docs/EDGE_CASE_VALIDATION.md` (9.5KB)
- **Bundle impact**: +9.41KB JS (edge case utility), within 500KB budget (total ~220KB)
- **Acceptance criteria**: All 3 AC categories verified through code review and manual testing - edge cases allowed with warnings, invalid configs blocked, seamless integration

### Error Recovery System implementation completed (January 2025)
- ✅ **Alternative & Edge Cases epic complete** - Comprehensive error recovery system with runtime protection and double-tap safeguards
- **Implementation Analysis**: Verified existing implementation already has robust double-tap protection; added error boundaries and recovery utilities
- **Existing Protection**: Double-tap protection already implemented via `isProcessing`/`isResetting` states in all critical components:
  - `AllocationConfirmationFlow`: isProcessing state prevents multiple allocations
  - `ResetButtonSystem`: isResetting state prevents multiple resets  
  - `RoleRevealDialog`: Dialog state prevents multiple opens
- **Error Boundary**: Created `src/components/ErrorBoundary.jsx` for catching and recovering from runtime errors:
  - Automatic error classification by type and severity
  - User-friendly error messages with recovery actions
  - Automatic recovery for low-severity errors (max 3 retries)
  - Manual recovery options for critical errors
  - Development mode debugging with full stack traces
- **Error Recovery Utility**: Created `src/utils/errorRecovery.js` with comprehensive error handling:
  - Error types: RUNTIME_ERROR, STATE_CORRUPTION, VALIDATION_ERROR, COMPONENT_ERROR, UNKNOWN_ERROR
  - Severity levels: LOW (auto-recoverable), MEDIUM (user-guided), HIGH (manual), CRITICAL (restart needed)
  - Recovery strategies: RETRY, RESET_STATE, RELOAD_COMPONENT, FALLBACK_UI, MANUAL_INTERVENTION
  - State validation functions for detecting corruption
- **Debounce Utility**: Created `src/utils/debounce.js` for enhanced double-tap protection:
  - Debounce function with configurable delay (default 300ms)
  - Throttle function for rate-limiting operations
  - React-compatible callback creator
- **Global Error Handler**: Added unhandled promise rejection handler in `src/main.jsx`:
  - Catches unhandled promise rejections
  - Prevents browser default error behavior
  - Logs errors for debugging
- **Integration**: Wrapped entire app in ErrorBoundary component in main.jsx
- **Documentation**: Created comprehensive `docs/ERROR_RECOVERY.md` with usage examples, testing scenarios, and acceptance criteria verification
- **Performance**: Error detection has minimal overhead, recovery operations complete within 500ms requirement
- **File structure**: Added `src/components/ErrorBoundary.jsx` (281 lines), `src/utils/errorRecovery.js` (235 lines), `src/utils/debounce.js` (68 lines), `docs/ERROR_RECOVERY.md` (11.5KB)
- **Bundle impact**: +6.68KB JS (error recovery utilities), within 500KB budget (total ~227KB)
- **Acceptance criteria**: All 4 AC categories verified - reset during reveal works, double-tap protection active, workflow continuity maintained, shared device workflow supported

### Touch-Optimized Counter Controls implementation completed (October 2, 2025)
- ✅ **Mobile UX Enhancement feature complete** - Custom counter controls replacing HTML number inputs with touch-optimized interactions
- **Component Implementation**: Created `CounterControl` component with reusable ← N → layout for mobile-first interactions
- **Hook Implementation**: Built `useCounterControl` custom hook for boundary validation and state management
- **Mobile Optimization**: 44px+ touch targets meeting accessibility guidelines, immediate visual feedback within 100ms
- **Component Integration**: Enhanced `PlayerCountManager` and `MafiaCountValidator` with CounterControl while preserving all existing functionality
- **Boundary Enforcement**: Automatic button disabling at min/max values with visual feedback for disabled states
- **Accessibility Compliance**: Full ARIA support with role="spinbutton", keyboard navigation via arrow keys, screen reader compatibility
- **Performance**: Bundle impact +2.64KB (well under 5KB limit), total ~186KB, sub-millisecond response times
- **Visual Design**: Seamless integration with Tailwind CSS design system, professional hover/active states, consistent typography
- **Validation Preservation**: All existing validation logic maintained exactly including real-time feedback, edge case warnings, boundary enforcement
- **File structure**: Added `src/hooks/useCounterControl.js`, `src/components/CounterControl.jsx`
- **Technical patterns**: Established reusable touch-optimized patterns for future numeric inputs, React.memo optimization

### Counter Controls Layout Enhancement (October 2, 2025)
- ✅ **UX improvement based on user feedback** - Changed counter layout from vertical to horizontal for cleaner UI
- **Layout Modification**: Updated CounterControl from vertical (↓ N ↑) to horizontal (← N →) arrangement
- **Button Reordering**: Rearranged sequence to Decrement (←) | Value (N) | Increment (→) for intuitive left-to-right interaction
- **Icon Updates**: Changed SVG paths from up/down arrows to left/right arrows for better semantic alignment
- **Container Styling**: Modified from `flex-col space-y-1` to `flex-row space-x-1` for horizontal flow
- **Functionality Preservation**: All touch optimization, accessibility, and validation features maintained exactly
- **Visual Benefits**: Cleaner UI with better space utilization, more familiar interaction pattern, professional appearance
- **Performance**: No impact on bundle size or response times, maintained sub-millisecond interactions
- **Accessibility**: ARIA labels and keyboard navigation preserved, screen reader compatibility maintained
- **User Feedback**: Addressed request for "cleaner UI and simpler UX" while maintaining all technical benefits
- **Testing**: Verified boundary enforcement, dynamic field generation, edge case handling all working correctly


## 📝 **DOCUMENTATION ENFORCEMENT (Detailed Checklist)**

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
