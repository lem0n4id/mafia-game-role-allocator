/**
 * React Hook for Multi-Role Configuration State Management
 * 
 * Manages role counts state for special roles (Mafia, Police, Doctor) with
 * real-time villager calculation and validation integration. Provides
 * optimized state updates with useCallback and useMemo.
 * 
 * @module usePlayerRoleConfiguration
 */

import { useState, useCallback, useMemo } from 'react';
import { getSpecialRoles } from '../utils/roleRegistry.js';

/**
 * Custom hook for managing player role configuration state.
 * 
 * Initializes role counts from registry defaults, provides update functions,
 * calculates villager count dynamically, and integrates with validation framework.
 * 
 * @param {number} totalPlayers - Total number of players in game
 * @returns {Object} Role configuration state and update functions
 * @property {Object} roleCounts - Current role count configuration (e.g., { MAFIA: 1, POLICE: 0, DOCTOR: 0 })
 * @property {Function} updateRoleCount - Update single role count: (roleId, count) => void
 * @property {number} villagerCount - Calculated villager count (totalPlayers - sum of special roles)
 * @property {Function} resetToDefaults - Reset all role counts to registry defaults
 * 
 * @example
 * const RoleConfigurationManager = ({ totalPlayers }) => {
 *   const { roleCounts, updateRoleCount, villagerCount, resetToDefaults } = 
 *     usePlayerRoleConfiguration(totalPlayers);
 *   
 *   return (
 *     <div>
 *       <p>Mafia: {roleCounts.MAFIA}</p>
 *       <button onClick={() => updateRoleCount('MAFIA', roleCounts.MAFIA + 1)}>
 *         Increase Mafia
 *       </button>
 *       <p>Villagers: {villagerCount}</p>
 *     </div>
 *   );
 * };
 */
export function usePlayerRoleConfiguration(totalPlayers) {
  // Get special roles from registry (Mafia, Police, Doctor - excludes Villager)
  const specialRoles = useMemo(() => getSpecialRoles(), []);
  
  // Initialize state with default counts from registry
  // Memoize initial counts to prevent re-initialization on re-renders
  const initialCounts = useMemo(() => {
    return Object.fromEntries(
      specialRoles.map(role => [role.id, role.constraints.default])
    );
  }, [specialRoles]);
  
  const [roleCounts, setRoleCounts] = useState(initialCounts);
  
  /**
   * Update count for a specific role
   * @param {string} roleId - Role identifier (e.g., 'MAFIA', 'POLICE')
   * @param {number} count - New count value (must be non-negative integer)
   */
  const updateRoleCount = useCallback((roleId, count) => {
    setRoleCounts(prev => ({ ...prev, [roleId]: count }));
  }, []);
  
  /**
   * Calculate villager count dynamically
   * Formula: totalPlayers - sum(all special role counts)
   * Result may be negative if over-allocated (validation will catch this)
   */
  const villagerCount = useMemo(() => {
    const specialRoleSum = Object.values(roleCounts).reduce((sum, count) => sum + count, 0);
    return totalPlayers - specialRoleSum;
  }, [roleCounts, totalPlayers]);
  
  /**
   * Reset all role counts to registry defaults
   * Useful for "Reset Game" functionality
   */
  const resetToDefaults = useCallback(() => {
    setRoleCounts(initialCounts);
  }, [initialCounts]);
  
  return {
    roleCounts,
    updateRoleCount,
    villagerCount,
    resetToDefaults
  };
}
