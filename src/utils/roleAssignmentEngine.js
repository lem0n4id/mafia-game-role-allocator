/**
 * Role Assignment Engine
 * Provides cryptographically fair role distribution using Fisher-Yates shuffle algorithm
 * to ensure unbiased assignment of Mafia and Villager roles across all players.
 * Includes utilities for both assignment creation and reveal tracking.
 */

/**
 * Role enumeration
 */
export const ROLES = {
  MAFIA: 'MAFIA',
  VILLAGER: 'VILLAGER'
};

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
 * Create role assignment for players (main implementation from main branch)
 * @param {string[]} playerNames - Array of player names
 * @param {number} mafiaCount - Number of Mafia players to assign
 * @returns {Object} Assignment result with players, metadata, and statistics
 */
export const assignRoles = (playerNames, mafiaCount) => {
  // Input validation
  if (!Array.isArray(playerNames)) {
    throw new Error('Player names must be an array');
  }
  
  if (playerNames.length === 0) {
    throw new Error('Player names array cannot be empty');
  }
  
  if (typeof mafiaCount !== 'number' || mafiaCount < 0) {
    throw new Error('Mafia count must be a non-negative number');
  }
  
  if (mafiaCount > playerNames.length) {
    throw new Error('Mafia count cannot exceed total player count');
  }

  // Validate player names
  const validNames = playerNames.filter(name => 
    typeof name === 'string' && name.trim().length > 0
  );
  
  if (validNames.length !== playerNames.length) {
    throw new Error('All player names must be non-empty strings');
  }

  const totalPlayers = playerNames.length;
  const villagerCount = totalPlayers - mafiaCount;
  
  // Create role array: true for Mafia, false for Villager
  const roles = Array(totalPlayers).fill(false);
  for (let i = 0; i < mafiaCount; i++) {
    roles[i] = true;
  }
  
  // Shuffle roles using Fisher-Yates
  fisherYatesShuffle(roles);
  
  // Create player objects with assigned roles
  const players = playerNames.map((name, index) => ({
    id: index,
    name: name.trim(),
    role: roles[index] ? ROLES.MAFIA : ROLES.VILLAGER,
    index,
    revealed: false
  }));
  
  // Create assignment metadata
  const assignment = {
    players,
    metadata: {
      timestamp: new Date().toISOString(),
      totalPlayers,
      mafiaCount,
      villagerCount,
      assignmentId: generateAssignmentId()
    },
    statistics: {
      mafiaPlayers: players.filter(p => p.role === ROLES.MAFIA),
      villagerPlayers: players.filter(p => p.role === ROLES.VILLAGER),
      mafiaNames: players.filter(p => p.role === ROLES.MAFIA).map(p => p.name),
      villagerNames: players.filter(p => p.role === ROLES.VILLAGER).map(p => p.name)
    }
  };
  
  return assignment;
};

/**
 * Create role assignment for players (alternative implementation from feature branch)
 * @param {string[]} playerNames - Array of player names
 * @param {number} mafiaCount - Number of mafia roles to assign
 * @returns {Object} Assignment object with players and metadata
 */
export const createRoleAssignment = (playerNames, mafiaCount) => {
  if (!Array.isArray(playerNames) || playerNames.length === 0) {
    throw new Error('Player names must be a non-empty array');
  }
  
  if (typeof mafiaCount !== 'number' || mafiaCount < 0 || mafiaCount > playerNames.length) {
    throw new Error('Invalid mafia count');
  }
  
  // Create role array (true = MAFIA, false = VILLAGER)
  const roles = [
    ...Array(mafiaCount).fill(true),
    ...Array(playerNames.length - mafiaCount).fill(false)
  ];
  
  // Shuffle roles using Fisher-Yates
  fisherYatesShuffle(roles);
  
  // Create player objects with assigned roles
  const players = playerNames.map((name, index) => ({
    id: `player-${index}-${Date.now()}`, // Unique identifier
    name: name.trim(),
    index,
    role: roles[index] ? ROLES.MAFIA : ROLES.VILLAGER,
    revealed: false // Track reveal status for card list
  }));
  
  // Create assignment metadata
  const assignment = {
    players,
    metadata: {
      timestamp: Date.now(),
      totalPlayers: playerNames.length,
      mafiaCount,
      villagerCount: playerNames.length - mafiaCount,
      isComplete: false // Will be true when all players have revealed
    }
  };
  
  return assignment;
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
  const mafiaRevealed = revealedPlayers.filter(player => player.role === ROLES.MAFIA).length;
  const villagerRevealed = revealedPlayers.filter(player => player.role === ROLES.VILLAGER).length;
  
  return {
    totalPlayers: assignment.players.length,
    revealedCount: revealedPlayers.length,
    mafiaRevealed,
    villagerRevealed,
    progress: assignment.players.length > 0 ? (revealedPlayers.length / assignment.players.length) * 100 : 0
  };
};

/**
 * Validate assignment integrity
 * @param {Object} assignment - Assignment object to validate
 * @returns {Object} Validation result with success flag and details
 */
export const validateAssignment = (assignment) => {
  try {
    const { players, metadata } = assignment;
    
    if (!Array.isArray(players) || !metadata) {
      throw new Error('Invalid assignment structure');
    }
    
    const mafiaCount = players.filter(p => p.role === ROLES.MAFIA).length;
    const villagerCount = players.filter(p => p.role === ROLES.VILLAGER).length;
    const totalCount = players.length;
    
    if (mafiaCount + villagerCount !== totalCount) {
      throw new Error('Role count mismatch');
    }
    
    if (mafiaCount !== metadata.mafiaCount) {
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
      !player.hasOwnProperty('revealed') ||
      ![ROLES.MAFIA, ROLES.VILLAGER].includes(player.role)
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
 * @param {number} mafiaCount - Number of Mafia players to assign
 * @param {number} iterations - Number of assignments to test (default: 1000)
 * @returns {Object} Distribution statistics
 */
export const testDistribution = (playerNames, mafiaCount, iterations = 1000) => {
  const playerCounts = {};
  
  // Initialize counters
  playerNames.forEach(name => {
    playerCounts[name] = { mafia: 0, villager: 0 };
  });
  
  // Run multiple assignments
  for (let i = 0; i < iterations; i++) {
    const assignment = assignRoles(playerNames, mafiaCount);
    assignment.players.forEach(player => {
      if (player.role === ROLES.MAFIA) {
        playerCounts[player.name].mafia++;
      } else {
        playerCounts[player.name].villager++;
      }
    });
  }
  
  // Calculate percentages and statistics
  const distributionStats = {};
  Object.keys(playerCounts).forEach(name => {
    const expectedMafiaRate = mafiaCount / playerNames.length;
    const actualMafiaRate = playerCounts[name].mafia / iterations;
    
    distributionStats[name] = {
      mafiaAssignments: playerCounts[name].mafia,
      villagerAssignments: playerCounts[name].villager,
      mafiaRate: actualMafiaRate,
      expectedMafiaRate,
      deviation: Math.abs(actualMafiaRate - expectedMafiaRate)
    };
  });
  
  return {
    iterations,
    playerCounts,
    distributionStats,
    totalPlayers: playerNames.length,
    mafiaCount
  };
};