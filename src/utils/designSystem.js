/**
 * Design System Utilities
 * Centralized color palettes, typography, spacing, and styling utilities
 * for consistent visual differentiation across the application
 */

/**
 * Color palette with role and state mappings
 */
export const COLORS = {
  // Role colors
  mafia: {
    primary: '#dc2626', // red-600
    secondary: '#fef2f2', // red-50
    border: '#ef4444', // red-500
    text: '#991b1b', // red-800
    accent: '#b91c1c', // red-700
  },
  villager: {
    primary: '#16a34a', // green-600
    secondary: '#f0fdf4', // green-50
    border: '#22c55e', // green-500
    text: '#14532d', // green-800
    accent: '#15803d', // green-700
  },

  // State colors
  current: {
    primary: '#2563eb', // blue-600
    secondary: '#eff6ff', // blue-50
    border: '#3b82f6', // blue-500
    text: '#1e3a8a', // blue-800
    accent: '#1d4ed8', // blue-700
  },
  waiting: {
    primary: '#6b7280', // gray-500
    secondary: '#f9fafb', // gray-50
    border: '#d1d5db', // gray-300
    text: '#374151', // gray-700
    accent: '#4b5563', // gray-600
  },
  revealed: {
    primary: '#059669', // emerald-600
    secondary: '#ecfdf5', // emerald-50
    border: '#10b981', // emerald-500
    text: '#064e3b', // emerald-800
    accent: '#047857', // emerald-700
  },
  disabled: {
    primary: '#9ca3af', // gray-400
    secondary: '#f3f4f6', // gray-100
    border: '#e5e7eb', // gray-200
    text: '#6b7280', // gray-500
    accent: '#9ca3af', // gray-400
  },
};

/**
 * Typography scale
 */
export const TYPOGRAPHY = {
  // Headings
  h1: 'text-3xl font-bold',
  h2: 'text-2xl font-bold',
  h3: 'text-xl font-semibold',
  h4: 'text-lg font-medium',

  // Body text
  body: 'text-base',
  bodyLarge: 'text-lg',
  bodySmall: 'text-sm',

  // UI text
  button: 'text-base font-medium',
  buttonLarge: 'text-lg font-semibold',
  label: 'text-sm font-medium',
  caption: 'text-xs',

  // Role display
  roleTitle: 'text-4xl font-bold',
  roleName: 'text-2xl font-bold',
  playerName: 'text-lg font-semibold',
};

/**
 * Spacing and sizing constants
 */
export const SIZING = {
  // Touch targets
  touchTarget: 'min-h-[44px] min-w-[44px]',
  buttonHeight: 'h-12',
  buttonHeightLarge: 'h-14',

  // Cards and containers
  cardPadding: 'p-4',
  cardPaddingLarge: 'p-6',
  cardRadius: 'rounded-xl',

  // Icons
  iconSmall: 'w-4 h-4',
  iconMedium: 'w-5 h-5',
  iconLarge: 'w-6 h-6',
  iconXLarge: 'w-8 h-8',
};

/**
 * Get role-based styling classes
 */
export const getRoleStyles = (role) => {
  const roleKey = role?.toLowerCase?.() || '';

  switch (roleKey) {
    case 'mafia':
      return {
        background: 'bg-red-50',
        border: 'border-red-500',
        text: 'text-red-900',
        button: 'bg-red-600 hover:bg-red-700 text-white',
        icon: 'text-red-600',
      };
    case 'villager':
      return {
        background: 'bg-green-50',
        border: 'border-green-500',
        text: 'text-green-900',
        button: 'bg-green-600 hover:bg-green-700 text-white',
        icon: 'text-green-600',
      };
    default:
      return {
        background: 'bg-gray-50',
        border: 'border-gray-300',
        text: 'text-gray-700',
        button: 'bg-gray-600 hover:bg-gray-700 text-white',
        icon: 'text-gray-500',
      };
  }
};

/**
 * Get state-based styling classes
 */
export const getStateStyles = (state) => {
  switch (state) {
    case 'current':
      return {
        background: 'bg-blue-50',
        border: 'border-blue-500',
        text: 'text-blue-900',
        button: 'bg-blue-600 hover:bg-blue-700 text-white',
        icon: 'text-blue-600',
        pulse: 'animate-pulse',
      };
    case 'revealed':
      return {
        background: 'bg-emerald-50',
        border: 'border-emerald-500',
        text: 'text-emerald-900',
        button: 'bg-emerald-600 hover:bg-emerald-700 text-white',
        icon: 'text-emerald-600',
      };
    case 'waiting':
      return {
        background: 'bg-gray-50',
        border: 'border-gray-300',
        text: 'text-gray-700',
        button: 'bg-gray-400 text-gray-600 cursor-not-allowed',
        icon: 'text-gray-400',
      };
    case 'disabled':
      return {
        background: 'bg-gray-100',
        border: 'border-gray-200',
        text: 'text-gray-500',
        button: 'bg-gray-300 text-gray-500 cursor-not-allowed',
        icon: 'text-gray-400',
      };
    default:
      return {
        background: 'bg-white',
        border: 'border-gray-200',
        text: 'text-gray-900',
        button: 'bg-gray-600 hover:bg-gray-700 text-white',
        icon: 'text-gray-600',
      };
  }
};

/**
 * Combine role and state styles with priority to state
 */
export const getCombinedStyles = (role, state) => {
  const roleStyles = getRoleStyles(role);
  const stateStyles = getStateStyles(state);

  // State takes priority for interactions
  return {
    ...roleStyles,
    ...stateStyles,
    // Combine backgrounds if needed
    background:
      state === 'current' ? stateStyles.background : roleStyles.background,
  };
};

/**
 * Accessibility utilities
 */
export const ACCESSIBILITY = {
  // Focus styles
  focusRing: 'focus:outline-none focus:ring-4 focus:ring-opacity-50',
  focusVisible: 'focus-visible:outline-none focus-visible:ring-4',

  // Screen reader only text
  srOnly: 'sr-only',

  // Touch-friendly sizing
  touchFriendly: 'min-h-[44px] min-w-[44px] touch-manipulation',

  // High contrast mode support
  highContrast: 'contrast-more:border-2 contrast-more:border-current',
};
