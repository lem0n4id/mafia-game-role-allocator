# Role Extensibility Guide

## Overview

The Mafia Game Role Allocator uses a **registry-driven architecture** that enables adding new roles with minimal code changes. The UI automatically adapts to new roles added to the role registry, eliminating manual component refactoring.

## How It Works

### Role Registry System

All role definitions are centralized in `src/utils/roleRegistry.js`. The registry stores structured metadata including:

- **Role Identifier**: Unique ID (e.g., 'MAFIA', 'POLICE', 'DOCTOR')
- **Display Name**: User-facing name (e.g., 'Mafia', 'Police', 'Doctor')
- **Team Affiliation**: 'mafia', 'special', or 'villager'
- **Color Scheme**: Tailwind CSS color tokens for UI rendering
- **Constraints**: Min/max/default counts for validation
- **Description**: Short description of role's objective
- **Priority**: Sort order for UI display

### Automatic UI Rendering

The `RoleConfigurationManager` component:

1. Reads special roles from registry via `getSpecialRoles()`
2. Renders a `RoleInput` for each role dynamically
3. Calculates villager count automatically
4. Displays role distribution summary with color-coded badges
5. Integrates validation framework for error/warning feedback

**No component code changes are needed when adding new roles.**

## Adding a New Role

### Step 1: Define Role in Registry

Add your new role to `src/utils/roleRegistry.js`:

```javascript
DETECTIVE: deepFreeze({
  id: 'DETECTIVE',
  name: 'Detective',
  team: 'special', // 'mafia', 'special', or 'villager'
  color: {
    primary: 'yellow-600',    // Main color
    secondary: 'yellow-50',   // Background
    border: 'yellow-500',     // Border
    text: 'yellow-800',       // Text
    accent: 'yellow-700'      // Accent
  },
  constraints: {
    min: 0,          // Minimum count (0 = optional)
    max: 1,          // Maximum count (Infinity = unlimited)
    default: 0       // Default/recommended count
  },
  description: 'Investigate players to discover alignment',
  priority: 4,       // Display order (lower = higher priority)
  icon: null
}),
```

### Step 2: Update Role Mapping (Optional)

If you want color-coded badges for the new role in the distribution summary, update `RoleConfigurationManager.jsx`:

```javascript
// In the badge rendering section:
else if (role.id === 'DETECTIVE') {
  badgeClassName += 'bg-yellow-50 text-yellow-800 border border-yellow-500';
}
```

**Note**: If you don't add this, the role will use the fallback gray styling.

### Step 3: Test the UI

1. **Start dev server**: `npm run dev`
2. **Verify UI**:
   - Detective input appears automatically
   - Label reads "Number of Detective Players"
   - Counter constraints match your definition (Max: 1)
   - Description displays below input
   - Role appears in distribution summary when count > 0
3. **Test validation**:
   - Try exceeding max constraint (should show error)
   - Verify villager count updates correctly
   - Check allocation flow includes Detective count

### Step 4: Update Validation (If Needed)

The validation framework automatically includes new roles in calculations. However, if your role has special rules (e.g., mutual exclusivity), add a custom validation rule in `src/utils/roleValidation.js`:

```javascript
function MutualExclusivityRule(roleConfig, totalPlayers, registry) {
  const detectiveCount = roleConfig['DETECTIVE'] || 0;
  const corruptPoliceCount = roleConfig['CORRUPT_POLICE'] || 0;
  
  if (detectiveCount > 0 && corruptPoliceCount > 0) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: 'MutualExclusivityRule',
      message: 'Detective and Corrupt Police cannot coexist in the same game',
      details: { detectiveCount, corruptPoliceCount }
    };
  }
  
  return null; // Rule passes
}

// Add to validation rules array
VALIDATION_RULES.push(MutualExclusivityRule);
```

### Step 5: Update Assignment Engine (If Needed)

The assignment engine (`src/utils/roleAssignmentEngine.js`) automatically handles role configuration objects. No changes needed for basic role addition.

For advanced role logic (e.g., role abilities, night actions), extend the assignment metadata or game flow components separately.

## UI Extensibility Examples

### Example 1: Adding Detective (Simple Role)

**Registry Addition**:
```javascript
DETECTIVE: deepFreeze({
  id: 'DETECTIVE',
  name: 'Detective',
  team: 'special',
  color: { primary: 'yellow-600', secondary: 'yellow-50', border: 'yellow-500', text: 'yellow-800', accent: 'yellow-700' },
  constraints: { min: 0, max: 1, default: 0 },
  description: 'Investigate players each night',
  priority: 4,
  icon: null
}),
```

**Result**: Detective input appears automatically in UI with all constraints and descriptions. No other code changes needed.

### Example 2: Adding Godfather (Mafia Team)

**Registry Addition**:
```javascript
GODFATHER: deepFreeze({
  id: 'GODFATHER',
  name: 'Godfather',
  team: 'mafia', // Same team as Mafia
  color: { primary: 'red-700', secondary: 'red-100', border: 'red-600', text: 'red-900', accent: 'red-800' },
  constraints: { min: 0, max: 1, default: 0 },
  description: 'Lead the Mafia team, immune to investigation',
  priority: 2, // Higher priority than regular Mafia
  icon: null
}),
```

**Result**: Godfather input appears as special role. Validation automatically includes it in mafia team calculations.

### Example 3: Adding Jester (Unique Win Condition)

**Registry Addition**:
```javascript
JESTER: deepFreeze({
  id: 'JESTER',
  name: 'Jester',
  team: 'special',
  color: { primary: 'purple-600', secondary: 'purple-50', border: 'purple-500', text: 'purple-800', accent: 'purple-700' },
  constraints: { min: 0, max: 1, default: 0 },
  description: 'Win by getting voted out',
  priority: 5,
  icon: null
}),
```

**Result**: Jester input appears in UI. For custom win conditions, extend game flow logic separately (not covered in this guide).

## Architecture Benefits

### Zero UI Code Changes

- **Before**: Adding a role required creating new components, updating layouts, adding validation hooks
- **After**: Add role to registry → UI adapts automatically

### Consistent UX

- All roles use the same input pattern (CounterControl)
- All roles display constraints and descriptions consistently
- All roles integrate with validation framework uniformly

### Maintainable Codebase

- Single source of truth for role metadata
- No component duplication for similar roles
- Validation rules read registry dynamically

### Performance Optimized

- Components memoized with React.memo
- State updates debounced (100ms)
- Minimal re-renders with useCallback/useMemo

## Limitations

### Static Badge Colors

The role distribution summary uses static Tailwind classes for badge colors. Adding a new role requires updating the badge mapping in `RoleConfigurationManager.jsx` to display custom colors. Otherwise, the fallback gray styling is used.

**Reason**: Tailwind's purge process cannot detect dynamically generated class names at build time.

### Three-Role Team Model

The current architecture supports three teams: 'mafia', 'special', 'villager'. Expanding to more teams (e.g., 'neutral', 'cult') requires updates to:

- Role registry team validation
- Validation framework team calculations
- Assignment engine team distribution logic

### No Advanced Constraints

The registry supports basic min/max constraints. Advanced constraints (e.g., "Detective requires at least 1 Police") require custom validation rules.

## Testing Checklist

When adding a new role, verify:

- [ ] Role appears in UI automatically
- [ ] Label reads "Number of [RoleName] Players"
- [ ] Counter controls respect min/max constraints
- [ ] Description displays below input
- [ ] Role appears in distribution summary when count > 0
- [ ] Villager count updates correctly
- [ ] Validation errors display for invalid configurations
- [ ] Allocation flow includes new role count
- [ ] Assignment engine assigns role correctly
- [ ] Role reveal displays role name and description

## Future Enhancements

### Dynamic Badge Colors

Investigate using CSS custom properties or Tailwind safelist to enable fully dynamic badge colors without manual mapping.

### Role Icon Support

The registry includes an `icon` field (currently unused). Future versions could render role-specific icons in the UI.

### Role Abilities

Extend the role metadata to include abilities (e.g., "Can investigate one player per night") for richer UI descriptions and game logic integration.

### Role Categories

Group roles by category (e.g., "Investigative", "Protective", "Deceptive") for better UI organization with large role sets.

## Summary

The Role Configuration UI System delivers on the extensibility promise:

1. **Add role to registry** (single file edit)
2. **UI renders automatically** (zero component changes)
3. **Validation works** (framework reads registry)
4. **Assignment includes role** (engine supports role config)

This architecture enables rapid role expansion while maintaining code quality and UX consistency.
