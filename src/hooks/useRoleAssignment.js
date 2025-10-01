import { useState, useCallback, useMemo } from 'react';
import { assignRoles, validateAssignment, ROLES } from '../utils/roleAssignmentEngine.js';

/**
 * Custom hook for role assignment state management
 * Handles role assignment creation, validation, and re-allocation
 *
 * @returns {object} Role assignment state and functions
 */
export const useRoleAssignment = () => {
  const [assignment, setAssignment] = useState(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [assignmentError, setAssignmentError] = useState(null);
  const [assignmentHistory, setAssignmentHistory] = useState([]);

  /**
   * Assignment validation state computed from current assignment
   */
  const validation = useMemo(() => {
    if (!assignment) {
      return { isValid: false, message: 'No assignment created' };
    }
    
    return validateAssignment(assignment);
  }, [assignment]);

  /**
   * Assignment statistics for display
   */
  const statistics = useMemo(() => {
    if (!assignment) {
      return null;
    }

    return {
      totalPlayers: assignment.metadata.totalPlayers,
      mafiaCount: assignment.metadata.mafiaCount,
      villagerCount: assignment.metadata.villagerCount,
      mafiaPlayers: assignment.statistics.mafiaPlayers,
      villagerPlayers: assignment.statistics.villagerPlayers,
      assignmentId: assignment.metadata.assignmentId,
      timestamp: assignment.metadata.timestamp
    };
  }, [assignment]);

  /**
   * Create new role assignment
   */
  const createAssignment = useCallback(async (playerNames, mafiaCount) => {
    setIsAssigning(true);
    setAssignmentError(null);

    try {
      // Validate inputs before assignment
      if (!Array.isArray(playerNames) || playerNames.length === 0) {
        throw new Error('Valid player names array is required');
      }

      if (typeof mafiaCount !== 'number' || mafiaCount < 0) {
        throw new Error('Valid Mafia count is required');
      }

      // Performance timing for validation
      const startTime = performance.now();
      
      // Create assignment using the engine
      const newAssignment = assignRoles(playerNames, mafiaCount);
      
      const endTime = performance.now();
      const assignmentTime = endTime - startTime;

      // Log performance for monitoring
      console.log(`Role assignment completed in ${assignmentTime.toFixed(2)}ms`);

      // Validate the created assignment
      const validationResult = validateAssignment(newAssignment);
      if (!validationResult.valid) {
        throw new Error(`Assignment validation failed: ${validationResult.message}`);
      }

      // Update state
      setAssignment(newAssignment);
      setAssignmentHistory(prev => [...prev, {
        assignment: newAssignment,
        timestamp: new Date().toISOString(),
        performanceMs: assignmentTime
      }]);

      return newAssignment;

    } catch (error) {
      setAssignmentError(error.message);
      console.error('Role assignment failed:', error);
      throw error;
    } finally {
      setIsAssigning(false);
    }
  }, []);

  /**
   * Re-assign roles with same parameters but new randomization
   */
  const reassignRoles = useCallback(async () => {
    if (!assignment) {
      throw new Error('No existing assignment to reassign');
    }

    const playerNames = assignment.players.map(p => p.name);
    const mafiaCount = assignment.metadata.mafiaCount;

    return createAssignment(playerNames, mafiaCount);
  }, [assignment, createAssignment]);

  /**
   * Clear current assignment and history
   */
  const clearAssignment = useCallback(() => {
    setAssignment(null);
    setAssignmentError(null);
    setAssignmentHistory([]);
  }, []);

  /**
   * Get player by ID from current assignment
   */
  const getPlayer = useCallback((playerId) => {
    if (!assignment) return null;
    return assignment.players.find(p => p.id === playerId) || null;
  }, [assignment]);

  /**
   * Get players by role
   */
  const getPlayersByRole = useCallback((role) => {
    if (!assignment) return [];
    return assignment.players.filter(p => p.role === role);
  }, [assignment]);

  /**
   * Check if assignment has edge cases
   */
  const hasEdgeCases = useMemo(() => {
    if (!assignment) return false;
    
    const { mafiaCount, totalPlayers } = assignment.metadata;
    return mafiaCount === 0 || mafiaCount === totalPlayers || mafiaCount === totalPlayers - 1;
  }, [assignment]);

  /**
   * Get edge case type and description
   */
  const edgeCaseInfo = useMemo(() => {
    if (!hasEdgeCases || !assignment) return null;

    const { mafiaCount, totalPlayers } = assignment.metadata;
    
    if (mafiaCount === 0) {
      return {
        type: 'NO_MAFIA',
        description: 'All players are Villagers',
        impact: 'No elimination phase or deduction gameplay'
      };
    }
    
    if (mafiaCount === totalPlayers) {
      return {
        type: 'ALL_MAFIA',
        description: 'All players are Mafia',
        impact: 'No Villagers to eliminate or deceive'
      };
    }
    
    if (mafiaCount === totalPlayers - 1) {
      return {
        type: 'ALMOST_ALL_MAFIA',
        description: 'Only one Villager player',
        impact: 'Extremely challenging for the single Villager'
      };
    }

    return null;
  }, [hasEdgeCases, assignment]);

  return {
    // State
    assignment,
    isAssigning,
    assignmentError,
    assignmentHistory,
    validation,
    statistics,
    hasEdgeCases,
    edgeCaseInfo,

    // Actions
    createAssignment,
    reassignRoles,
    clearAssignment,
    
    // Utilities
    getPlayer,
    getPlayersByRole,
    
    // Constants
    ROLES
  };
};