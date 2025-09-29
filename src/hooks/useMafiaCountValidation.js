import { useState, useMemo, useCallback, useEffect } from 'react';

/**
 * Custom hook for Mafia count validation
 * Handles validation against player count, edge case detection, and error messaging
 *
 * @param {number} playerCount - Current total player count
 * @param {number} initialMafiaCount - Initial Mafia count (default: 1)
 * @returns {object} Mafia count validation state and functions
 */
export const useMafiaCountValidation = (playerCount, initialMafiaCount = 1) => {
  const [mafiaCount, setMafiaCount] = useState(initialMafiaCount);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);

  /**
   * Validation logic computed from current mafia count and player count
   */
  const validation = useMemo(() => {
    const count = parseInt(mafiaCount) || 0;
    const totalPlayers = parseInt(playerCount) || 0;

    // Basic input validation - negative numbers
    if (count < 0) {
      return {
        isValid: false,
        isEdgeCase: false,
        error: 'Mafia count cannot be negative',
        canProceed: false,
        type: 'error',
      };
    }

    // Invalid ratio - mafia >= total players
    if (count >= totalPlayers) {
      return {
        isValid: false,
        isEdgeCase: false,
        error: `Mafia count must be less than total players (${totalPlayers})`,
        canProceed: false,
        type: 'error',
      };
    }

    // Edge case: No Mafia (0 Mafia)
    if (count === 0) {
      return {
        isValid: true,
        isEdgeCase: true,
        warning: 'No Mafia players - this creates an unusual game mode',
        canProceed: true,
        requiresConfirmation: true,
        type: 'warning',
      };
    }

    // Edge case: Almost all Mafia (only 1 Villager)
    if (count === totalPlayers - 1 && totalPlayers > 2) {
      return {
        isValid: true,
        isEdgeCase: true,
        warning:
          'Almost all players are Mafia - this creates an unusual game mode',
        canProceed: true,
        requiresConfirmation: true,
        type: 'warning',
      };
    }

    // Valid standard case
    return {
      isValid: true,
      isEdgeCase: false,
      canProceed: true,
      type: 'valid',
    };
  }, [mafiaCount, playerCount]);

  /**
   * Update Mafia count with input validation
   */
  const updateMafiaCount = useCallback(newCount => {
    const count = Math.max(0, parseInt(newCount) || 0);
    setMafiaCount(count);
    setHasUserInteracted(true);
  }, []);

  /**
   * Auto-adjust when player count changes makes current mafia count invalid
   */
  useEffect(() => {
    if (mafiaCount >= playerCount && playerCount > 0) {
      const maxValid = Math.max(0, playerCount - 1);
      setMafiaCount(maxValid);
    }
  }, [playerCount, mafiaCount]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setMafiaCount(initialMafiaCount);
    setHasUserInteracted(false);
  }, [initialMafiaCount]);

  return {
    mafiaCount,
    validation,
    hasUserInteracted,
    updateMafiaCount,
    reset,
  };
};
