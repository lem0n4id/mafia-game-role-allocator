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
  const [touchedFields, setTouchedFields] = useState(new Set());

  /**
   * Update player count and resize names array accordingly
   * Preserves existing values and adds empty slots for new fields
   */
  const updatePlayerCount = useCallback(newCount => {
    const count = Math.max(1, Math.min(30, parseInt(newCount) || 1));
    setPlayerCount(count);

    setNames(prev => {
      const newNames = [...prev];
      
      // If expanding array, add empty strings for new slots
      while (newNames.length < count) {
        newNames.push('');
      }
      
      // If shrinking array, truncate to new count
      if (newNames.length > count) {
        newNames.length = count;
      }
      
      return newNames;
    });
  }, []);

  /**
   * Update individual player name at specific index
   */
  const updatePlayerName = useCallback((index, name) => {
    setNames(prev => prev.map((n, i) => (i === index ? name : n)));
  }, []);

  /**
   * Mark a field as touched (user has interacted with it)
   */
  const markFieldTouched = useCallback((index) => {
    setTouchedFields(prev => new Set([...prev, index]));
  }, []);

  /**
   * Validation state computed from current player count and names
   */
  const validation = useMemo(() => {
    const blankFields = [];
    const completedFields = [];
    
    names.forEach((name, index) => {
      if (!name.trim()) {
        blankFields.push(index);
      } else {
        completedFields.push(index);
      }
    });
    
    const hasBlankNames = blankFields.length > 0;
    const validCount = playerCount >= 1 && playerCount <= 30;
    const completionRate = names.length > 0 ? completedFields.length / names.length : 0;

    return {
      isValid: !hasBlankNames && validCount,
      hasBlankNames,
      validCount,
      blankFields,
      completedFields,
      completionRate,
      blankCount: blankFields.length,
      completedCount: completedFields.length,
      errors: {
        count: !validCount ? 'Player count must be between 1 and 30' : null,
        names: hasBlankNames ? 'All player names are required' : null,
        message: hasBlankNames ? `${blankFields.length} player name${blankFields.length > 1 ? 's' : ''} required` : null,
        fields: blankFields
      },
    };
  }, [names, playerCount]);

  /**
   * Reset to initial state
   */
  const reset = useCallback(() => {
    setPlayerCount(initialCount);
    setNames(Array(initialCount).fill(''));
    setTouchedFields(new Set());
  }, [initialCount]);

  return {
    playerCount,
    names,
    validation,
    touchedFields,
    updatePlayerCount,
    updatePlayerName,
    markFieldTouched,
    reset,
  };
};
