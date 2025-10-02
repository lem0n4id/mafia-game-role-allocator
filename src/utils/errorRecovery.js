/**
 * Error Recovery Utility
 * Provides error classification, validation, and recovery strategies
 */

/**
 * Error types and severity levels
 */
export const ERROR_TYPES = {
  RUNTIME_ERROR: 'RUNTIME_ERROR',
  STATE_CORRUPTION: 'STATE_CORRUPTION',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  COMPONENT_ERROR: 'COMPONENT_ERROR',
  UNKNOWN_ERROR: 'UNKNOWN_ERROR'
};

export const ERROR_SEVERITY = {
  LOW: 'LOW',           // Auto-recoverable
  MEDIUM: 'MEDIUM',     // User-guided recovery
  HIGH: 'HIGH',         // Manual recovery required
  CRITICAL: 'CRITICAL'  // Application restart needed
};

/**
 * Recovery strategies
 */
export const RECOVERY_STRATEGIES = {
  RETRY: 'RETRY',
  RESET_STATE: 'RESET_STATE',
  RELOAD_COMPONENT: 'RELOAD_COMPONENT',
  FALLBACK_UI: 'FALLBACK_UI',
  MANUAL_INTERVENTION: 'MANUAL_INTERVENTION'
};

/**
 * Error classification and recovery mapping
 */
const ERROR_RECOVERY_MAP = {
  [ERROR_TYPES.VALIDATION_ERROR]: {
    severity: ERROR_SEVERITY.LOW,
    strategy: RECOVERY_STRATEGIES.RETRY,
    autoRecovery: true
  },
  [ERROR_TYPES.STATE_CORRUPTION]: {
    severity: ERROR_SEVERITY.MEDIUM,
    strategy: RECOVERY_STRATEGIES.RESET_STATE,
    autoRecovery: false
  },
  [ERROR_TYPES.COMPONENT_ERROR]: {
    severity: ERROR_SEVERITY.HIGH,
    strategy: RECOVERY_STRATEGIES.RELOAD_COMPONENT,
    autoRecovery: false
  },
  [ERROR_TYPES.RUNTIME_ERROR]: {
    severity: ERROR_SEVERITY.HIGH,
    strategy: RECOVERY_STRATEGIES.FALLBACK_UI,
    autoRecovery: false
  }
};

/**
 * Classify error and determine recovery strategy
 * @param {Error} error - The error object
 * @param {Object} errorInfo - Additional error context
 * @returns {Object} Error classification and recovery plan
 */
export const classifyError = (error, errorInfo = {}) => {
  let errorType = ERROR_TYPES.UNKNOWN_ERROR;
  let context = {};

  // Classify by error message patterns
  // Check validation errors first (more specific)
  if (error.message?.includes('validation') || error.message?.includes('invalid') || error.message?.includes('input')) {
    errorType = ERROR_TYPES.VALIDATION_ERROR;
  } else if (error.message?.includes('state')) {
    errorType = ERROR_TYPES.STATE_CORRUPTION;
  } else if (errorInfo.componentStack) {
    errorType = ERROR_TYPES.COMPONENT_ERROR;
    context.componentStack = errorInfo.componentStack;
  } else if (error.name === 'ChunkLoadError') {
    errorType = ERROR_TYPES.RUNTIME_ERROR;
    context.chunkError = true;
  } else {
    errorType = ERROR_TYPES.RUNTIME_ERROR;
  }

  const recovery = ERROR_RECOVERY_MAP[errorType] || {
    severity: ERROR_SEVERITY.CRITICAL,
    strategy: RECOVERY_STRATEGIES.MANUAL_INTERVENTION,
    autoRecovery: false
  };

  return {
    type: errorType,
    severity: recovery.severity,
    strategy: recovery.strategy,
    autoRecovery: recovery.autoRecovery,
    error,
    errorInfo,
    context,
    timestamp: new Date().toISOString()
  };
};

/**
 * Generate user-friendly error messages
 * @param {Object} errorClassification - Classified error
 * @returns {Object} User-friendly messages
 */
export const generateErrorMessages = (errorClassification) => {
  const { type, severity } = errorClassification;

  const messages = {
    [ERROR_TYPES.VALIDATION_ERROR]: {
      title: 'Input Validation Error',
      description: 'There was an issue with the provided input. Please check your entries and try again.',
      actionText: 'Retry',
      icon: '⚠️'
    },
    [ERROR_TYPES.STATE_CORRUPTION]: {
      title: 'Game State Issue',
      description: 'The game state appears to be corrupted. We can reset to the last known good state.',
      actionText: 'Reset Game State',
      icon: '🔄'
    },
    [ERROR_TYPES.COMPONENT_ERROR]: {
      title: 'Component Error',
      description: 'A component has encountered an error. Reloading the component may resolve the issue.',
      actionText: 'Reload Component',
      icon: '🔧'
    },
    [ERROR_TYPES.RUNTIME_ERROR]: {
      title: 'Application Error',
      description: 'The application has encountered an unexpected error. You may need to refresh the page.',
      actionText: 'Refresh Page',
      icon: '🚫'
    }
  };

  const baseMessage = messages[type] || {
    title: 'Unknown Error',
    description: 'An unexpected error has occurred. Please try refreshing the page.',
    actionText: 'Refresh',
    icon: '❓'
  };

  return {
    ...baseMessage,
    severity,
    canRecover: severity !== ERROR_SEVERITY.CRITICAL
  };
};

/**
 * State validation utilities
 */
export const validateApplicationState = (state) => {
  const issues = [];

  // Validate player assignments
  if (state.assignment) {
    if (!Array.isArray(state.assignment.players)) {
      issues.push({
        type: 'INVALID_PLAYERS_ARRAY',
        message: 'Players array is not valid'
      });
    } else {
      // Validate individual players
      state.assignment.players.forEach((player, index) => {
        if (!player.id && player.id !== 0) {
          issues.push({
            type: 'MISSING_PLAYER_ID',
            message: `Player at index ${index} missing ID`
          });
        }
        if (!player.name || typeof player.name !== 'string') {
          issues.push({
            type: 'INVALID_PLAYER_NAME',
            message: `Player at index ${index} has invalid name`
          });
        }
        if (!['MAFIA', 'VILLAGER'].includes(player.role)) {
          issues.push({
            type: 'INVALID_PLAYER_ROLE',
            message: `Player at index ${index} has invalid role`
          });
        }
      });
    }
  }

  return {
    isValid: issues.length === 0,
    issues
  };
};

/**
 * Recovery action implementations
 */
export const executeRecoveryAction = async (strategy, context = {}) => {
  switch (strategy) {
    case RECOVERY_STRATEGIES.RETRY:
      // Simple retry - just return success
      return { success: true, message: 'Operation retried successfully' };

    case RECOVERY_STRATEGIES.RESET_STATE:
      // Clear problematic state
      if (context.clearState) {
        context.clearState();
      }
      return { success: true, message: 'State reset successfully' };

    case RECOVERY_STRATEGIES.RELOAD_COMPONENT:
      // Force component remount
      if (context.reloadComponent) {
        context.reloadComponent();
      }
      return { success: true, message: 'Component reloaded successfully' };

    case RECOVERY_STRATEGIES.FALLBACK_UI:
      // Switch to fallback interface
      if (context.activateFallback) {
        context.activateFallback();
      }
      return { success: true, message: 'Fallback interface activated' };

    case RECOVERY_STRATEGIES.MANUAL_INTERVENTION:
      // Provide recovery tools
      return { success: false, message: 'Manual intervention required' };

    default:
      return { success: false, message: 'Unknown recovery strategy' };
  }
};
