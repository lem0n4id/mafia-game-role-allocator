/**
 * Multi-Role Validation Framework
 * 
 * Provides composable validation for complex multi-role configurations.
 * Validates role counts against registry-defined constraints with real-time
 * feedback and user-friendly error messages.
 * 
 * @module roleValidation
 */

import * as roleRegistry from './roleRegistry.js';

/**
 * Validation severity levels
 * @constant {Object}
 */
export const VALIDATION_SEVERITY = {
  ERROR: 'ERROR',   // Blocks allocation
  WARNING: 'WARNING', // Requires confirmation
  INFO: 'INFO'      // Informational only
};

/**
 * Role configuration mapping role IDs to counts
 * @typedef {Object.<string, number>} RoleConfiguration
 * @example
 * { MAFIA: 5, POLICE: 1, DOCTOR: 1 }
 */

/**
 * Validation result from a single rule
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether validation passed
 * @property {'ERROR'|'WARNING'|'INFO'} severity - Severity level
 * @property {string} type - Rule identifier (e.g., 'TotalRoleCountRule')
 * @property {string} message - User-friendly error/warning message
 * @property {Object} [details] - Optional additional validation context
 */

/**
 * Aggregated validation state from all rules
 * @typedef {Object} AggregatedValidationState
 * @property {boolean} isValid - Overall validation status (no ERRORs)
 * @property {boolean} hasErrors - Whether any ERROR-severity results present
 * @property {boolean} hasWarnings - Whether any WARNING-severity results present
 * @property {ValidationResult[]} errors - Array of ERROR-severity results
 * @property {ValidationResult[]} warnings - Array of WARNING-severity results
 * @property {number} villagerCount - Calculated villager count
 * @property {boolean} requiresConfirmation - Whether warnings require confirmation
 */

/**
 * Validation rule function signature
 * @callback ValidationRule
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @param {Object} registry - Role registry reference
 * @returns {ValidationResult|null} Validation result or null if rule passes
 */

/**
 * Calculate remaining villager count after special roles assigned.
 * Uses Role Registry's getSpecialRoles() to identify non-Villager roles dynamically.
 * 
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @returns {number} Calculated villager count (may be negative if over-allocated)
 * 
 * @example
 * const villagerCount = calculateVillagerCount(
 *   { MAFIA: 5, POLICE: 1, DOCTOR: 1 },
 *   20
 * );
 * // Returns: 13 (20 - 5 - 1 - 1)
 */
export function calculateVillagerCount(roleConfig, totalPlayers) {
  const specialRoles = roleRegistry.getSpecialRoles(); // Excludes VILLAGER
  
  const specialRoleSum = specialRoles.reduce((sum, role) => {
    return sum + (roleConfig[role.id] || 0);
  }, 0);
  
  return totalPlayers - specialRoleSum;
}

/**
 * Validates that no role has negative count (should be caught by input controls).
 * 
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @param {Object} registry - Role registry reference
 * @returns {ValidationResult|null} Error if any role has negative count
 */
function NegativeCountRule(roleConfig, totalPlayers, registry) {
  const roles = registry.getRoles();
  
  for (const role of roles) {
    if (role.id === 'VILLAGER') continue;
    
    const count = roleConfig[role.id] || 0;
    if (count < 0) {
      return {
        isValid: false,
        severity: VALIDATION_SEVERITY.ERROR,
        type: 'NegativeCountRule',
        message: `${role.name} count cannot be negative (currently: ${count})`,
        details: { roleId: role.id, count }
      };
    }
  }
  
  return null;
}

/**
 * Validates that total role count does not exceed total players.
 * 
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @param {Object} registry - Role registry reference
 * @returns {ValidationResult|null} Error if sum exceeds total, null otherwise
 */
function TotalRoleCountRule(roleConfig, totalPlayers, registry) {
  const specialRoles = registry.getSpecialRoles();
  
  const totalRoles = specialRoles.reduce((sum, role) => {
    return sum + (roleConfig[role.id] || 0);
  }, 0);
  
  if (totalRoles > totalPlayers) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: 'TotalRoleCountRule',
      message: `Total roles (${totalRoles}) cannot exceed total players (${totalPlayers}). Reduce role counts by ${totalRoles - totalPlayers}.`,
      details: { totalRoles, totalPlayers, excess: totalRoles - totalPlayers }
    };
  }
  
  return null;
}

/**
 * Validates each role count against its registry-defined min/max constraints.
 * Supports both static max values and dynamic maxCalculator functions.
 * 
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @param {Object} registry - Role registry reference
 * @returns {ValidationResult|null} Error if any role violates constraints
 */
function IndividualMinMaxRule(roleConfig, totalPlayers, registry) {
  const roles = registry.getRoles();
  
  for (const role of roles) {
    if (role.id === 'VILLAGER') continue; // Villager count calculated, not configured
    
    const count = roleConfig[role.id] || 0;
    const { min, max } = role.constraints;
    
    // Calculate effective max (support for future dynamic constraints)
    const effectiveMax = max;
    
    if (count < min) {
      return {
        isValid: false,
        severity: VALIDATION_SEVERITY.ERROR,
        type: 'IndividualMinMaxRule',
        message: `${role.name} count (${count}) is below minimum (${min})`,
        details: { roleId: role.id, count, min, max: effectiveMax }
      };
    }
    
    if (effectiveMax !== Infinity && count > effectiveMax) {
      return {
        isValid: false,
        severity: VALIDATION_SEVERITY.ERROR,
        type: 'IndividualMinMaxRule',
        message: `${role.name} count (${count}) exceeds maximum (${effectiveMax}). Reduce ${role.name} count by ${count - effectiveMax}.`,
        details: { roleId: role.id, count, min, max: effectiveMax }
      };
    }
  }
  
  return null;
}

/**
 * Validates that configuration leaves at least minimum villagers (default: 1).
 * 
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @param {Object} registry - Role registry reference
 * @param {number} [minVillagers=1] - Minimum required villagers
 * @returns {ValidationResult|null} ERROR if negative, WARNING if 0, null otherwise
 */
function MinimumVillagersRule(roleConfig, totalPlayers, registry, minVillagers = 1) {
  const villagerCount = calculateVillagerCount(roleConfig, totalPlayers);
  
  if (villagerCount < 0) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.ERROR,
      type: 'MinimumVillagersRule',
      message: `Configuration allocates ${Math.abs(villagerCount)} more roles than players. Reduce special role counts.`,
      details: { villagerCount, totalPlayers }
    };
  }
  
  if (villagerCount === 0) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.WARNING,
      type: 'MinimumVillagersRule',
      message: 'Configuration leaves 0 villagers. All players assigned special roles. Consider adding villagers for balanced gameplay.',
      details: { villagerCount, totalPlayers }
    };
  }
  
  if (villagerCount < minVillagers && villagerCount > 0) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.WARNING,
      type: 'MinimumVillagersRule',
      message: `Configuration leaves only ${villagerCount} villager(s). Consider reducing special roles for better balance.`,
      details: { villagerCount, minVillagers, totalPlayers }
    };
  }
  
  return null;
}

/**
 * Detects when all players are assigned special roles (0 villagers).
 * 
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @returns {ValidationResult|null} WARNING if 0 villagers, null otherwise
 */
function AllSpecialRolesRule(roleConfig, totalPlayers) {
  const villagerCount = calculateVillagerCount(roleConfig, totalPlayers);
  
  if (villagerCount === 0) {
    return {
      isValid: false,
      severity: VALIDATION_SEVERITY.WARNING,
      type: 'AllSpecialRolesRule',
      message: 'All players assigned special roles. No villagers in game. This configuration may affect gameplay balance.',
      details: { villagerCount: 0, totalPlayers }
    };
  }
  
  return null;
}

/**
 * Array of validation rules executed sequentially.
 * Rules return ValidationResult or null (if passing).
 * Order matters: basic checks first, then complex validations.
 * 
 * @type {ValidationRule[]}
 */
const VALIDATION_RULES = [
  NegativeCountRule,        // Execute first (basic sanity check)
  TotalRoleCountRule,       // Check total doesn't exceed players
  IndividualMinMaxRule,     // Check each role constraints
  MinimumVillagersRule,     // Check villager count (WARNING for 0)
  AllSpecialRolesRule       // Check edge case (all special) - may duplicate MinimumVillagersRule WARNING
];

/**
 * Export validation rules for extensibility and testing
 */
export { VALIDATION_RULES };

/**
 * Validate a role configuration against all validation rules.
 * 
 * @param {RoleConfiguration} roleConfig - Role count configuration
 * @param {number} totalPlayers - Total players in game
 * @returns {AggregatedValidationState} Aggregated validation state
 * 
 * @example
 * const validation = validateRoleConfiguration(
 *   { MAFIA: 5, POLICE: 1, DOCTOR: 1 },
 *   20
 * );
 * 
 * if (!validation.isValid) {
 *   console.error('Invalid configuration:', validation.errors);
 * }
 * 
 * console.log(`Villagers: ${validation.villagerCount}`);
 */
export function validateRoleConfiguration(roleConfig, totalPlayers) {
  // Execute all validation rules
  const results = VALIDATION_RULES
    .map(rule => rule(roleConfig, totalPlayers, roleRegistry))
    .filter(result => result !== null); // Remove passing rules
  
  // Aggregate results by severity
  const errors = results.filter(r => r.severity === VALIDATION_SEVERITY.ERROR);
  const warnings = results.filter(r => r.severity === VALIDATION_SEVERITY.WARNING);
  
  // Deduplicate warnings (AllSpecialRolesRule may duplicate MinimumVillagersRule)
  const uniqueWarnings = warnings.reduce((acc, warning) => {
    const isDuplicate = acc.some(w => 
      w.type === warning.type || 
      (w.type === 'MinimumVillagersRule' && warning.type === 'AllSpecialRolesRule') ||
      (w.type === 'AllSpecialRolesRule' && warning.type === 'MinimumVillagersRule')
    );
    
    if (!isDuplicate) {
      acc.push(warning);
    }
    
    return acc;
  }, []);
  
  // Calculate villager count
  const villagerCount = calculateVillagerCount(roleConfig, totalPlayers);
  
  return {
    isValid: errors.length === 0,
    hasErrors: errors.length > 0,
    hasWarnings: uniqueWarnings.length > 0,
    errors,
    warnings: uniqueWarnings,
    villagerCount,
    requiresConfirmation: uniqueWarnings.length > 0 && errors.length === 0
  };
}
