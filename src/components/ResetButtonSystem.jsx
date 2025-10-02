import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * Reset Button System Component
 * 
 * Provides reset functionality with confirmation dialog to prevent accidental resets.
 * Clears role assignments and reveal states while preserving player names.
 * 
 * @param {boolean} hasActiveGame - Whether there's an active game in progress
 * @param {object} currentAssignment - Current role assignment object
 * @param {function} onReset - Callback to execute reset
 * @param {boolean} disabled - Whether the reset button should be disabled
 */
const ResetButtonSystem = ({
  hasActiveGame,
  currentAssignment,
  onReset,
  disabled = false
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const confirmButtonRef = useRef(null);
  const cancelButtonRef = useRef(null);

  // Calculate reset state information
  const revealedCount = currentAssignment?.players?.filter(p => p.revealed).length || 0;
  const totalPlayers = currentAssignment?.players?.length || 0;
  const hasRevealedRoles = revealedCount > 0;

  // Handle reset button click
  const handleResetClick = useCallback(() => {
    if (disabled || isResetting) return;
    setShowConfirmation(true);
  }, [disabled, isResetting]);

  // Handle confirmation
  const handleConfirm = useCallback(async () => {
    setIsResetting(true);
    try {
      // Execute reset callback
      await onReset();
      setShowConfirmation(false);
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setIsResetting(false);
    }
  }, [onReset]);

  // Handle cancellation
  const handleCancel = useCallback(() => {
    setShowConfirmation(false);
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && showConfirmation && !isResetting) {
        handleCancel();
      }
    };

    if (showConfirmation) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent background scroll
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmation, isResetting, handleCancel]);

  // Focus management
  useEffect(() => {
    if (showConfirmation && cancelButtonRef.current) {
      cancelButtonRef.current.focus();
    }
  }, [showConfirmation]);

  // Don't render if no active game
  if (!hasActiveGame && !currentAssignment) {
    return null;
  }

  return (
    <>
      {/* Reset Button */}
      <button
        type="button"
        onClick={handleResetClick}
        disabled={disabled || isResetting}
        className="
          w-full h-12 px-4 text-white bg-gray-600
          hover:bg-gray-700 active:bg-gray-800
          rounded-lg font-medium transition-colors
          focus:outline-none focus:ring-4 focus:ring-gray-200
          touch-manipulation
          disabled:opacity-50 disabled:cursor-not-allowed
        "
        aria-label="Reset game and return to input screen"
      >
        Reset Game
      </button>

      {/* Confirmation Modal */}
      {showConfirmation && createPortal(
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          aria-labelledby="reset-dialog-title"
        >
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            {/* Header */}
            <div className="text-center mb-6">
              <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 id="reset-dialog-title" className="text-xl font-bold text-gray-900 mb-2">
                Reset Game?
              </h3>
              <p className="text-gray-600">
                This will clear all game progress and return to the input screen.
              </p>
            </div>

            {/* Warning Section */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <h4 className="text-sm font-medium text-red-800 mb-2">
                This action will clear:
              </h4>
              <ul className="text-sm text-red-700 space-y-1">
                <li>• All current role assignments</li>
                {hasRevealedRoles && (
                  <li>• All revealed roles ({revealedCount} of {totalPlayers} revealed)</li>
                )}
                <li>• Current game progress and state</li>
              </ul>
              <p className="text-sm text-red-700 mt-3 font-medium">
                ✓ Player names will be kept for easy re-setup.
              </p>
            </div>

            {/* Current Game Summary */}
            {currentAssignment && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Current Game:</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Players:</span>
                    <span className="ml-1 font-medium text-gray-800">{totalPlayers}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Revealed:</span>
                    <span className="ml-1 font-medium text-gray-800">{revealedCount}/{totalPlayers}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Mafia:</span>
                    <span className="ml-1 font-medium text-red-700">{currentAssignment.metadata?.mafiaCount}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Villagers:</span>
                    <span className="ml-1 font-medium text-green-700">{currentAssignment.metadata?.villagerCount}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                type="button"
                ref={cancelButtonRef}
                onClick={handleCancel}
                disabled={isResetting}
                className="
                  flex-1 h-12 px-4 text-gray-700 bg-gray-200
                  hover:bg-gray-300 active:bg-gray-400
                  rounded-lg font-medium transition-colors
                  focus:outline-none focus:ring-4 focus:ring-gray-200
                  touch-manipulation
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Keep Playing
              </button>
              <button
                type="button"
                ref={confirmButtonRef}
                onClick={handleConfirm}
                disabled={isResetting}
                className="
                  flex-1 h-12 px-4 text-white bg-red-600
                  hover:bg-red-700 active:bg-red-800
                  rounded-lg font-medium transition-colors
                  focus:outline-none focus:ring-4 focus:ring-red-200
                  touch-manipulation
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isResetting ? 'Resetting...' : 'Reset Game'}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

ResetButtonSystem.propTypes = {
  hasActiveGame: PropTypes.bool.isRequired,
  currentAssignment: PropTypes.object,
  onReset: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};

export default ResetButtonSystem;
