/**
 * Edge Case Validation Utility
 * Provides comprehensive validation for unusual game configurations
 * Handles boundary cases, edge cases, and generates user-friendly messages
 */

/**
 * Edge case types and categories
 */
export const EDGE_CASE_TYPES = {
  NO_MAFIA: 'NO_MAFIA',
  ALL_MAFIA: 'ALL_MAFIA',
  ALMOST_ALL_MAFIA: 'ALMOST_ALL_MAFIA',
  LARGE_GROUP: 'LARGE_GROUP',
  SMALL_GROUP: 'SMALL_GROUP',
  INVALID_INPUT: 'INVALID_INPUT',
};

export const VALIDATION_SEVERITY = {
  ERROR: 'ERROR', // Blocks proceeding
  WARNING: 'WARNING', // Requires confirmation
  INFO: 'INFO', // Informational only
};

/**
 * Configuration thresholds
 */
const THRESHOLDS = {
  MIN_PLAYERS: 1,
  MAX_PLAYERS: 50,
  LARGE_GROUP_SIZE: 20,
  SMALL_GROUP_SIZE: 3,
  PERFORMANCE_WARNING_SIZE: 30,
};

/**
 * Validate mafia count against player count
 * @param {number} mafiaCount - Number of mafia players
 * @param {number} totalPlayers - Total number of players
 * @returns {Object} Validation result with details
 */
export const validateMafiaCount = (mafiaCount, totalPlayers) => {
  // Basic input validation
  if (typeof mafiaCount !== 'number' || typeof totalPlayers !== 'number') {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: EDGE_CASE_TYPES.INVALID_INPUT,
      message: 'Mafia count and total players must be numbers',
      canProceed: false,
      requiresConfirmation: false,
      isEdgeCase: false,
    };
  }

  if (!Number.isInteger(mafiaCount) || !Number.isInteger(totalPlayers)) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: EDGE_CASE_TYPES.INVALID_INPUT,
      message: 'Mafia count and total players must be whole numbers',
      canProceed: false,
      requiresConfirmation: false,
      isEdgeCase: false,
    };
  }

  // Range validation
  if (mafiaCount < 0) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: EDGE_CASE_TYPES.INVALID_INPUT,
      message: 'Mafia count cannot be negative',
      canProceed: false,
      requiresConfirmation: false,
      isEdgeCase: false,
    };
  }

  if (totalPlayers < THRESHOLDS.MIN_PLAYERS) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: EDGE_CASE_TYPES.SMALL_GROUP,
      message: `Need at least ${THRESHOLDS.MIN_PLAYERS} player to play`,
      canProceed: false,
      requiresConfirmation: false,
      isEdgeCase: false,
    };
  }

  if (totalPlayers > THRESHOLDS.MAX_PLAYERS) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: EDGE_CASE_TYPES.LARGE_GROUP,
      message: `Maximum ${THRESHOLDS.MAX_PLAYERS} players supported`,
      canProceed: false,
      requiresConfirmation: false,
      isEdgeCase: false,
    };
  }

  if (mafiaCount > totalPlayers) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: EDGE_CASE_TYPES.INVALID_INPUT,
      message: 'Mafia count cannot exceed total players',
      canProceed: false,
      requiresConfirmation: false,
      isEdgeCase: false,
    };
  }

  // Edge case detection
  const edgeCase = detectEdgeCase(mafiaCount, totalPlayers);

  if (edgeCase) {
    return {
      isValid: true,
      severity: VALIDATION_SEVERITY.WARNING,
      type: edgeCase.type,
      message: edgeCase.message,
      explanation: edgeCase.explanation,
      gameplayImpact: edgeCase.gameplayImpact,
      canProceed: true,
      requiresConfirmation: true,
      isEdgeCase: true,
    };
  }

  // Standard valid configuration
  return {
    isValid: true,
    severity: VALIDATION_SEVERITY.INFO,
    type: null,
    message: 'Valid game configuration',
    canProceed: true,
    requiresConfirmation: false,
    isEdgeCase: false,
  };
};

/**
 * Detect specific edge cases
 * @param {number} mafiaCount - Number of mafia players
 * @param {number} totalPlayers - Total number of players
 * @returns {Object|null} Edge case details or null if standard
 */
const detectEdgeCase = (mafiaCount, totalPlayers) => {
  // No Mafia (all Villagers)
  if (mafiaCount === 0) {
    return {
      type: EDGE_CASE_TYPES.NO_MAFIA,
      message: 'No Mafia players (all Villagers)',
      explanation:
        'This game will have only Villager roles. Consider if this provides the intended game experience.',
      gameplayImpact: 'No elimination phase or deduction gameplay.',
    };
  }

  // All Mafia
  if (mafiaCount === totalPlayers) {
    return {
      type: EDGE_CASE_TYPES.ALL_MAFIA,
      message: 'All players are Mafia',
      explanation:
        'Every player will receive the Mafia role. This creates an unusual game dynamic.',
      gameplayImpact: 'No Villagers to eliminate or deceive.',
    };
  }

  // Almost all Mafia (only 1 Villager)
  if (mafiaCount === totalPlayers - 1 && totalPlayers > 2) {
    return {
      type: EDGE_CASE_TYPES.ALMOST_ALL_MAFIA,
      message: 'Only one Villager player',
      explanation:
        'This configuration has only one Villager among all players. This may create an unbalanced game.',
      gameplayImpact: 'Heavily favors Mafia with minimal Villager resistance.',
    };
  }

  // Large group performance warning
  if (totalPlayers > THRESHOLDS.PERFORMANCE_WARNING_SIZE) {
    return {
      type: EDGE_CASE_TYPES.LARGE_GROUP,
      message: 'Large group size',
      explanation: `With ${totalPlayers} players, the game interface may become crowded on mobile devices.`,
      gameplayImpact:
        'Consider splitting into multiple smaller games for better experience.',
    };
  }

  // Small group gameplay warning
  if (totalPlayers < THRESHOLDS.SMALL_GROUP_SIZE) {
    return {
      type: EDGE_CASE_TYPES.SMALL_GROUP,
      message: 'Very small group size',
      explanation: `With only ${totalPlayers} players, the game may lack the social dynamics typical of Mafia.`,
      gameplayImpact: 'Limited deduction and social interaction opportunities.',
    };
  }

  return null;
};

/**
 * Generate user-friendly messages for edge cases
 * @param {Object} validation - Validation result
 * @returns {Object} Formatted messages for UI display
 */
export const formatValidationMessages = validation => {
  if (!validation) return null;

  const baseMessage = {
    title: validation.message,
    description: validation.explanation || '',
    severity: validation.severity,
  };

  switch (validation.type) {
    case EDGE_CASE_TYPES.NO_MAFIA:
      return {
        ...baseMessage,
        icon: '👥',
        actionText: 'Proceed with all Villagers',
        warningText:
          'This will be a cooperative game without elimination mechanics.',
      };

    case EDGE_CASE_TYPES.ALL_MAFIA:
      return {
        ...baseMessage,
        icon: '🎭',
        actionText: 'Proceed with all Mafia',
        warningText:
          'This creates a unique game variant without traditional roles.',
      };

    case EDGE_CASE_TYPES.ALMOST_ALL_MAFIA:
      return {
        ...baseMessage,
        icon: '⚖️',
        actionText: 'Proceed with unbalanced roles',
        warningText:
          'Consider adding more Villagers for better game balance.',
      };

    case EDGE_CASE_TYPES.LARGE_GROUP:
      return {
        ...baseMessage,
        icon: '👨‍👩‍👧‍👦',
        actionText: 'Proceed with large group',
        warningText: 'Mobile interface may be crowded with many players.',
      };

    case EDGE_CASE_TYPES.SMALL_GROUP:
      return {
        ...baseMessage,
        icon: '🎲',
        actionText: 'Proceed with small group',
        warningText:
          'Game may lack typical Mafia social dynamics with few players.',
      };

    default:
      return {
        ...baseMessage,
        icon: '⚠️',
        actionText: 'Proceed',
        warningText: validation.explanation || '',
      };
  }
};

/**
 * Validate complete game configuration including player names
 * @param {string[]} playerNames - Array of player names
 * @param {number} mafiaCount - Number of mafia players
 * @returns {Object} Complete validation result
 */
export const validateGameConfiguration = (playerNames, mafiaCount) => {
  // Filter out blank names for validation
  const validNames = playerNames.filter(name => name && name.trim());

  // Check for blank names
  if (validNames.length !== playerNames.length) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: EDGE_CASE_TYPES.INVALID_INPUT,
      message: 'All player names are required',
      explanation: 'Please fill in all player name fields before proceeding.',
      canProceed: false,
      requiresConfirmation: false,
      isEdgeCase: false,
    };
  }

  // Validate mafia count against actual player count
  return validateMafiaCount(mafiaCount, validNames.length);
};
