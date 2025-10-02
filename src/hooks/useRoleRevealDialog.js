import { useState, useCallback } from 'react';

/**
 * Hook for managing Role Reveal Dialog state
 * Provides state and actions for opening, closing, and tracking dialog interactions
 */
export const useRoleRevealDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [revealInProgress, setRevealInProgress] = useState(false);

  // Open dialog for specific player
  const openDialog = useCallback((player) => {
    setCurrentPlayer(player);
    setIsOpen(true);
    setRevealInProgress(false);
  }, []);

  // Close dialog
  const closeDialog = useCallback(() => {
    setIsOpen(false);
    setRevealInProgress(false);
    // Don't clear currentPlayer immediately to allow for smooth closing animation
    setTimeout(() => {
      setCurrentPlayer(null);
    }, 200);
  }, []);

  // Handle reveal completion
  const handleRevealComplete = useCallback(() => {
    setRevealInProgress(true);
    // Additional logic for reveal completion can be added here
  }, []);

  return {
    // State
    isOpen,
    currentPlayer,
    revealInProgress,
    
    // Actions
    openDialog,
    closeDialog,
    handleRevealComplete
  };
};
