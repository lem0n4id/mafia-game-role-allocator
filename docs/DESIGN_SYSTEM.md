# Design System Documentation

This document describes the visual design system used throughout the Mafia Game Role Allocator application.

## Overview

The design system provides consistent color palettes, typography scales, sizing constants, and styling utilities to ensure visual coherence and accessibility across all components.

## Location

The design system is implemented in `src/utils/designSystem.js`.

## Color Palette

### Role Colors

#### Mafia (Red)
- **Background**: `bg-red-50` (#fef2f2)
- **Border**: `border-red-500` (#ef4444)
- **Text**: `text-red-900` (#991b1b)
- **Button**: `bg-red-600 hover:bg-red-700` (#dc2626)
- **Icon**: `text-red-600` (#dc2626)

#### Villager (Green)
- **Background**: `bg-green-50` (#f0fdf4)
- **Border**: `border-green-500` (#22c55e)
- **Text**: `text-green-900` (#14532d)
- **Button**: `bg-green-600 hover:bg-green-700` (#16a34a)
- **Icon**: `text-green-600` (#16a34a)

### State Colors

#### Current (Blue)
- **Background**: `bg-blue-50` (#eff6ff)
- **Border**: `border-blue-500` (#3b82f6)
- **Text**: `text-blue-900` (#1e3a8a)
- **Button**: `bg-blue-600 hover:bg-blue-700` (#2563eb)
- **Icon**: `text-blue-600` (#2563eb)
- **Special**: `animate-pulse` for active indicators

#### Revealed (Emerald)
- **Background**: `bg-emerald-50` (#ecfdf5)
- **Border**: `border-emerald-500` (#10b981)
- **Text**: `text-emerald-900` (#064e3b)
- **Button**: `bg-emerald-600 hover:bg-emerald-700` (#059669)
- **Icon**: `text-emerald-600` (#059669)

#### Waiting (Gray)
- **Background**: `bg-gray-50` (#f9fafb)
- **Border**: `border-gray-300` (#d1d5db)
- **Text**: `text-gray-700` (#374151)
- **Button**: `bg-gray-400 text-gray-600` (#6b7280)
- **Icon**: `text-gray-400` (#9ca3af)

#### Disabled (Gray)
- **Background**: `bg-gray-100` (#f3f4f6)
- **Border**: `border-gray-200` (#e5e7eb)
- **Text**: `text-gray-500` (#6b7280)
- **Button**: `bg-gray-300 text-gray-500` (#9ca3af)
- **Icon**: `text-gray-400` (#9ca3af)

## Typography

### Headings
- **H1**: `text-3xl font-bold` (30px)
- **H2**: `text-2xl font-bold` (24px)
- **H3**: `text-xl font-semibold` (20px)
- **H4**: `text-lg font-medium` (18px)

### Body Text
- **Body**: `text-base` (16px)
- **Body Large**: `text-lg` (18px)
- **Body Small**: `text-sm` (14px)

### UI Elements
- **Button**: `text-base font-medium` (16px)
- **Button Large**: `text-lg font-semibold` (18px)
- **Label**: `text-sm font-medium` (14px)
- **Caption**: `text-xs` (12px)

### Role Display
- **Role Title**: `text-4xl font-bold` (36px)
- **Role Name**: `text-2xl font-bold` (24px)
- **Player Name**: `text-lg font-semibold` (18px)

## Sizing & Spacing

### Touch Targets
- **Minimum**: `min-h-[44px] min-w-[44px]` (44px × 44px)
- **Button Medium**: `h-12` (48px)
- **Button Large**: `h-14` (56px)

### Cards & Containers
- **Padding**: `p-4` (16px)
- **Padding Large**: `p-6` (24px)
- **Border Radius**: `rounded-xl` (12px)

### Icons
- **Small**: `w-4 h-4` (16px)
- **Medium**: `w-5 h-5` (20px)
- **Large**: `w-6 h-6` (24px)
- **Extra Large**: `w-8 h-8` (32px)

## Utility Functions

### getRoleStyles(role)

Returns styling classes for a specific role.

```javascript
import { getRoleStyles } from '../utils/designSystem';

const styles = getRoleStyles('mafia');
// Returns: {
//   background: 'bg-red-50',
//   border: 'border-red-500',
//   text: 'text-red-900',
//   button: 'bg-red-600 hover:bg-red-700 text-white',
//   icon: 'text-red-600'
// }
```

### getStateStyles(state)

Returns styling classes for a specific state.

```javascript
import { getStateStyles } from '../utils/designSystem';

const styles = getStateStyles('current');
// Returns: {
//   background: 'bg-blue-50',
//   border: 'border-blue-500',
//   text: 'text-blue-900',
//   button: 'bg-blue-600 hover:bg-blue-700 text-white',
//   icon: 'text-blue-600',
//   pulse: 'animate-pulse'
// }
```

### getCombinedStyles(role, state)

Combines role and state styles with priority to state for interactions.

```javascript
import { getCombinedStyles } from '../utils/designSystem';

const styles = getCombinedStyles('mafia', 'current');
// Returns combined styles with state taking priority for interactions
```

## Accessibility

### Focus States
- **Focus Ring**: `focus:outline-none focus:ring-4 focus:ring-opacity-50`
- **Focus Visible**: `focus-visible:outline-none focus-visible:ring-4`

### Touch-Friendly
- **Touch Manipulation**: `touch-manipulation`
- **Minimum Target**: `min-h-[44px] min-w-[44px]`

### Screen Reader
- **Screen Reader Only**: `sr-only`

### High Contrast
- **High Contrast Mode**: `contrast-more:border-2 contrast-more:border-current`

## WCAG AA Compliance

All color combinations meet WCAG AA standards for accessibility:

- **Mafia**: 7.60:1 contrast ratio ✓
- **Villager**: 8.70:1 contrast ratio ✓
- **Current**: 9.52:1 contrast ratio ✓
- **Waiting**: 9.86:1 contrast ratio ✓

All ratios exceed the 4.5:1 requirement for normal text and 3:1 for large text.

## Usage Examples

### Using Constants

```javascript
import { TYPOGRAPHY, SIZING, COLORS } from '../utils/designSystem';

// Typography
<h1 className={TYPOGRAPHY.h1}>Game Title</h1>
<button className={`${SIZING.buttonHeight} ${TYPOGRAPHY.button}`}>
  Click Me
</button>

// Direct color access
const mafiaColor = COLORS.mafia.primary; // #dc2626
```

### Using Style Functions

```javascript
import { getRoleStyles, getStateStyles } from '../utils/designSystem';

const RoleCard = ({ role, state }) => {
  const roleStyles = getRoleStyles(role);
  const stateStyles = getStateStyles(state);
  
  return (
    <div className={`${roleStyles.background} ${stateStyles.border}`}>
      <span className={roleStyles.text}>
        {role}
      </span>
    </div>
  );
};
```

### When to Use Inline Tailwind vs Design System Helpers

**Inline Tailwind is appropriate for layout, spacing, and structural styling:**

```javascript
// ✅ Good: Layout and spacing with inline Tailwind
<div className="flex items-center justify-between p-4 rounded-xl border-2">
  <span className="text-lg font-semibold">Player Name</span>
  <button className="h-12 px-6">Action</button>
</div>
```

**Use design system helpers for role and state colors to maintain consistency:**

```javascript
// ✅ Good: Role/state colors from design system
import { getRoleStyles } from '../utils/designSystem';

const RoleCard = ({ role }) => {
  const styles = getRoleStyles(role);
  
  return (
    <div className={`flex items-center p-4 rounded-xl border-2 ${styles.background} ${styles.border}`}>
      <span className={`text-lg font-semibold ${styles.text}`}>
        {role} Player Card
      </span>
    </div>
  );
};
```

**Guideline:** Use inline Tailwind for layout/spacing, but obtain role/state colors from centralized design system helpers to ensure consistency and easy updates.

## Mobile Optimization

All styling follows mobile-first principles:

1. **Base styles** target 375px+ devices (iPhone SE and up)
2. **Responsive breakpoints**: sm:640px, md:768px, lg:1024px
3. **Touch targets**: Minimum 44px × 44px (exceeds Apple/Android guidelines)
4. **Portrait orientation**: Vertical layouts with proper spacing
5. **No horizontal scroll**: Contained widths with responsive padding

## Performance

The design system has minimal performance impact:

- **CSS Bundle**: 26.17 KB (1.48 KB increase, well under 50KB budget)
- **Build Time**: No significant change (~2.36s)
- **Runtime**: Zero JavaScript overhead (pure Tailwind utilities)
- **Transitions**: Hardware-accelerated (transform, opacity)

## Best Practices

1. **Consistency**: Use design system colors and typography for all new components
2. **Accessibility**: Always verify contrast ratios meet WCAG AA standards
3. **Mobile-First**: Start with mobile styling, add responsive variants
4. **Touch Targets**: Never go below 44px × 44px for interactive elements
5. **State Indication**: Use distinct visual cues for all interactive states
6. **Performance**: Prefer Tailwind utilities over custom CSS

## Related Documentation

- [Implementation Plan](ways-of-work/plan/minimal-styling-and-ui-clarity/visual-differentiation-system/implementation-plan.md)
- [PRD](ways-of-work/plan/minimal-styling-and-ui-clarity/visual-differentiation-system/prd.md)
- [Tailwind Config](../tailwind.config.js)
- Mobile Layout Utilities (`../src/utils/mobileLayout.js`) — *planned for future addition*
