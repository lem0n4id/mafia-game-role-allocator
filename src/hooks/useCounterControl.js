import { useCallback, useMemo } from 'react';

/**
 * useCounterControl hook
 * Provides state management and boundary validation for counter controls
 * Handles increment/decrement operations with min/max constraints
 */
export const useCounterControl = (value, min, max, onChange) => {
  // Calculate boundary states
  const canIncrement = useMemo(() => value < max, [value, max]);
  const canDecrement = useMemo(() => value > min, [value, min]);

  // Handle increment operation
  const increment = useCallback(() => {
    if (canIncrement && onChange) {
      onChange(value + 1);
    }
  }, [value, canIncrement, onChange]);

  // Handle decrement operation
  const decrement = useCallback(() => {
    if (canDecrement && onChange) {
      onChange(value - 1);
    }
  }, [value, canDecrement, onChange]);

  // Handle keyboard events for accessibility
  const handleKeyDown = useCallback(
    (event) => {
      switch (event.key) {
        case 'ArrowUp':
          event.preventDefault();
          increment();
          break;
        case 'ArrowDown':
          event.preventDefault();
          decrement();
          break;
        default:
          break;
      }
    },
    [increment, decrement]
  );

  return {
    increment,
    decrement,
    canIncrement,
    canDecrement,
    handleKeyDown,
  };
};