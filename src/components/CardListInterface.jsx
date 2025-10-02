import React, { useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { ROLES } from '../utils/roleAssignmentEngine';

const CardListInterface = ({
  assignment,
  currentPlayerIndex,
  onPlayerReveal,
  revealInProgress = false
}) => {
  // Calculate card states and progress
  const cardStates = useMemo(() => {
    if (!assignment || !assignment.players) return [];
    
    return assignment.players.map((player, index) => {
      const isRevealed = player.revealed;
      const isCurrent = index === currentPlayerIndex;
      const isUpcoming = index > currentPlayerIndex;
      const isPast = index < currentPlayerIndex;
      const canReveal = isCurrent && !isRevealed && !revealInProgress;
      
      return {
        ...player,
        isRevealed,
        isCurrent,
        isUpcoming,
        isPast,
        canReveal,
        cardState: isRevealed ? 'revealed' : 
                  isCurrent ? 'current' :
                  isPast ? 'completed' : 'waiting'
      };
    });
  }, [assignment, currentPlayerIndex, revealInProgress]);

  // Progress calculations
  const progress = useMemo(() => {
    if (!cardStates.length) return { completed: 0, total: 0, percentage: 0 };
    
    const completed = cardStates.filter(card => card.isRevealed).length;
    const total = cardStates.length;
    const percentage = total > 0 ? (completed / total) * 100 : 0;
    
    return { completed, total, percentage };
  }, [cardStates]);

  // Handle card click with order enforcement
  const handleCardClick = useCallback((player, cardState) => {
    // Strict order enforcement: only allow current player to reveal
    if (!cardState.canReveal) {
      // Provide feedback for why interaction is blocked
      if (cardState.isRevealed) {
        console.log(`Player ${player.name} has already revealed their role`);
      } else if (cardState.isUpcoming) {
        console.warn(`Cannot reveal ${player.name} yet - wait for your turn (current player: index ${currentPlayerIndex})`);
      } else if (cardState.isPast) {
        console.warn(`Player ${player.name} was skipped in sequence`);
      }
      return;
    }
    
    onPlayerReveal?.({
      playerId: player.id,
      playerName: player.name,
      playerIndex: player.index
    });
  }, [onPlayerReveal, currentPlayerIndex]);

  if (!assignment || !assignment.players || cardStates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No player assignments to display</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Progress */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">
            Player Roles
          </h2>
          <div className="text-sm text-gray-600">
            {progress.completed} of {progress.total} revealed
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-green-600 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
      </div>
      
      {/* Current Player Indicator - Sticky at top with enhanced visibility */}
      {currentPlayerIndex < cardStates.length && progress.completed < progress.total && (
        <div 
          className="sticky top-0 z-10 -mx-4 px-4 py-3 bg-blue-50 border-2 border-blue-500 rounded-lg shadow-lg backdrop-blur-sm bg-opacity-95"
          role="status"
          aria-live="polite"
          aria-atomic="true"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center min-w-0 flex-1">
              <div className="w-3 h-3 bg-blue-600 rounded-full mr-3 flex-shrink-0 animate-pulse" />
              <div className="min-w-0 flex-1">
                <span className="text-base font-bold text-blue-900 block truncate">
                  {cardStates[currentPlayerIndex]?.isRevealed 
                    ? `Current: ${cardStates[currentPlayerIndex].name}`
                    : `Next: ${cardStates[currentPlayerIndex].name}`}
                </span>
                <p className="text-xs text-blue-700 mt-0.5 truncate">
                  {cardStates[currentPlayerIndex]?.isRevealed 
                    ? 'Tap card to see role again'
                    : 'Tap card below to reveal role'}
                </p>
              </div>
            </div>
            <div className="text-sm font-medium text-blue-700 bg-blue-100 rounded-full px-3 py-1 ml-3 flex-shrink-0">
              {currentPlayerIndex + 1} of {cardStates.length}
            </div>
          </div>
        </div>
      )}

      {/* Player Cards */}
      <div className="space-y-3">
        {cardStates.map((cardState, index) => {
          const {
            id,
            name,
            canReveal,
            isRevealed,
            isCurrent,
            cardState: state
          } = cardState;

          return (
            <div
              key={id}
              onClick={() => handleCardClick(cardState, cardState)}
              className={`
                relative p-4 rounded-xl border-2 transition-all duration-200
                touch-manipulation min-h-[72px] flex items-center
                ${
                  state === 'current' && canReveal
                    ? 'border-blue-500 bg-blue-50 shadow-lg hover:shadow-xl active:shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98]'
                    : state === 'revealed'
                    ? 'border-gray-400 bg-gray-100 cursor-default opacity-90'
                    : state === 'completed'
                    ? 'border-gray-300 bg-gray-50 cursor-not-allowed opacity-75'
                    : 'border-gray-200 bg-white cursor-not-allowed opacity-60'
                }
              `}
              role="button"
              tabIndex={canReveal ? 0 : -1}
              aria-label={
                isRevealed 
                  ? `${name}: Role has been revealed`
                  : isCurrent
                  ? `${name}: Tap to reveal role - This is the current player`
                  : cardState.isUpcoming
                  ? `${name}: Waiting to reveal - Not your turn yet`
                  : `${name}: Waiting to reveal`
              }
              aria-disabled={!canReveal}
              title={
                isRevealed 
                  ? 'Role already revealed'
                  : isCurrent
                  ? 'Tap to reveal your role'
                  : cardState.isUpcoming
                  ? 'Wait for your turn'
                  : 'Waiting to reveal'
              }
              onKeyDown={(e) => {
                if ((e.key === 'Enter' || e.key === ' ') && canReveal) {
                  e.preventDefault();
                  handleCardClick(cardState, cardState);
                }
              }}
            >
              {/* Player Number */}
              <div className={`
                flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                text-sm font-bold mr-4
                ${
                  state === 'current' && canReveal
                    ? 'bg-blue-600 text-white'
                    : state === 'revealed'
                    ? 'bg-gray-600 text-white'
                    : 'bg-gray-400 text-white'
                }
              `}>
                {index + 1}
              </div>

              {/* Player Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className={`
                    font-semibold truncate
                    ${
                      state === 'current' && canReveal
                        ? 'text-blue-900'
                        : state === 'revealed'
                        ? 'text-gray-900'
                        : 'text-gray-700'
                    }
                  `}>
                    {name}
                  </h3>
                  
                  {/* Role Badge (if revealed) - Hidden for privacy */}
                  {isRevealed && (
                    <div className="px-3 py-1 rounded-full text-xs font-bold bg-gray-600 text-white">
                      REVEALED
                    </div>
                  )}
                </div>
                
                {/* Status Text */}
                <p className={`
                  text-sm mt-1
                  ${
                    state === 'current' && canReveal
                      ? 'text-blue-700'
                      : state === 'revealed'
                      ? 'text-gray-600'
                      : 'text-gray-500'
                  }
                `}>
                  {isRevealed 
                    ? 'Role revealed'
                    : isCurrent
                    ? 'Tap to reveal role'
                    : 'Waiting to reveal'}
                </p>
              </div>

              {/* Status Icon */}
              <div className="flex-shrink-0 ml-3">
                {isRevealed ? (
                  <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : canReveal ? (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </div>

              {/* Current Player Pulse Effect */}
              {isCurrent && canReveal && (
                <div className="absolute inset-0 rounded-xl border-2 border-blue-400 animate-pulse" />
              )}
            </div>
          );
        })}
      </div>

      {/* Completion Status */}
      {progress.completed === progress.total && progress.total > 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <h3 className="text-sm font-medium text-green-800">
                Great! Enjoy the game!
              </h3>
              <p className="text-sm text-green-600 mt-1">
                All roles have been revealed. Ready to start playing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

CardListInterface.propTypes = {
  assignment: PropTypes.object,
  currentPlayerIndex: PropTypes.number.isRequired,
  onPlayerReveal: PropTypes.func,
  revealInProgress: PropTypes.bool,
};

export default CardListInterface;