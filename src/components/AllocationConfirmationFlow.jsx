import React, { useState, useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';

/**
 * AllocationConfirmationFlow component
 * Provides confirmation gateway for role allocation with parameter validation
 * Includes allocation button, confirmation dialog, and edge case handling
 * Supports both initial allocation and re-allocation with same flow
 */
const AllocationConfirmationFlow = ({
  playerNames,
  mafiaCount,
  isFormValid,
  onAllocate,
  disabled = false,
  hasExistingAssignment = false,
  // currentAssignment is passed but not used in current implementation
  // Reserved for future enhancement to show revealed count or assignment details
  // eslint-disable-next-line no-unused-vars
  currentAssignment = null,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Calculate allocation details with memoization
  const allocationDetails = useMemo(() => ({
    totalPlayers: playerNames.length,
    mafiaCount: parseInt(mafiaCount) || 0,
    villagerCount: playerNames.length - (parseInt(mafiaCount) || 0),
    isEdgeCase: mafiaCount === 0 || mafiaCount >= playerNames.length - 1,
  }), [playerNames.length, mafiaCount]);

  // Handle allocation button click with double-tap protection
  const handleAllocateClick = useCallback(() => {
    if (!isFormValid || disabled || isProcessing) return;
    setShowConfirmation(true);
  }, [isFormValid, disabled, isProcessing]);

  // Handle confirmation with allocation trigger
  const handleConfirm = useCallback(async () => {
    setIsProcessing(true);
    try {
      await onAllocate({
        playerNames: playerNames.filter(name => name.trim()),
        mafiaCount: allocationDetails.mafiaCount,
        villagerCount: allocationDetails.villagerCount,
        isReallocation: hasExistingAssignment,
      });
      setShowConfirmation(false);
    } catch (error) {
      console.error('Allocation failed:', error);
      // Error handling managed by parent component
    } finally {
      setIsProcessing(false);
    }
  }, [onAllocate, playerNames, allocationDetails, hasExistingAssignment]);

  // Handle cancellation
  const handleCancel = useCallback(() => {
    if (isProcessing) return; // Prevent cancellation during processing
    setShowConfirmation(false);
  }, [isProcessing]);

  // Handle escape key for accessibility
  useEffect(() => {
    const handleEscape = e => {
      if (e.key === 'Escape' && showConfirmation && !isProcessing) {
        handleCancel();
      }
    };

    if (showConfirmation) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when dialog is open
      document.body.style.overflow = 'hidden';
      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = '';
      };
    }
  }, [showConfirmation, handleCancel, isProcessing]);

  return (
    <>
      {/* Allocate Roles Button */}
      <div className="mt-8">
        <button
          type="button"
          onClick={handleAllocateClick}
          disabled={!isFormValid || disabled || isProcessing}
          className={`
            w-full h-14 px-6 text-lg font-semibold rounded-lg
            touch-manipulation transition-all duration-200
            focus:outline-none focus:ring-4
            ${
              isFormValid && !disabled && !isProcessing
                ? `bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                   text-white focus:ring-blue-200 
                   shadow-lg hover:shadow-xl transform hover:scale-[1.02]`
                : `bg-gray-300 text-gray-500 cursor-not-allowed 
                   focus:ring-gray-200`
            }
          `}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              {hasExistingAssignment ? 'Re-allocating...' : 'Allocating...'}
            </div>
          ) : (
            hasExistingAssignment ? 'Re-allocate Roles' : 'Allocate Roles'
          )}
        </button>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmation &&
        createPortal(
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={e => {
              if (e.target === e.currentTarget && !isProcessing) {
                handleCancel();
              }
            }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirmation-title"
            aria-describedby="confirmation-description"
          >
            <div
              className="
                bg-white rounded-xl p-6 max-w-md w-full
                shadow-2xl transform transition-all
                max-h-[90vh] overflow-y-auto
              "
              onClick={e => e.stopPropagation()}
            >
              {/* Dialog Header */}
              <div className="text-center mb-6">
                {hasExistingAssignment ? (
                  <>
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                      <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                    <h3
                      id="confirmation-title"
                      className="text-xl font-bold text-gray-900 mb-2"
                    >
                      Re-allocate Roles?
                    </h3>
                    <p
                      id="confirmation-description"
                      className="text-gray-600"
                    >
                      This will create new role assignments for all players.
                    </p>
                  </>
                ) : (
                  <>
                    <h3
                      id="confirmation-title"
                      className="text-xl font-bold text-gray-900 mb-2"
                    >
                      Confirm Role Allocation
                    </h3>
                    <p
                      id="confirmation-description"
                      className="text-gray-600"
                    >
                      Ready to assign roles to all players?
                    </p>
                  </>
                )}
              </div>

              {/* Re-allocation Warning */}
              {hasExistingAssignment && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg className="w-5 h-5 text-orange-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-orange-800 mb-1">
                        Current assignments will be lost
                      </h4>
                      <ul className="text-sm text-orange-700 space-y-1">
                        <li>• All current role assignments will be cleared</li>
                        <li>• Any revealed roles will be reset</li>
                        <li>• Player names and game settings will be kept</li>
                        <li>• New random roles will be generated</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Allocation Details */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Players:</span>
                  <span className="font-semibold">
                    {allocationDetails.totalPlayers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mafia Players:</span>
                  <span className="font-semibold text-red-600">
                    {allocationDetails.mafiaCount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Villager Players:</span>
                  <span className="font-semibold text-green-600">
                    {allocationDetails.villagerCount}
                  </span>
                </div>
              </div>

              {/* Edge Case Warning */}
              {allocationDetails.isEdgeCase && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <svg
                      className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <h4 className="text-sm font-medium text-yellow-800 mb-1">
                        Unusual Game Configuration
                      </h4>
                      <p className="text-sm text-yellow-700">
                        {allocationDetails.mafiaCount === 0
                          ? 'This game will have no Mafia players (all Villagers).'
                          : 'This game will have almost all players as Mafia.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Player List Preview */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Players:
                </h4>
                <div className="max-h-32 overflow-y-auto bg-gray-50 rounded-lg p-3">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {playerNames
                      .filter(name => name.trim())
                      .map((name, index) => (
                        <div key={index} className="text-gray-600">
                          {index + 1}. {name}
                        </div>
                      ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={isProcessing}
                  className="
                    flex-1 h-12 px-4 text-gray-700 bg-gray-200
                    hover:bg-gray-300 active:bg-gray-400
                    rounded-lg font-medium transition-colors
                    focus:outline-none focus:ring-4 focus:ring-gray-200
                    touch-manipulation
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                  aria-label="Cancel allocation"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className={`
                    flex-1 h-12 px-4 text-white rounded-lg font-medium transition-colors
                    focus:outline-none focus:ring-4 touch-manipulation
                    disabled:opacity-50 disabled:cursor-not-allowed
                    ${hasExistingAssignment 
                      ? 'bg-orange-600 hover:bg-orange-700 active:bg-orange-800 focus:ring-orange-200' 
                      : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 focus:ring-blue-200'}
                  `}
                  aria-label={hasExistingAssignment ? 'Confirm re-allocation' : 'Confirm and start role allocation'}
                >
                  {isProcessing 
                    ? (hasExistingAssignment ? 'Re-allocating...' : 'Allocating...') 
                    : (hasExistingAssignment ? 'Re-allocate' : 'Confirm & Allocate')}
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
};

AllocationConfirmationFlow.propTypes = {
  playerNames: PropTypes.arrayOf(PropTypes.string).isRequired,
  mafiaCount: PropTypes.number.isRequired,
  isFormValid: PropTypes.bool.isRequired,
  onAllocate: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  hasExistingAssignment: PropTypes.bool,
  currentAssignment: PropTypes.object,
};

export default AllocationConfirmationFlow;