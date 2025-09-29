import { useState, useCallback, useMemo } from 'react';

/**
 * Custom hook for managing player count and associated name fields
 * Handles dynamic field generation, value preservation, and validation
 *
 * @param {number} initialCount - Initial player count (default: 5)
 * @param {string[]} initialNames - Initial name values (default: [])
 * @returns {object} Player count management state and functions
 */
export const usePlayerCountManager = (initialCount = 5, initialNames = []) => {
  const [playerCount, setPlayerCount] = useState(initialCount);
  const [names, setNames] = useState(
    Array(initialCount)
      .fill('')
      .map((_, i) => initialNames[i] || '')
  );

  /**
   * Update player count and resize names array accordingly
   * Preserves existing values and adds empty slots for new fields
   */
  const updatePlayerCount = useCallback(newCount => {
    const count = Math.max(1, Math.min(30, parseInt(newCount) || 1));
    setPlayerCount(count);

    setNames(prev => {
      const newNames = [...prev];
      newNames.length = count; // Resize array to new count
      return newNames.map(name => name || ''); // Fill empty slots
    });
  }, []);

  /**
   * Update individual player name at specific index
   */
  const updatePlayerName = useCallback((index, name) => {
    setNames(prev => prev.map((n, i) => (i === index ? name : n)));
  }, []);

  /**
   * Validation state computed from current player count and names
   */
  const validation = useMemo(() => {
    const hasBlankNames = names.some(name => !name.trim());
    const validCount = playerCount >= 1 && playerCount <= 30;

    return {
      isValid: !hasBlankNames && validCount,
      hasBlankNames,
      validCount,
      errors: {
        count: !validCount ? 'Player count must be between 1 and 30' : null,
        names: hasBlankNames ? 'All player names are required' : null,
      },
    };
  }, [names, playerCount]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setPlayerCount(initialCount);
    setNames(Array(initialCount).fill(''));
  }, [initialCount]);

  return {
    playerCount,
    names,
    validation,
    updatePlayerCount,
    updatePlayerName,
    reset,
  };
};
