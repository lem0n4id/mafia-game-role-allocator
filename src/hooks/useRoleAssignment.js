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

    // Handle both legacy and new assignment structures
    const baseStats = {
      totalPlayers: assignment.metadata.totalPlayers,
      assignmentId: assignment.metadata.assignmentId,
      timestamp: assignment.metadata.timestamp
    };
    
    // New structure has roleDistribution and teamDistribution
    if (assignment.statistics.roleDistribution) {
      return {
        ...baseStats,
        roleDistribution: assignment.statistics.roleDistribution,
        teamDistribution: assignment.statistics.teamDistribution,
        // Legacy fields for backward compatibility
        mafiaCount: assignment.metadata.mafiaCount || assignment.statistics.roleDistribution[ROLES.MAFIA] || 0,
        villagerCount: assignment.metadata.villagerCount || assignment.statistics.roleDistribution[ROLES.VILLAGER] || 0,
        mafiaPlayers: assignment.statistics.mafiaPlayers || assignment.players.filter(p => 
          (typeof p.role === 'string' ? p.role : p.role.id) === ROLES.MAFIA
        ),
        villagerPlayers: assignment.statistics.villagerPlayers || assignment.players.filter(p => 
          (typeof p.role === 'string' ? p.role : p.role.id) === ROLES.VILLAGER
        )
      };
    }
    
    // Legacy structure
    return {
      ...baseStats,
      mafiaCount: assignment.metadata.mafiaCount,
      villagerCount: assignment.metadata.villagerCount,
      mafiaPlayers: assignment.statistics.mafiaPlayers,
      villagerPlayers: assignment.statistics.villagerPlayers
    };
  }, [assignment]);

  /**
   * Create new role assignment
   * Supports both legacy (mafiaCount) and new (roleConfiguration) signatures
   */
  const createAssignment = useCallback(async (playerNames, mafiaCountOrConfig) => {
    setIsAssigning(true);
    setAssignmentError(null);

    try {
      // Validate inputs before assignment
      if (!Array.isArray(playerNames) || playerNames.length === 0) {
        throw new Error('Valid player names array is required');
      }

      if (typeof mafiaCountOrConfig === 'number' && mafiaCountOrConfig < 0) {
        throw new Error('Valid Mafia count is required');
      }

      if (typeof mafiaCountOrConfig === 'object' && !mafiaCountOrConfig) {
        throw new Error('Valid role configuration is required');
      }

      // Performance timing for validation
      const startTime = performance.now();
      
      // Create assignment using the engine
      const newAssignment = assignRoles(playerNames, mafiaCountOrConfig);
      
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
    
    // Use roleConfiguration if available (new structure), otherwise mafiaCount (legacy)
    const config = assignment.metadata.roleConfiguration || assignment.metadata.mafiaCount;

    return createAssignment(playerNames, config);
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
   * Get players by role (supports both role ID string and role object)
   */
  const getPlayersByRole = useCallback((role) => {
    if (!assignment) return [];
    
    // Handle both string role IDs and role objects
    const roleId = typeof role === 'string' ? role : role.id;
    
    return assignment.players.filter(p => 
      (typeof p.role === 'string' ? p.role : p.role.id) === roleId
    );
  }, [assignment]);

  /**
   * Mark a player as revealed
   */
  const markPlayerRevealed = useCallback((playerIndex) => {
    if (!assignment) return;
    
    setAssignment(prevAssignment => {
      const updatedPlayers = prevAssignment.players.map((player, index) => 
        index === playerIndex 
          ? { ...player, revealed: true }
          : player
      );
      
      return {
        ...prevAssignment,
        players: updatedPlayers
      };
    });
  }, [assignment]);

  /**
   * Check if assignment has edge cases
   */
  const hasEdgeCases = useMemo(() => {
    if (!assignment) return false;
    
    const { totalPlayers, roleConfiguration, mafiaCount } = assignment.metadata;
    
    // Get mafia count from either new or legacy structure
    const actualMafiaCount = roleConfiguration 
      ? (roleConfiguration[ROLES.MAFIA] || 0)
      : mafiaCount;
    
    return actualMafiaCount === 0 || actualMafiaCount === totalPlayers || actualMafiaCount === totalPlayers - 1;
  }, [assignment]);

  /**
   * Get edge case type and description
   */
  const edgeCaseInfo = useMemo(() => {
    if (!hasEdgeCases || !assignment) return null;

    const { totalPlayers, roleConfiguration, mafiaCount } = assignment.metadata;
    const actualMafiaCount = roleConfiguration 
      ? (roleConfiguration[ROLES.MAFIA] || 0)
      : mafiaCount;
    
    if (actualMafiaCount === 0) {
      return {
        type: 'NO_MAFIA',
        description: 'All players are Villagers',
        impact: 'No elimination phase or deduction gameplay'
      };
    }
    
    if (actualMafiaCount === totalPlayers) {
      return {
        type: 'ALL_MAFIA',
        description: 'All players are Mafia',
        impact: 'No Villagers to eliminate or deceive'
      };
    }
    
    if (actualMafiaCount === totalPlayers - 1) {
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
    markPlayerRevealed,
    
    // Utilities
    getPlayer,
    getPlayersByRole,
    
    // Constants
    ROLES
  };
};