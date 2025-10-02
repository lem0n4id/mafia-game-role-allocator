import React from 'react';
import PropTypes from 'prop-types';
import { useCounterControl } from '../hooks/useCounterControl.js';
import { TOUCH_TARGETS, MOBILE_UTILS } from '../utils/mobileLayout.js';

/**
 * CounterControl component
 * Touch-optimized counter with ← N → layout for mobile interactions
 * Provides immediate visual feedback and accessibility compliance
 */
const CounterControl = React.memo(({
  value,
  min,
  max,
  onChange,
  label,
  disabled = false,
  className = '',
  id,
  'aria-describedby': ariaDescribedBy,
}) => {
  const {
    increment,
    decrement,
    canIncrement,
    canDecrement,
    handleKeyDown,
  } = useCounterControl(value, min, max, onChange);

  // Handle button interactions with visual feedback
  const handleIncrementClick = (e) => {
    e.preventDefault();
    if (!disabled) {
      increment();
    }
  };

  const handleDecrementClick = (e) => {
    e.preventDefault();
    if (!disabled) {
      decrement();
    }
  };

  return (
    <div 
      className={`
        flex flex-row items-center space-x-1
        ${className}
      `}
      role="group"
      aria-label={label}
    >
      {/* Decrement Button (←) */}
      <button
        type="button"
        onClick={handleDecrementClick}
        disabled={disabled || !canDecrement}
        className={`
          ${TOUCH_TARGETS.minimum}
          flex items-center justify-center
          border-2 rounded-lg
          ${MOBILE_UTILS.touchManipulation}
          font-bold text-lg
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          ${
            disabled || !canDecrement
              ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 hover:border-gray-400'
          }
        `}
        aria-label={`Decrease ${label}`}
        aria-disabled={disabled || !canDecrement}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
      </button>

      {/* Value Display */}
      <div
        className={`
          ${TOUCH_TARGETS.minimum}
          flex items-center justify-center
          border-2 rounded-lg
          text-lg font-medium
          bg-gray-50 border-gray-200
          ${disabled ? 'text-gray-400' : 'text-gray-900'}
        `}
        tabIndex="0"
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        aria-label={`${label}: ${value}`}
        aria-describedby={ariaDescribedBy}
        onKeyDown={handleKeyDown}
        id={id}
      >
        {value}
      </div>

      {/* Increment Button (→) */}
      <button
        type="button"
        onClick={handleIncrementClick}
        disabled={disabled || !canIncrement}
        className={`
          ${TOUCH_TARGETS.minimum}
          flex items-center justify-center
          border-2 rounded-lg
          ${MOBILE_UTILS.touchManipulation}
          font-bold text-lg
          transition-all duration-150
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1
          ${
            disabled || !canIncrement
              ? 'border-gray-200 text-gray-300 bg-gray-50 cursor-not-allowed'
              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50 active:bg-gray-100 hover:border-gray-400'
          }
        `}
        aria-label={`Increase ${label}`}
        aria-disabled={disabled || !canIncrement}
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 5l7 7-7 7"
          />
        </svg>
      </button>
    </div>
  );
});

CounterControl.displayName = 'CounterControl';

CounterControl.propTypes = {
  value: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  'aria-describedby': PropTypes.string,
};

export default CounterControl;