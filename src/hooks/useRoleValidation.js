/**
 * React Hook for Multi-Role Validation
 * 
 * Provides real-time validation for role configurations with debouncing
 * and memoization to prevent excessive recalculation during rapid input changes.
 * 
 * @module useRoleValidation
 */

import { useState, useEffect, useMemo } from 'react';
import { validateRoleConfiguration } from '../utils/roleValidation';

/**
 * React hook for role configuration validation with debouncing.
 * 
 * @param {Object} roleConfiguration - Role count configuration (e.g., { MAFIA: 5, POLICE: 1, DOCTOR: 1 })
 * @param {number} totalPlayers - Total players in game
 * @param {Object} [options] - Hook options
 * @param {number} [options.debounceMs=100] - Debounce delay in milliseconds
 * @param {function} [options.onValidationChange] - Callback when validation changes
 * @returns {Object} Validation state with isValid, hasErrors, hasWarnings, errors, warnings, villagerCount
 * 
 * @example
 * const RoleConfigurationManager = () => {
 *   const [roleCounts, setRoleCounts] = useState({ MAFIA: 1, POLICE: 0, DOCTOR: 0 });
 *   const [totalPlayers, setTotalPlayers] = useState(20);
 *   
 *   const validation = useRoleValidation(roleCounts, totalPlayers, {
 *     debounceMs: 100,
 *     onValidationChange: (state) => console.log('Validation changed:', state)
 *   });
 *   
 *   return (
 *     <div>
 *       <p>Valid: {validation.isValid ? 'Yes' : 'No'}</p>
 *       <p>Villagers: {validation.villagerCount}</p>
 *       {validation.errors.map(err => <p className="text-red-600">{err.message}</p>)}
 *     </div>
 *   );
 * };
 */
export function useRoleValidation(
  roleConfiguration,
  totalPlayers,
  options = {}
) {
  const { debounceMs = 100, onValidationChange } = options;
  
  // Debounced inputs to prevent excessive recalculation
  const [debouncedConfig, setDebouncedConfig] = useState(roleConfiguration);
  const [debouncedTotal, setDebouncedTotal] = useState(totalPlayers);
  
  // Debounce logic - only update after specified delay
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedConfig(roleConfiguration);
      setDebouncedTotal(totalPlayers);
    }, debounceMs);
    
    // Cleanup timeout on unmount or when dependencies change
    return () => clearTimeout(timeoutId);
  }, [roleConfiguration, totalPlayers, debounceMs]);
  
  // Memoized validation result - only recompute when debounced inputs change
  const validation = useMemo(() => {
    return validateRoleConfiguration(debouncedConfig, debouncedTotal);
  }, [debouncedConfig, debouncedTotal]);
  
  // Notify parent component of validation changes
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(validation);
    }
  }, [validation, onValidationChange]);
  
  return validation;
}
