/**
 * RoleInput Component
 * 
 * Generic data-driven input component for configuring role counts.
 * Consumes role metadata from registry (name, color, constraints)
 * to render counter controls with proper styling and accessibility.
 * 
 * This component is designed to be role-agnostic - when new roles
 * are added to the registry, they automatically render with this
 * component without any code changes.
 * 
 * @module RoleInput
 */

import React from 'react';
import PropTypes from 'prop-types';
import CounterControl from './CounterControl.jsx';

/**
 * Generic role input component consuming role metadata from registry.
 * Renders label, counter control, and constraint hints for a single role.
 * 
 * @param {Object} props
 * @param {Object} props.role - Role definition from registry (contains id, name, color, constraints, description)
 * @param {number} props.value - Current role count
 * @param {Function} props.onChange - Callback when count changes: (newCount) => void
 * @param {number} props.totalPlayers - Total players in game (for constraint calculation)
 * @param {boolean} [props.disabled=false] - Whether input is disabled
 * 
 * @example
 * const role = getRoleById('MAFIA');
 * <RoleInput
 *   role={role}
 *   value={5}
 *   onChange={(count) => updateRole('MAFIA', count)}
 *   totalPlayers={20}
 *   disabled={false}
 * />
 */
export const RoleInput = React.memo(({ 
  role, 
  value, 
  onChange, 
  totalPlayers, 
  disabled = false 
}) => {
  // Calculate effective max constraint
  // Support both static max values and future dynamic maxCalculator functions
  const effectiveMax = role.constraints.maxCalculator 
    ? role.constraints.maxCalculator(totalPlayers) 
    : role.constraints.max;

  // For display purposes, convert Infinity to a reasonable max
  const displayMax = effectiveMax === Infinity ? totalPlayers : effectiveMax;

  return (
    <div className="space-y-2">
      {/* Role Label - use default color since dynamic Tailwind classes don't work */}
      <label 
        htmlFor={`role-${role.id}`}
        className="block text-sm font-medium text-gray-700"
      >
        Number of {role.name} Players
      </label>
      
      {/* Counter Control with role constraints */}
      <CounterControl
        id={`role-${role.id}`}
        value={value}
        min={role.constraints.min}
        max={displayMax}
        onChange={onChange}
        label={role.name}
        disabled={disabled}
        aria-label={`${role.name} count`}
      />
      
      {/* Constraint Hint - only show if max is not Infinity */}
      {effectiveMax !== Infinity && (
        <p className="text-xs text-gray-500">
          Max: {effectiveMax}
        </p>
      )}
      
      {/* Role Description */}
      {role.description && (
        <p className="text-xs text-gray-600">
          {role.description}
        </p>
      )}
    </div>
  );
});

RoleInput.displayName = 'RoleInput';

RoleInput.propTypes = {
  role: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    team: PropTypes.string.isRequired,
    color: PropTypes.shape({
      primary: PropTypes.string.isRequired,
      secondary: PropTypes.string.isRequired,
      border: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      accent: PropTypes.string.isRequired,
    }).isRequired,
    constraints: PropTypes.shape({
      min: PropTypes.number.isRequired,
      max: PropTypes.number.isRequired,
      default: PropTypes.number.isRequired,
      maxCalculator: PropTypes.func,
    }).isRequired,
    description: PropTypes.string,
    priority: PropTypes.number,
    icon: PropTypes.string,
  }).isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  totalPlayers: PropTypes.number.isRequired,
  disabled: PropTypes.bool,
};

export default RoleInput;
