/**
 * Role Assignment Engine
 * Provides cryptographically fair role distribution using Fisher-Yates shuffle algorithm
 * to ensure unbiased assignment across all role types.
 * 
 * Supports multi-role configuration with extensible architecture - adding new roles
 * requires only registry updates without engine modifications.
 * 
 * @module roleAssignmentEngine
 */

import { getRoleById, getSpecialRoles, ROLES } from './roleRegistry.js';

/**
 * Re-export ROLES for backward compatibility
 * @deprecated Import from roleRegistry.js instead
 */
export { ROLES };

/**
 * Cryptographically secure random number generator
 * Falls back to Math.random() if crypto is unavailable
 * @returns {number} Random number between 0 and 1
 */
const getSecureRandom = () => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] / (0xffffffff + 1);
  }
  return Math.random();
};

/**
 * Fisher-Yates shuffle implementation with cryptographically secure randomness
 * @param {Array} array - Array to shuffle (will be modified in place)
 * @returns {Array} - The shuffled array (same reference)
 */
const fisherYatesShuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(getSecureRandom() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

/**
 * Generate unique assignment ID
 * @returns {string} Unique identifier for this assignment
 */
const generateAssignmentId = () => {
  const timestamp = Date.now();
  const random = Math.floor(getSecureRandom() * 1000000);
  return `assign_${timestamp}_${random}`;
};

/**
 * Build array of role objects from role configuration for shuffling.
 * 
 * Converts role configuration dictionary to shuffleable array of role objects.
 * Automatically fills remaining slots with VILLAGER role.
 * 
 * @param {Object} roleConfiguration - Role count dictionary {MAFIA: 5, POLICE: 1, ...}
 * @param {number} totalPlayers - Total players in game
 * @returns {Object[]} Array of role objects ready for shuffle
 * @throws {Error} If total role counts exceed total players
 * @throws {Error} If any role ID not found in registry
 * 
 * @example
 * // 20 players: 5 Mafia, 1 Police, 1 Doctor, 13 auto-filled Villagers
 * const roleArray = buildRoleArray({MAFIA: 5, POLICE: 1, DOCTOR: 1}, 20);
 * // Returns array of 20 role objects
 */
export const buildRoleArray = (roleConfiguration, totalPlayers) => {
  const roleArray = [];
  const specialRoles = getSpecialRoles();
  
  // Add special role objects to array
  for (const role of specialRoles) {
    const count = roleConfiguration[role.id] || 0;
    
    // Validate role count is valid
    if (count < 0 || !Number.isInteger(count)) {
      throw new Error(`Invalid count for ${role.name}: ${count}. Must be a non-negative integer`);
    }
    
    for (let i = 0; i < count; i++) {
      roleArray.push(role);
    }
  }
  
  // Calculate and add villagers
  const villagerRole = getRoleById(ROLES.VILLAGER);
  if (!villagerRole) {
    throw new Error('VILLAGER role not found in registry');
  }
  
  const villagerCount = totalPlayers - roleArray.length;
  
  if (villagerCount < 0) {
    throw new Error(
      `Total role counts (${roleArray.length}) exceeds total players (${totalPlayers}). ` +
      `Reduce special role counts by ${Math.abs(villagerCount)}`
    );
  }
  
  for (let i = 0; i < villagerCount; i++) {
    roleArray.push(villagerRole);
  }
  
  return roleArray;
};

/**
 * Verify assignment integrity against expected role counts.
 * 
 * Validates that the assignment has correct role counts, no null/undefined roles,
 * and all roles exist in the registry.
 * 
 * @param {Object} assignment - Assignment object to verify
 * @param {Object} expectedRoleCounts - Expected role configuration
 * @returns {{isValid: boolean, errors: string[]}} Verification result
 * 
 * @example
 * const result = verifyAssignment(assignment, {MAFIA: 5, POLICE: 1});
 * if (!result.isValid) {
 *   console.error('Verification failed:', result.errors);
 * }
 */
export const verifyAssignment = (assignment, expectedRoleCounts) => {
  const errors = [];
  
  // Validate assignment structure
  if (!assignment || !assignment.players || !Array.isArray(assignment.players)) {
    errors.push('Invalid assignment structure: missing or invalid players array');
    return { isValid: false, errors };
  }
  
  const actualCounts = {};
  
  // Count actual roles and check for invalid roles
  for (const player of assignment.players) {
    if (!player.role || !player.role.id) {
      errors.push(`Player ${player.name || 'unknown'} has invalid role (missing role.id)`);
      continue;
    }
    
    // Verify role exists in registry
    const registryRole = getRoleById(player.role.id);
    if (!registryRole) {
      errors.push(`Player ${player.name} has role ${player.role.id} which is not in registry`);
      continue;
    }
    
    actualCounts[player.role.id] = (actualCounts[player.role.id] || 0) + 1;
  }
  
  // Verify counts match configuration for special roles
  const specialRoles = getSpecialRoles();
  for (const role of specialRoles) {
    const expected = expectedRoleCounts[role.id] || 0;
    const actual = actualCounts[role.id] || 0;
    if (expected !== actual) {
      errors.push(
        `${role.name} count mismatch: expected ${expected}, got ${actual}`
      );
    }
  }
  
  // Verify villager count (auto-calculated)
  const villagerRole = getRoleById(ROLES.VILLAGER);
  if (villagerRole) {
    const actualVillagerCount = actualCounts[villagerRole.id] || 0;
    const specialRoleTotal = Object.entries(expectedRoleCounts)
      .reduce((sum, [roleId, count]) => {
        const role = getRoleById(roleId);
        return sum + (role && role.team !== 'villager' ? count : 0);
      }, 0);
    const expectedVillagerCount = assignment.players.length - specialRoleTotal;
    
    if (actualVillagerCount !== expectedVillagerCount) {
      errors.push(
        `${villagerRole.name} count mismatch: expected ${expectedVillagerCount}, got ${actualVillagerCount}`
      );
    }
  }
  
  return { 
    isValid: errors.length === 0, 
    errors 
  };
};

/**
 * Create role assignment for players with multi-role support.
 * 
 * Supports both legacy and new signatures:
 * - Legacy: assignRoles(playerNames, mafiaCount)
 * - New: assignRoles(playerNames, roleConfiguration)
 * 
 * @param {string[]} playerNames - Array of player names
 * @param {number|Object} mafiaCountOrConfig - Mafia count (legacy) or role configuration object (new)
 * @returns {Object} Assignment result with players, metadata, and statistics
 * @throws {Error} If inputs are invalid
 * 
 * @example
 * // Legacy signature (backward compatible)
 * const assignment1 = assignRoles(['Alice', 'Bob', 'Charlie'], 1);
 * 
 * @example
 * // New multi-role signature
 * const assignment2 = assignRoles(
 *   ['Alice', 'Bob', 'Charlie', 'Dave', 'Eve'],
 *   {MAFIA: 2, POLICE: 1}
 * );
 */
export const assignRoles = (playerNames, mafiaCountOrConfig) => {
  // Input validation
  if (!Array.isArray(playerNames)) {
    throw new Error('Player names must be an array');
  }
  
  if (playerNames.length === 0) {
    throw new Error('Player names array cannot be empty');
  }

  // Validate player names
  const validNames = playerNames.filter(name => 
    typeof name === 'string' && name.trim().length > 0
  );
  
  if (validNames.length !== playerNames.length) {
    throw new Error('All player names must be non-empty strings');
  }

  const totalPlayers = playerNames.length;
  
  // Determine if using legacy or new signature
  let roleConfiguration;
  let isLegacySignature = false;
  
  if (typeof mafiaCountOrConfig === 'number') {
    // Legacy signature: convert mafiaCount to role configuration
    isLegacySignature = true;
    
    if (mafiaCountOrConfig < 0) {
      throw new Error('Mafia count must be a non-negative number');
    }
    
    if (mafiaCountOrConfig > totalPlayers) {
      throw new Error('Mafia count cannot exceed total player count');
    }
    
    roleConfiguration = {
      [ROLES.MAFIA]: mafiaCountOrConfig,
      [ROLES.POLICE]: 0,
      [ROLES.DOCTOR]: 0
      // Villagers will be auto-calculated
    };
  } else if (typeof mafiaCountOrConfig === 'object' && mafiaCountOrConfig !== null) {
    // New signature: use role configuration directly
    roleConfiguration = mafiaCountOrConfig;
  } else {
    throw new Error('Second parameter must be a number (mafiaCount) or object (roleConfiguration)');
  }
  
  // Build role array from configuration
  const roleArray = buildRoleArray(roleConfiguration, totalPlayers);
  
  // Shuffle roles using Fisher-Yates
  const shuffledRoles = fisherYatesShuffle(roleArray);
  
  // Create player objects with assigned roles (full role objects with metadata)
  const players = playerNames.map((name, index) => ({
    id: index,
    name: name.trim(),
    role: shuffledRoles[index], // Full role object from registry
    index,
    revealed: false
  }));
  
  // Generate assignment metadata
  const assignmentId = generateAssignmentId();
  const timestamp = new Date().toISOString();
  
  // Calculate statistics
  const roleDistribution = {};
  const teamDistribution = {};
  
  for (const player of players) {
    // Role distribution
    roleDistribution[player.role.id] = (roleDistribution[player.role.id] || 0) + 1;
    
    // Team distribution
    teamDistribution[player.role.team] = (teamDistribution[player.role.team] || 0) + 1;
  }
  
  // Create assignment object
  const assignment = {
    id: assignmentId,
    timestamp,
    players,
    metadata: {
      totalPlayers,
      roleConfiguration,
      timestamp,
      assignmentId,
      version: '2.0.0-multi-role',
      // Legacy fields for backward compatibility
      ...(isLegacySignature && {
        mafiaCount: roleConfiguration[ROLES.MAFIA],
        villagerCount: roleDistribution[ROLES.VILLAGER] || 0
      })
    },
    statistics: {
      roleDistribution,
      teamDistribution,
      // Legacy fields for backward compatibility
      ...(isLegacySignature && {
        mafiaPlayers: players.filter(p => p.role.id === ROLES.MAFIA),
        villagerPlayers: players.filter(p => p.role.id === ROLES.VILLAGER),
        mafiaNames: players.filter(p => p.role.id === ROLES.MAFIA).map(p => p.name),
        villagerNames: players.filter(p => p.role.id === ROLES.VILLAGER).map(p => p.name)
      })
    }
  };
  
  // Verify assignment integrity
  const verification = verifyAssignment(assignment, roleConfiguration);
  if (!verification.isValid) {
    throw new Error(
      `Assignment verification failed: ${verification.errors.join(', ')}`
    );
  }
  
  return assignment;
};

/**
 * Create role assignment for players (alternative implementation - uses assignRoles internally)
 * @deprecated Use assignRoles() instead
 * @param {string[]} playerNames - Array of player names
 * @param {number} mafiaCount - Number of mafia roles to assign
 * @returns {Object} Assignment object with players and metadata
 */
export const createRoleAssignment = (playerNames, mafiaCount) => {
  // Delegate to assignRoles which now handles multi-role support
  return assignRoles(playerNames, mafiaCount);
};

/**
 * Update player reveal status in assignment
 * @param {Object} assignment - Current assignment object
 * @param {number} playerIndex - Index of player to reveal
 * @returns {Object} Updated assignment object
 */
export const revealPlayer = (assignment, playerIndex) => {
  if (!assignment || !assignment.players) {
    throw new Error('Invalid assignment object');
  }
  
  if (playerIndex < 0 || playerIndex >= assignment.players.length) {
    throw new Error('Invalid player index');
  }
  
  // Create updated assignment with revealed player
  const updatedPlayers = assignment.players.map((player, index) => 
    index === playerIndex 
      ? { ...player, revealed: true }
      : player
  );
  
  // Check if all players have been revealed
  const allRevealed = updatedPlayers.every(player => player.revealed);
  
  return {
    ...assignment,
    players: updatedPlayers,
    metadata: {
      ...assignment.metadata,
      isComplete: allRevealed
    }
  };
};

/**
 * Get assignment statistics
 * @param {Object} assignment - Assignment object
 * @returns {Object} Statistics about the assignment
 */
export const getAssignmentStats = (assignment) => {
  if (!assignment || !assignment.players) {
    return {
      totalPlayers: 0,
      revealedCount: 0,
      mafiaRevealed: 0,
      villagerRevealed: 0,
      progress: 0
    };
  }
  
  const revealedPlayers = assignment.players.filter(player => player.revealed);
  // Handle both legacy string roles and new role objects
  const mafiaRevealed = revealedPlayers.filter(player => 
    (typeof player.role === 'string' ? player.role : player.role.id) === ROLES.MAFIA
  ).length;
  const villagerRevealed = revealedPlayers.filter(player => 
    (typeof player.role === 'string' ? player.role : player.role.id) === ROLES.VILLAGER
  ).length;
  
  return {
    totalPlayers: assignment.players.length,
    revealedCount: revealedPlayers.length,
    mafiaRevealed,
    villagerRevealed,
    progress: assignment.players.length > 0 ? (revealedPlayers.length / assignment.players.length) * 100 : 0
  };
};

/**
 * Validate assignment integrity (legacy function)
 * @deprecated Use verifyAssignment() instead for better multi-role support
 * @param {Object} assignment - Assignment object to validate
 * @returns {Object} Validation result with success flag and details
 */
export const validateAssignment = (assignment) => {
  try {
    const { players, metadata } = assignment;
    
    if (!Array.isArray(players) || !metadata) {
      throw new Error('Invalid assignment structure');
    }
    
    // Handle both string roles (legacy) and role objects (new)
    const mafiaCount = players.filter(p => 
      (typeof p.role === 'string' ? p.role : p.role.id) === ROLES.MAFIA
    ).length;
    const villagerCount = players.filter(p => 
      (typeof p.role === 'string' ? p.role : p.role.id) === ROLES.VILLAGER
    ).length;
    const totalCount = players.length;
    
    // For multi-role assignments, check total count includes all roles
    const allRolesCount = players.length;
    if (allRolesCount !== totalCount) {
      throw new Error('Role count mismatch');
    }
    
    // Check metadata if it has mafiaCount field (legacy assignments)
    if (metadata.mafiaCount !== undefined && mafiaCount !== metadata.mafiaCount) {
      throw new Error('Metadata mismatch: Mafia count');
    }
    
    if (totalCount !== metadata.totalPlayers) {
      throw new Error('Metadata mismatch: Total players');
    }
    
    // Validate player structure
    const invalidPlayers = players.filter(player => 
      !player.hasOwnProperty('id') ||
      !player.hasOwnProperty('name') ||
      !player.hasOwnProperty('role') ||
      !player.hasOwnProperty('index') ||
      !player.hasOwnProperty('revealed')
    );
    
    if (invalidPlayers.length > 0) {
      throw new Error('Invalid player object structure');
    }
    
    return {
      valid: true,
      message: 'Assignment is valid',
      details: {
        totalPlayers: totalCount,
        mafiaCount,
        villagerCount
      }
    };
    
  } catch (error) {
    return {
      valid: false,
      message: error.message,
      details: null
    };
  }
};

/**
 * Create a fresh assignment with the same players but new role distribution
 * @param {string[]} playerNames - Array of player names
 * @param {number} mafiaCount - Number of Mafia players to assign
 * @returns {Object} New assignment result
 */
export const createNewAssignment = (playerNames, mafiaCount) => {
  return assignRoles(playerNames, mafiaCount);
};

/**
 * Test randomness distribution for verification purposes
 * @param {string[]} playerNames - Array of player names
 * @param {number|Object} mafiaCountOrConfig - Mafia count (legacy) or role configuration
 * @param {number} iterations - Number of assignments to test (default: 1000)
 * @returns {Object} Distribution statistics
 */
export const testDistribution = (playerNames, mafiaCountOrConfig, iterations = 1000) => {
  const playerCounts = {};
  const roleIds = [];
  
  // Determine which roles to track
  if (typeof mafiaCountOrConfig === 'number') {
    roleIds.push(ROLES.MAFIA, ROLES.VILLAGER);
  } else {
    // Track all roles in configuration plus villagers
    const specialRoles = getSpecialRoles();
    specialRoles.forEach(role => roleIds.push(role.id));
    roleIds.push(ROLES.VILLAGER);
  }
  
  // Initialize counters for all roles
  playerNames.forEach(name => {
    playerCounts[name] = {};
    roleIds.forEach(roleId => {
      playerCounts[name][roleId] = 0;
    });
  });
  
  // Run multiple assignments
  for (let i = 0; i < iterations; i++) {
    const assignment = assignRoles(playerNames, mafiaCountOrConfig);
    assignment.players.forEach(player => {
      const roleId = typeof player.role === 'string' ? player.role : player.role.id;
      playerCounts[player.name][roleId]++;
    });
  }
  
  // Calculate percentages and statistics
  const distributionStats = {};
  Object.keys(playerCounts).forEach(name => {
    distributionStats[name] = {};
    
    roleIds.forEach(roleId => {
      let roleCount;
      if (roleId === ROLES.VILLAGER) {
        // Villagers are auto-calculated: totalPlayers - sum of all special roles
        const specialTotal = typeof mafiaCountOrConfig === 'number' 
          ? mafiaCountOrConfig 
          : Object.values(mafiaCountOrConfig).reduce((a, b) => a + b, 0);
        roleCount = playerNames.length - specialTotal;
      } else if (typeof mafiaCountOrConfig === 'number' && roleId === ROLES.MAFIA) {
        roleCount = mafiaCountOrConfig;
      } else if (typeof mafiaCountOrConfig === 'object') {
        roleCount = mafiaCountOrConfig[roleId] || 0;
      } else {
        roleCount = 0;
      }
      
      const expectedRate = roleCount > 0 ? roleCount / playerNames.length : 0;
      const actualRate = playerCounts[name][roleId] / iterations;
      
      distributionStats[name][roleId] = {
        assignments: playerCounts[name][roleId],
        rate: actualRate,
        expectedRate,
        deviation: Math.abs(actualRate - expectedRate)
      };
    });
  });
  
  return {
    iterations,
    playerCounts,
    distributionStats,
    totalPlayers: playerNames.length,
    configuration: mafiaCountOrConfig
  };
};