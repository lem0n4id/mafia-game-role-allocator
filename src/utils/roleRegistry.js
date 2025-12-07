/**
 * Role Registry System
 * 
 * Centralized registry providing a single source of truth for all role definitions
 * in the Mafia game. Stores structured metadata including role identifiers, display
 * names, team affiliations, color schemes, count constraints, and descriptions.
 * 
 * This registry acts as the foundation layer for extensible role support, enabling
 * new role additions with minimal code changes and zero UI refactoring.
 * 
 * @module roleRegistry
 */

/**
 * Team enumeration for role affiliations
 * @typedef {'mafia' | 'special' | 'villager'} Team
 */

/**
 * Role color scheme for UI rendering
 * @typedef {Object} RoleColor
 * @property {string} primary - Primary color for role display (Tailwind CSS code)
 * @property {string} secondary - Secondary/background color
 * @property {string} border - Border color for role elements
 * @property {string} text - Text color for optimal contrast
 * @property {string} accent - Accent color for highlights
 */

/**
 * Role count constraints for validation
 * @typedef {Object} RoleConstraints
 * @property {number} min - Minimum allowed count (0 for optional roles)
 * @property {number} max - Maximum allowed count (Infinity for unlimited, or specific limit)
 * @property {number} default - Recommended/default count for this role
 */

/**
 * Complete role definition with all metadata
 * @typedef {Object} RoleDefinition
 * @property {string} id - Unique role identifier (uppercase, used in code)
 * @property {string} name - Display name for UI rendering
 * @property {Team} team - Team affiliation ('mafia', 'special', or 'villager')
 * @property {RoleColor} color - Color scheme for UI rendering
 * @property {RoleConstraints} constraints - Count validation constraints
 * @property {string} description - Short description of role's objective
 * @property {number} priority - Sort order for UI display (lower = higher priority)
 * @property {string} [icon] - Optional SVG path or icon identifier
 */

/**
 * Deep freeze helper to ensure immutability
 * @param {Object} obj - Object to freeze
 * @returns {Object} Frozen object
 */
function deepFreeze(obj) {
  Object.freeze(obj);
  Object.values(obj).forEach(value => {
    if (typeof value === 'object' && value !== null && !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  return obj;
}

/**
 * Role registry containing all role definitions
 * All role objects are deeply frozen to prevent runtime mutation
 * @constant {Object<string, RoleDefinition>}
 */
const ROLE_REGISTRY = {
  MAFIA: deepFreeze({
    id: 'MAFIA',
    name: 'Mafia',
    team: 'mafia',
    color: {
      primary: 'red-600',      // #dc2626
      secondary: 'red-50',     // #fef2f2
      border: 'red-500',       // #ef4444
      text: 'red-800',         // #991b1b
      accent: 'red-700'        // #b91c1c
    },
    constraints: {
      min: 0,
      max: Infinity,
      default: 1
    },
    description: 'Eliminate villagers to win',
    priority: 1,
    icon: null
  }),
  
  POLICE: deepFreeze({
    id: 'POLICE',
    name: 'Police',
    team: 'special',
    color: {
      primary: 'blue-600',     // #2563eb
      secondary: 'blue-50',    // #eff6ff
      border: 'blue-500',      // #3b82f6
      text: 'blue-800',        // #1e40af
      accent: 'blue-700'       // #1d4ed8
    },
    constraints: {
      min: 0,
      max: 2,
      default: 0
    },
    description: 'Investigate one player each night',
    priority: 2,
    icon: null
  }),
  
  DOCTOR: deepFreeze({
    id: 'DOCTOR',
    name: 'Doctor',
    team: 'special',
    color: {
      primary: 'green-600',    // #16a34a
      secondary: 'green-50',   // #f0fdf4
      border: 'green-500',     // #22c55e
      text: 'green-800',       // #166534
      accent: 'green-700'      // #15803d
    },
    constraints: {
      min: 0,
      max: 2,
      default: 0
    },
    description: 'Protect one player each night',
    priority: 3,
    icon: null
  }),
  
  VILLAGER: deepFreeze({
    id: 'VILLAGER',
    name: 'Villager',
    team: 'villager',
    color: {
      primary: 'gray-500',     // #6b7280
      secondary: 'gray-50',    // #f9fafb
      border: 'gray-300',      // #d1d5db
      text: 'gray-700',        // #374151
      accent: 'gray-600'       // #4b5563
    },
    constraints: {
      min: 0,
      max: Infinity,
      default: -1 // Special value: calculated as (totalPlayers - sum of other roles)
    },
    description: 'Work with others to identify Mafia',
    priority: 4,
    icon: null
  })
};

// Freeze the registry itself to prevent adding/removing roles at runtime
Object.freeze(ROLE_REGISTRY);

/**
 * Default priority for roles without explicit priority value
 * @constant {number}
 */
const DEFAULT_PRIORITY = 999;

/**
 * Get all registered roles sorted by priority
 * @returns {RoleDefinition[]} Array of all role definitions sorted by priority (ascending)
 * @example
 * const roles = getRoles();
 * // Returns: [MAFIA, POLICE, DOCTOR, VILLAGER] sorted by priority
 */
export const getRoles = () => {
  return Object.values(ROLE_REGISTRY).sort((a, b) => (a.priority || DEFAULT_PRIORITY) - (b.priority || DEFAULT_PRIORITY));
};

/**
 * Get a specific role by its ID
 * Lookup is case-insensitive
 * @param {string} id - Role identifier (e.g., 'MAFIA', 'mafia', 'Mafia')
 * @returns {RoleDefinition|null} Role definition or null if not found
 * @example
 * const mafiaRole = getRoleById('MAFIA');
 * if (mafiaRole) {
 *   console.log(mafiaRole.name); // 'Mafia'
 * }
 * 
 * const invalid = getRoleById('INVALID');
 * console.log(invalid); // null
 */
export const getRoleById = (id) => {
  if (!id || typeof id !== 'string') {
    return null;
  }
  
  const role = ROLE_REGISTRY[id.toUpperCase()];
  return role || null;
};

/**
 * Get all roles belonging to a specific team
 * @param {'mafia'|'special'|'villager'} team - Team identifier
 * @returns {RoleDefinition[]} Array of roles for the specified team, sorted by priority
 * @example
 * const specialRoles = getRolesByTeam('special');
 * console.log(specialRoles.map(r => r.name)); // ['Police', 'Doctor']
 */
export const getRolesByTeam = (team) => {
  if (!team || typeof team !== 'string') {
    return [];
  }
  
  const normalizedTeam = team.toLowerCase();
  const validTeams = ['mafia', 'special', 'villager'];
  
  if (!validTeams.includes(normalizedTeam)) {
    return [];
  }
  
  return getRoles().filter(role => role.team === normalizedTeam);
};

/**
 * Get all special roles (non-VILLAGER roles)
 * Convenience function for UI rendering that returns MAFIA and special team roles
 * @returns {RoleDefinition[]} Array of special role definitions
 * @example
 * const specialRoles = getSpecialRoles();
 * console.log(specialRoles.map(r => r.name)); // ['Mafia', 'Police', 'Doctor']
 */
export const getSpecialRoles = () => {
  return getRoles().filter(role => role.team !== 'villager');
};

/**
 * Validation result for role count
 * @typedef {Object} ValidationResult
 * @property {boolean} isValid - Whether the count is valid
 * @property {string} [error] - Error message if invalid
 * @property {Object} [details] - Additional validation details
 */

/**
 * Validate a role count against constraints and total player count
 * @param {string} roleId - Role identifier
 * @param {number} count - Proposed count for this role
 * @param {number} totalPlayers - Total number of players in the game
 * @returns {ValidationResult} Validation result with isValid flag and optional error
 * @example
 * const result = validateRoleCount('MAFIA', 3, 10);
 * if (!result.isValid) {
 *   console.error(result.error);
 * }
 */
export const validateRoleCount = (roleId, count, totalPlayers) => {
  // Input validation
  if (!roleId || typeof roleId !== 'string') {
    return {
      isValid: false,
      error: 'Role ID must be a non-empty string'
    };
  }
  
  if (typeof count !== 'number' || count < 0 || !Number.isInteger(count)) {
    return {
      isValid: false,
      error: 'Count must be a non-negative integer'
    };
  }
  
  if (typeof totalPlayers !== 'number' || totalPlayers <= 0 || !Number.isInteger(totalPlayers)) {
    return {
      isValid: false,
      error: 'Total players must be a positive integer'
    };
  }
  
  // Get role definition
  const role = getRoleById(roleId);
  if (!role) {
    return {
      isValid: false,
      error: `Role with ID "${roleId}" not found in registry`
    };
  }
  
  const { constraints } = role;
  
  // Check minimum constraint
  if (count < constraints.min) {
    return {
      isValid: false,
      error: `${role.name} count must be at least ${constraints.min}`,
      details: {
        min: constraints.min,
        actual: count
      }
    };
  }
  
  // Check maximum constraint
  const effectiveMax = constraints.max;
  
  if (effectiveMax !== Infinity && count > effectiveMax) {
    const errorMessage = totalPlayers 
      ? `${role.name} count cannot exceed ${effectiveMax} for ${totalPlayers} players`
      : `${role.name} count cannot exceed ${effectiveMax}`;
    
    return {
      isValid: false,
      error: errorMessage,
      details: {
        max: effectiveMax,
        actual: count,
        totalPlayers
      }
    };
  }
  
  // Check against total players
  if (count > totalPlayers) {
    return {
      isValid: false,
      error: `${role.name} count (${count}) cannot exceed total players (${totalPlayers})`,
      details: {
        count,
        totalPlayers
      }
    };
  }
  
  return {
    isValid: true,
    details: {
      role: role.name,
      count,
      totalPlayers
    }
  };
};

/**
 * Get role IDs for backward compatibility with existing code
 * @returns {Object<string, string>} Object mapping role names to IDs
 * @deprecated Use getRoles() instead for full role metadata
 * @example
 * const ROLES = getRoleIds();
 * console.log(ROLES.MAFIA); // 'MAFIA'
 */
export const getRoleIds = () => {
  const roleIds = {};
  Object.keys(ROLE_REGISTRY).forEach(id => {
    roleIds[id] = id;
  });
  return roleIds;
};

/**
 * Export role IDs for backward compatibility with existing code
 * @constant {Object<string, string>}
 * @deprecated Use getRoleById() or getRoles() instead
 */
export const ROLES = getRoleIds();

/**
 * Export registry for advanced use cases and testing
 * @constant {Object<string, RoleDefinition>}
 */
export default ROLE_REGISTRY;
