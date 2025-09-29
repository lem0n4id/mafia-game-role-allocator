/**
 * Role Assignment Engine
 * 
 * Implements cryptographically fair role assignment using Fisher-Yates shuffle
 * to ensure unbiased distribution of Mafia and Villager roles.
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
 * Create role assignment for players
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