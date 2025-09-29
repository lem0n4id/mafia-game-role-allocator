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
  mafiaCountSection,
}) => {
  const {
    playerCount,
    names,
    validation,
    touchedFields,
    updatePlayerCount,
    updatePlayerName,
    markFieldTouched,
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
    markFieldTouched(index);
  };

  /**
   * Handle field blur events to mark as touched
   */
  const handleFieldBlur = index => {
    markFieldTouched(index);
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

      {/* Mafia Count Section */}
      {mafiaCountSection && <div>{mafiaCountSection}</div>}

      {/* Dynamic Name Fields Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-gray-900">Player Names</h3>
          <div className="text-sm text-gray-600">
            {validation.completedCount} of {playerCount} completed
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${validation.completionRate * 100}%` }}
          />
        </div>

        <div className="space-y-3">
          {names.map((name, index) => {
            const hasError =
              validation.blankFields.includes(index) &&
              touchedFields.has(index);
            const isCompleted = validation.completedFields.includes(index);

            return (
              <div key={index} className="relative">
                <label
                  htmlFor={`player-${index}`}
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Player {index + 1}
                  {hasError && (
                    <span className="text-red-600 ml-1" aria-label="required">
                      *
                    </span>
                  )}
                </label>

                <div className="relative">
                  <input
                    id={`player-${index}`}
                    type="text"
                    value={name}
                    onChange={e => handleNameChange(index, e.target.value)}
                    onBlur={() => handleFieldBlur(index)}
                    placeholder={`Enter name for Player ${index + 1}`}
                    className={`
                      w-full h-12 px-4 pr-10
                      border-2 rounded-lg
                      touch-manipulation
                      focus:outline-none
                      transition-colors duration-200
                      ${
                        hasError
                          ? 'border-red-500 focus:border-red-500 bg-red-50'
                          : isCompleted
                            ? 'border-green-500 focus:border-blue-500 bg-green-50'
                            : 'border-gray-300 focus:border-blue-500'
                      }
                    `}
                    aria-describedby={hasError ? `error-${index}` : undefined}
                  />

                  {/* Status Icon */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {isCompleted ? (
                      <svg
                        className="w-5 h-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="completed"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : hasError ? (
                      <svg
                        className="w-5 h-5 text-red-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        aria-label="error"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : null}
                  </div>
                </div>

                {/* Field-specific error message */}
                {hasError && (
                  <div
                    id={`error-${index}`}
                    className="mt-1 text-sm text-red-600"
                    role="alert"
                  >
                    Player {index + 1} name is required
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Global validation summary */}
        {validation.hasBlankNames && touchedFields.size > 0 && (
          <div
            className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-live="polite"
          >
            <div className="flex items-center">
              <svg
                className="w-5 h-5 text-red-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v3a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-sm text-red-800 font-medium">
                {validation.errors.message}
              </span>
            </div>
            <p className="text-sm text-red-700 mt-1">
              All players need names before roles can be allocated.
            </p>
          </div>
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
              All player names completed! Ready to allocate roles.
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
  mafiaCountSection: PropTypes.node,
};

export default PlayerCountManager;
