import React from 'react';
import PropTypes from 'prop-types';
import { useMafiaCountValidation } from '../hooks/useMafiaCountValidation.js';

/**
 * MafiaCountValidator component
 * Provides Mafia count input with real-time validation against player count
 * Handles edge cases, error messaging, and form integration
 */
const MafiaCountValidator = ({
  playerCount,
  initialMafiaCount = 1,
  onMafiaCountChange,
  onValidationChange,
}) => {
  const {
    mafiaCount,
    validation,
    hasUserInteracted,
    updateMafiaCount,
  } = useMafiaCountValidation(playerCount, initialMafiaCount);

  // Notify parent components of changes
  React.useEffect(() => {
    onMafiaCountChange?.(mafiaCount);
  }, [mafiaCount, onMafiaCountChange]);

  React.useEffect(() => {
    onValidationChange?.(validation);
  }, [validation, onValidationChange]);

  /**
   * Handle Mafia count input changes with validation
   */
  const handleMafiaCountChange = e => {
    const value = e.target.value;
    // Allow empty input for user convenience
    if (value === '') {
      updateMafiaCount(0);
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      updateMafiaCount(numValue);
    }
  };

  // Determine when to show error/warning messages
  const shouldShowError = hasUserInteracted && !validation.isValid;
  const shouldShowWarning = validation.isEdgeCase && validation.warning;

  return (
    <div className="space-y-2">
      {/* Mafia Count Input */}
      <div>
        <label
          htmlFor="mafiaCount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of Mafia Players
        </label>
        <input
          id="mafiaCount"
          type="number"
          min="0"
          max={Math.max(0, playerCount - 1)}
          value={mafiaCount}
          onChange={handleMafiaCountChange}
          className={`
            w-full h-12 px-4
            border-2 rounded-lg
            text-lg font-medium
            touch-manipulation
            focus:outline-none
            transition-colors duration-200
            ${
              shouldShowError
                ? 'border-red-300 focus:border-red-500'
                : shouldShowWarning
                ? 'border-yellow-300 focus:border-yellow-500'
                : 'border-gray-300 focus:border-blue-500'
            }
          `}
          aria-describedby={
            shouldShowError
              ? 'mafia-error'
              : shouldShowWarning
              ? 'mafia-warning'
              : undefined
          }
        />

        {/* Error Messages */}
        {shouldShowError && (
          <p
            id="mafia-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {validation.error}
          </p>
        )}

        {/* Warning Messages for Edge Cases */}
        {shouldShowWarning && (
          <p
            id="mafia-warning"
            className="mt-1 text-sm text-yellow-600"
            role="alert"
          >
            <span className="inline-flex items-center">
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              {validation.warning}
            </span>
          </p>
        )}
      </div>

      {/* Helpful Context */}
      <div className="text-xs text-gray-500">
        Valid range: 0 to {Math.max(0, playerCount - 1)} Mafia players
        {playerCount > 0 && (
          <span className="ml-2">
            ({playerCount - mafiaCount} Villagers)
          </span>
        )}
      </div>
    </div>
  );
};

MafiaCountValidator.propTypes = {
  playerCount: PropTypes.number.isRequired,
  initialMafiaCount: PropTypes.number,
  onMafiaCountChange: PropTypes.func,
  onValidationChange: PropTypes.func,
};

export default MafiaCountValidator;