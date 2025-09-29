import React from 'react';
import PropTypes from 'prop-types';
import { usePlayerCountManager } from '../hooks/usePlayerCountManager.js';

/**
 * PlayerCountManager component
 * Provides dynamic player count input with auto-generated name fields
 * Handles field addition/removal, value preservation, and validation
 */
const PlayerCountManager = ({
  initialCount = 5,
  initialNames = [],
  onCountChange,
  onNamesChange,
  onValidationChange,
}) => {
  const {
    playerCount,
    names,
    validation,
    updatePlayerCount,
    updatePlayerName,
  } = usePlayerCountManager(initialCount, initialNames);

  // Notify parent components of changes
  React.useEffect(() => {
    onCountChange?.(playerCount);
  }, [playerCount, onCountChange]);

  React.useEffect(() => {
    onNamesChange?.(names);
  }, [names, onNamesChange]);

  React.useEffect(() => {
    onValidationChange?.(validation);
  }, [validation, onValidationChange]);

  /**
   * Handle player count input changes with validation
   */
  const handleCountChange = e => {
    const value = e.target.value;
    // Allow empty input for user convenience
    if (value === '') {
      updatePlayerCount(1);
      return;
    }

    const numValue = parseInt(value);
    if (!isNaN(numValue)) {
      updatePlayerCount(numValue);
    }
  };

  /**
   * Handle individual name field changes
   */
  const handleNameChange = (index, value) => {
    updatePlayerName(index, value);
  };

  return (
    <div className="space-y-6">
      {/* Player Count Input Section */}
      <div>
        <label
          htmlFor="playerCount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of Players
        </label>
        <input
          id="playerCount"
          type="number"
          min="1"
          max="30"
          value={playerCount}
          onChange={handleCountChange}
          className={`
            w-full h-12 px-4
            border-2 rounded-lg
            text-lg font-medium
            touch-manipulation
            focus:outline-none
            transition-colors duration-200
            ${
              validation.validCount
                ? 'border-gray-300 focus:border-blue-500'
                : 'border-red-300 focus:border-red-500'
            }
          `}
          aria-describedby={validation.errors.count ? 'count-error' : undefined}
        />
        {validation.errors.count && (
          <p
            id="count-error"
            className="mt-1 text-sm text-red-600"
            role="alert"
          >
            {validation.errors.count}
          </p>
        )}
      </div>

      {/* Dynamic Name Fields Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Player Names</h3>
          <div className="text-sm text-gray-600">
            {names.filter(name => name.trim()).length} of {playerCount}{' '}
            completed
          </div>
        </div>

        <div className="space-y-3">
          {names.map((name, index) => (
            <div key={index}>
              <label
                htmlFor={`player-${index}`}
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Player {index + 1}
              </label>
              <input
                id={`player-${index}`}
                type="text"
                value={name}
                onChange={e => handleNameChange(index, e.target.value)}
                placeholder={`Enter name for Player ${index + 1}`}
                className={`
                  w-full h-12 px-4
                  border-2 rounded-lg
                  touch-manipulation
                  focus:outline-none
                  transition-colors duration-200
                  ${
                    name.trim() || !validation.hasBlankNames
                      ? 'border-gray-300 focus:border-blue-500'
                      : 'border-red-300 focus:border-red-500'
                  }
                `}
                aria-describedby={
                  validation.hasBlankNames && !name.trim()
                    ? 'names-error'
                    : undefined
                }
              />
            </div>
          ))}
        </div>

        {validation.errors.names && (
          <p
            id="names-error"
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {validation.errors.names}
          </p>
        )}
      </div>

      {/* Validation Summary */}
      <div className="text-center">
        <div
          className={`
          inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium
          ${
            validation.isValid
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }
        `}
        >
          {validation.isValid ? (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Ready to allocate roles
            </>
          ) : (
            <>
              <svg
                className="w-4 h-4 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              Please complete all fields
            </>
          )}
        </div>
      </div>
    </div>
  );
};

PlayerCountManager.propTypes = {
  initialCount: PropTypes.number,
  initialNames: PropTypes.arrayOf(PropTypes.string),
  onCountChange: PropTypes.func,
  onNamesChange: PropTypes.func,
  onValidationChange: PropTypes.func,
};

export default PlayerCountManager;
