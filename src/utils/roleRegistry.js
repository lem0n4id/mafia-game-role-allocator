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
 * @typedef {'MAFIA' | 'VILLAGE'} Team
 */

/**
 * Role color scheme for UI rendering
 * @typedef {Object} RoleColor
 * @property {string} primary - Primary color for role display (hex or Tailwind class)
 * @property {string} secondary - Secondary/accent color for backgrounds
 * @property {string} text - Text color for optimal contrast
 */

/**
 * Role count constraints for validation
 * @typedef {Object} RoleConstraints
 * @property {number} min - Minimum allowed count (0 for optional roles)
 * @property {number} max - Maximum allowed count (-1 for unlimited, or specific limit)
 * @property {number} default - Recommended/default count for this role
 * @property {Function} [maxCalculator] - Optional function to calculate max based on total players
 */

/**
 * Complete role definition with all metadata
 * @typedef {Object} RoleDefinition
 * @property {string} id - Unique role identifier (uppercase, used in code)
 * @property {string} name - Display name for UI rendering
 * @property {Team} team - Team affiliation (MAFIA or VILLAGE)
 * @property {RoleColor} color - Color scheme for UI rendering
 * @property {RoleConstraints} constraints - Count validation constraints
 * @property {string} description - Short description of role's objective
 * @property {number} displayOrder - Sort order for UI display (lower = earlier)
 * @property {boolean} isSpecialRole - True for optional/advanced roles (Police, Doctor, etc.); false for core roles (MAFIA, VILLAGER)
 */

/**
 * Team constants for role affiliations
 * @constant {Object}
 */
export const TEAMS = {
  MAFIA: 'MAFIA',
  VILLAGE: 'VILLAGE'
};

/**
 * Role registry containing all role definitions
 * Ordered by displayOrder for consistent UI rendering
 * @constant {Object<string, RoleDefinition>}
 */
const ROLE_REGISTRY = {
  MAFIA: {
    id: 'MAFIA',
    name: 'Mafia',
    team: TEAMS.MAFIA,
    color: {
      primary: '#dc2626', // red-600
      secondary: '#fef2f2', // red-50
      text: '#991b1b' // red-800
    },
    constraints: {
      min: 0,
      max: -1, // Unlimited, but validated against total players
      default: 1,
      maxCalculator: (totalPlayers) => Math.max(0, totalPlayers - 1) // At least one non-Mafia player
    },
    description: 'Work with other Mafia players to eliminate Villagers',
    displayOrder: 1,
    isSpecialRole: false // Core role (not optional), but needs special UI handling via getSpecialRoles()
  },
  
  VILLAGER: {
    id: 'VILLAGER',
    name: 'Villager',
    team: TEAMS.VILLAGE,
    color: {
      primary: '#16a34a', // green-600
      secondary: '#f0fdf4', // green-50
      text: '#166534' // green-800
    },
    constraints: {
      min: 1, // At least one villager required
      max: -1, // Unlimited
      default: -1, // Fill remaining slots
      maxCalculator: (totalPlayers) => totalPlayers
    },
    description: 'Work with other Villagers to identify the Mafia',
    displayOrder: 2,
    isSpecialRole: false // Core standard role requiring no special UI treatment
  },
  
  POLICE: {
    id: 'POLICE',
    name: 'Police',
    team: TEAMS.VILLAGE,
    color: {
      primary: '#2563eb', // blue-600
      secondary: '#eff6ff', // blue-50
      text: '#1e40af' // blue-800
    },
    constraints: {
      min: 0,
      max: 1, // Typically one police per game
      default: 0,
      maxCalculator: (totalPlayers) => totalPlayers >= 5 ? 1 : 0
    },
    description: 'Investigate one player each night to learn their true identity',
    displayOrder: 3,
    isSpecialRole: true
  },
  
  DOCTOR: {
    id: 'DOCTOR',
    name: 'Doctor',
    team: TEAMS.VILLAGE,
    color: {
      primary: '#7c3aed', // violet-600
      secondary: '#f5f3ff', // violet-50
      text: '#5b21b6' // violet-800
    },
    constraints: {
      min: 0,
      max: 1, // Typically one doctor per game
      default: 0,
      maxCalculator: (totalPlayers) => totalPlayers >= 5 ? 1 : 0
    },
    description: 'Protect one player each night from elimination',
    displayOrder: 4,
    isSpecialRole: true
  }
};

/**
 * Get all registered roles sorted by displayOrder
 * @returns {RoleDefinition[]} Array of all role definitions
 * @example
 * const roles = getRoles();
 * console.log(roles); // [MAFIA, VILLAGER, POLICE, DOCTOR]
 */
export const getRoles = () => {
  return Object.values(ROLE_REGISTRY).sort((a, b) => a.displayOrder - b.displayOrder);
};

/**
 * Get a specific role by its ID
 * @param {string} id - Role identifier (e.g., 'MAFIA', 'VILLAGER')
 * @returns {RoleDefinition} Role definition
 * @throws {Error} If role ID is not found in registry
 * @example
 * const mafiaRole = getRoleById('MAFIA');
 * console.log(mafiaRole.name); // 'Mafia'
 */
export const getRoleById = (id) => {
  if (!id || typeof id !== 'string') {
    throw new Error('Role ID must be a non-empty string');
  }
  
  const role = ROLE_REGISTRY[id.toUpperCase()];
  if (!role) {
    throw new Error(`Role with ID "${id}" not found in registry`);
  }
  
  return role;
};

/**
 * Get all roles belonging to a specific team
 * @param {Team} team - Team identifier ('MAFIA' or 'VILLAGE')
 * @returns {RoleDefinition[]} Array of roles for the specified team
 * @throws {Error} If team is invalid
 * @example
 * const villageRoles = getRolesByTeam('VILLAGE');
 * console.log(villageRoles.map(r => r.name)); // ['Villager', 'Police', 'Doctor']
 */
export const getRolesByTeam = (team) => {
  if (!team || typeof team !== 'string') {
    throw new Error('Team must be a non-empty string');
  }
  
  const normalizedTeam = team.toUpperCase();
  if (!Object.values(TEAMS).includes(normalizedTeam)) {
    throw new Error(`Invalid team: "${team}". Must be one of: ${Object.values(TEAMS).join(', ')}`);
  }
  
  return getRoles().filter(role => role.team === normalizedTeam);
};

/**
 * Get all special roles (non-VILLAGER roles)
 * 
 * Returns roles that require special UI handling or are optional additions.
 * Includes MAFIA (though marked isSpecialRole: false as it's a core role)
 * because MAFIA requires distinct UI treatment from standard VILLAGER roles.
 * 
 * Note: isSpecialRole indicates "optional/advanced" roles (Police, Doctor),
 * while this function returns "roles needing special UI" (MAFIA + special roles).
 * 
 * @returns {RoleDefinition[]} Array of special role definitions
 * @example
 * const specialRoles = getSpecialRoles();
 * console.log(specialRoles.map(r => r.name)); // ['Mafia', 'Police', 'Doctor']
 */
export const getSpecialRoles = () => {
  // Include MAFIA explicitly as it needs special UI handling despite being a core role
  return getRoles().filter(role => role.isSpecialRole || role.id === 'MAFIA');
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
  let role;
  try {
    role = getRoleById(roleId);
  } catch (error) {
    return {
      isValid: false,
      error: error.message
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
  let effectiveMax = constraints.max;
  if (constraints.maxCalculator) {
    effectiveMax = constraints.maxCalculator(totalPlayers);
  }
  
  if (effectiveMax !== -1 && count > effectiveMax) {
    return {
      isValid: false,
      error: `${role.name} count cannot exceed ${effectiveMax} for ${totalPlayers} players`,
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

// Export registry for advanced use cases
export default ROLE_REGISTRY;
