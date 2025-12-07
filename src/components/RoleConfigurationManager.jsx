/**
 * RoleConfigurationManager Component
 * 
 * Orchestrator component for multi-role configuration interface.
 * Reads special roles from registry, renders RoleInput for each role,
 * displays real-time villager calculation and role distribution summary,
 * and integrates validation framework for comprehensive error/warning feedback.
 * 
 * This component automatically adapts when new roles are added to the registry
 * - no code changes required for new roles to appear in the UI.
 * 
 * @module RoleConfigurationManager
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { getSpecialRoles, getRoleById, ROLES } from '../utils/roleRegistry.js';
import { usePlayerRoleConfiguration } from '../hooks/usePlayerRoleConfiguration.js';
import { useRoleValidation } from '../hooks/useRoleValidation.js';
import RoleInput from './RoleInput.jsx';

/**
 * Orchestrator component for multi-role configuration.
 * Provides complete interface for configuring Mafia, Police, Doctor counts
 * with real-time validation, villager calculation, and role distribution summary.
 * 
 * @param {Object} props
 * @param {number} props.totalPlayers - Total number of players in game
 * @param {Function} [props.onConfigurationChange] - Callback when configuration changes: (config) => void
 *   Config shape: { roleCounts, villagerCount, validation }
 * @param {boolean} [props.disabled=false] - Whether all controls are disabled
 * 
 * @example
 * <RoleConfigurationManager
 *   totalPlayers={20}
 *   onConfigurationChange={(config) => {
 *     console.log('Role counts:', config.roleCounts);
 *     console.log('Valid:', config.validation.isValid);
 *   }}
 *   disabled={false}
 * />
 */
export function RoleConfigurationManager({ 
  totalPlayers, 
  onConfigurationChange,
  disabled = false 
}) {
  // Get special roles from registry (Mafia, Police, Doctor - excludes Villager)
  const specialRoles = getSpecialRoles();
  
  // Manage role counts state via custom hook
  const { roleCounts, updateRoleCount, villagerCount } = 
    usePlayerRoleConfiguration(totalPlayers);
  
  // Integrate validation framework
  const validation = useRoleValidation(roleCounts, totalPlayers, {
    debounceMs: 100,
    onValidationChange: undefined // Don't use internal callback, use effect below
  });
  
  // Get villager role metadata for display
  const villagerRole = getRoleById(ROLES.VILLAGER);
  
  // Notify parent of configuration changes
  useEffect(() => {
    if (onConfigurationChange) {
      onConfigurationChange({
        roleCounts,
        villagerCount,
        validation
      });
    }
  }, [roleCounts, villagerCount, validation, onConfigurationChange]);
  
  // Determine villager count color coding
  const getVillagerColorClass = () => {
    if (villagerCount < 0) return 'text-red-600';
    if (villagerCount === 0) return 'text-yellow-600';
    if (villagerCount < 3) return 'text-yellow-600';
    return 'text-green-600';
  };
  
  // Determine villager icon
  const getVillagerIcon = () => {
    if (villagerCount < 0) return '✗';
    if (villagerCount === 0) return '⚠️';
    if (villagerCount < 3) return '⚠️';
    return '✓';
  };

  return (
    <div className="space-y-6">
      {/* Role Inputs Section */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800">
          Role Configuration
        </h2>
        
        {specialRoles.map(role => (
          <RoleInput
            key={role.id}
            role={role}
            value={roleCounts[role.id] || 0}
            onChange={(count) => updateRoleCount(role.id, count)}
            totalPlayers={totalPlayers}
            disabled={disabled}
          />
        ))}
      </div>
      
      {/* Villager Count Display */}
      <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className={`text-2xl mr-2 ${getVillagerColorClass()}`}>
              {getVillagerIcon()}
            </span>
            <span className="text-sm font-medium text-gray-700">
              {villagerRole?.name || 'Villager'} Count
            </span>
          </div>
          <span className={`text-lg font-bold ${getVillagerColorClass()}`}>
            {villagerCount}
          </span>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Calculated: {totalPlayers} total - {Object.values(roleCounts).reduce((a, b) => a + b, 0)} special roles
        </p>
      </div>
      
      {/* Role Distribution Summary */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-gray-700">Role Distribution Summary</h3>
        
        {/* Color-coded badges for each role */}
        <div className="flex flex-wrap gap-2">
          {specialRoles.map(role => {
            const count = roleCounts[role.id] || 0;
            if (count === 0) return null;
            
            return (
              <span
                key={role.id}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${role.color.secondary} text-${role.color.text} border border-${role.color.border}`}
                style={{
                  backgroundColor: `var(--tw-${role.color.secondary})`,
                  color: `var(--tw-${role.color.text})`,
                }}
              >
                {count} {role.name}
              </span>
            );
          })}
          
          {/* Villager badge - only show if count > 0 */}
          {villagerCount > 0 && villagerRole && (
            <span 
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-${villagerRole.color.secondary} text-${villagerRole.color.text} border border-${villagerRole.color.border}`}
              style={{
                backgroundColor: `var(--tw-${villagerRole.color.secondary})`,
                color: `var(--tw-${villagerRole.color.text})`,
              }}
            >
              {villagerCount} {villagerRole.name}
            </span>
          )}
        </div>
        
        {/* Total count */}
        <p className="text-sm text-gray-600">
          <span className="font-medium">Total:</span> {totalPlayers} players
        </p>
      </div>
      
      {/* Validation Errors */}
      {validation.errors.length > 0 && (
        <div className="space-y-2" role="alert">
          <h4 className="text-sm font-medium text-red-800">Configuration Errors:</h4>
          {validation.errors.map((error, index) => (
            <div key={index} className="flex items-start">
              <span className="text-red-600 mr-2">❌</span>
              <p className="text-sm text-red-600 flex-1">{error.message}</p>
            </div>
          ))}
        </div>
      )}
      
      {/* Validation Warnings */}
      {validation.warnings.length > 0 && (
        <div className="space-y-2" role="alert">
          <h4 className="text-sm font-medium text-yellow-800">Configuration Warnings:</h4>
          {validation.warnings.map((warning, index) => (
            <div key={index} className="flex items-start">
              <span className="text-yellow-600 mr-2">⚠️</span>
              <p className="text-sm text-yellow-600 flex-1">{warning.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

RoleConfigurationManager.propTypes = {
  totalPlayers: PropTypes.number.isRequired,
  onConfigurationChange: PropTypes.func,
  disabled: PropTypes.bool,
};

export default RoleConfigurationManager;
