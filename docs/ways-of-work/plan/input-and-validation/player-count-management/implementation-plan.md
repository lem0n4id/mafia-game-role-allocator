# Feature Implementation Plan: Player Count Management

## Goal

Implement dynamic player count input component that automatically generates the appropriate number of name input fields. This component manages field creation/removal, preserves existing values during count changes, and provides the foundation for the game setup interface with responsive mobile optimization.

## Requirements

### Core Component Requirements
- Controlled input for player count (1-30 range)
- Dynamic generation/removal of name input fields
- Value preservation during count increases
- Clean removal of surplus fields when count decreases
- Real-time validation and error feedback
- Mobile-optimized touch targets and layout
- Integration with form validation system

### State Management Requirements
- Controlled component state with useState
- Efficient re-rendering on count changes
- Proper cleanup of removed field data
- State synchronization with parent components
- Performance optimization for large player counts

## Technical Considerations

### System Architecture Overview

```mermaid
flowchart TB
    subgraph "Component Architecture"
        PlayerCountInput[Player Count Input] --> CountValidation[Count Validation]
        CountValidation --> FieldGeneration[Dynamic Field Generation]
        FieldGeneration --> NameFields[Name Input Fields]
    end
    
    subgraph "State Management"
        PlayerCountState[playerCount State] --> NameArrayState[names[] State]
        NameArrayState --> FieldMapping[Field-to-State Mapping]
        FieldMapping --> ValuePreservation[Value Preservation Logic]
    end
    
    subgraph "User Interaction"
        UserInput[User Count Change] --> StateUpdate[Update playerCount]
        StateUpdate --> ArrayResize[Resize names Array]
        ArrayResize --> UIUpdate[Update Field UI]
    end
    
    PlayerCountInput --> PlayerCountState
    NameFields --> NameArrayState
    UserInput --> PlayerCountInput
    
    style PlayerCountInput fill:#3b82f6
    style NameArrayState fill:#10b981
    style FieldGeneration fill:#f59e0b
```

### Frontend Architecture

#### Component Implementation

```jsx
// components/PlayerCountManager.jsx
import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const PlayerCountManager = ({ 
  initialCount = 5, 
  initialNames = [], 
  onCountChange, 
  onNamesChange 
}) => {
  const [playerCount, setPlayerCount] = useState(initialCount);
  const [names, setNames] = useState(
    Array(initialCount).fill('').map((_, i) => initialNames[i] || '')
  );

  // Dynamic field management
  const handleCountChange = useCallback((newCount) => {
    const count = Math.max(1, Math.min(30, parseInt(newCount) || 1));
    setPlayerCount(count);
    
    setNames(prev => {
      const newNames = [...prev];
      newNames.length = count; // Resize array
      return newNames.map((name, i) => name || ''); // Fill empty slots
    });
    
    onCountChange?.(count);
  }, [onCountChange]);

  // Individual name updates
  const handleNameChange = useCallback((index, name) => {
    setNames(prev => 
      prev.map((n, i) => i === index ? name : n)
    );
  }, []);

  // Notify parent of changes
  useEffect(() => {
    onNamesChange?.(names);
  }, [names, onNamesChange]);

  return (
    <div className="space-y-4">
      {/* Player Count Input */}
      <div>
        <label 
          htmlFor="playerCount"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Number of Players
        </label>
        <input
          id="playerCount"
          type="number"
          min="1"
          max="30"
          value={playerCount}
          onChange={(e) => handleCountChange(e.target.value)}
          className="
            w-full h-12 px-4 text-lg
            border-2 border-gray-300 rounded-lg
            focus:border-blue-500 focus:outline-none
            touch-manipulation
          "
        />
      </div>

      {/* Dynamic Name Fields */}
      <div className="space-y-3">
        <h3 className="text-lg font-medium text-gray-900">
          Player Names
        </h3>
        {names.map((name, index) => (
          <div key={index}>
            <label 
              htmlFor={`player-${index}`}
              className="block text-sm text-gray-600 mb-1"
            >
              Player {index + 1}
            </label>
            <input
              id={`player-${index}`}
              type="text"
              value={name}
              onChange={(e) => handleNameChange(index, e.target.value)}
              placeholder={`Enter name for Player ${index + 1}`}
              className="
                w-full h-12 px-4
                border-2 border-gray-300 rounded-lg
                focus:border-blue-500 focus:outline-none
                touch-manipulation
              "
            />
          </div>
        ))}
      </div>
    </div>
  );
};

PlayerCountManager.propTypes = {
  initialCount: PropTypes.number,
  initialNames: PropTypes.arrayOf(PropTypes.string),
  onCountChange: PropTypes.func,
  onNamesChange: PropTypes.func,
};

export default PlayerCountManager;
```

#### Custom Hook Implementation

```jsx
// hooks/usePlayerCountManager.js
import { useState, useCallback, useMemo } from 'react';

export const usePlayerCountManager = (initialCount = 5, initialNames = []) => {
  const [playerCount, setPlayerCount] = useState(initialCount);
  const [names, setNames] = useState(
    Array(initialCount).fill('').map((_, i) => initialNames[i] || '')
  );

  const updatePlayerCount = useCallback((newCount) => {
    const count = Math.max(1, Math.min(30, parseInt(newCount) || 1));
    setPlayerCount(count);
    
    setNames(prev => {
      const newNames = [...prev];
      newNames.length = count;
      return newNames.map((name, i) => name || '');
    });
  }, []);

  const updatePlayerName = useCallback((index, name) => {
    setNames(prev => 
      prev.map((n, i) => i === index ? name : n)
    );
  }, []);

  const validation = useMemo(() => {
    const hasBlankNames = names.some(name => !name.trim());
    const validCount = playerCount >= 1 && playerCount <= 30;
    
    return {
      isValid: !hasBlankNames && validCount,
      hasBlankNames,
      validCount,
      errors: {
        count: !validCount ? 'Player count must be between 1 and 30' : null,
        names: hasBlankNames ? 'All player names are required' : null,
      }
    };
  }, [names, playerCount]);

  const reset = useCallback(() => {
    setPlayerCount(initialCount);
    setNames(Array(initialCount).fill(''));
  }, [initialCount]);

  return {
    playerCount,
    names,
    validation,
    updatePlayerCount,
    updatePlayerName,
    reset,
  };
};
```

### Performance Optimization

- **Memoization:** useMemo for validation calculations
- **Callbacks:** useCallback to prevent unnecessary re-renders
- **Efficient Updates:** Direct array manipulation instead of full reconstruction
- **Debouncing:** Optional debounced input for rapid typing

### Implementation Steps

1. **Component Creation**
   - Create PlayerCountManager component with controlled inputs
   - Implement dynamic field generation logic
   - Add proper labeling and accessibility

2. **State Management**
   - Implement useState for count and names array
   - Add value preservation logic for count changes
   - Create validation system

3. **Mobile Optimization**
   - Ensure 44px touch targets
   - Add responsive layout for small screens
   - Test on real mobile devices

4. **Testing and Validation**
   - Test field generation/removal
   - Verify value preservation
   - Validate mobile usability

## Context Template

- **Feature PRD:** Player Count Management provides dynamic field generation foundation for game setup
- **Epic Integration:** Core component for Input & Validation epic, used by other validation features
- **Dependencies:** Requires Setup & Project Scaffolding completion
- **Dependents:** Mafia Count Validation and Player Name Input System build on this foundation