import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { createPortal } from 'react-dom';
import { ROLES } from '../utils/roleAssignmentEngine';

const RoleRevealDialog = ({
  isOpen,
  player,
  onClose,
  onRevealComplete
}) => {
  const [isRoleRevealed, setIsRoleRevealed] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const dialogRef = useRef(null);
  const revealButtonRef = useRef(null);
  const closeButtonRef = useRef(null);

  // Reset reveal state when dialog opens with new player
  useEffect(() => {
    if (isOpen && player) {
      setIsRoleRevealed(player.revealed || false);
      setIsClosing(false);
    }
  }, [isOpen, player]);

  // Focus management - focus appropriate button when dialog opens or state changes
  useEffect(() => {
    if (isOpen) {
      const elementToFocus = isRoleRevealed ? closeButtonRef.current : revealButtonRef.current;
      if (elementToFocus) {
        elementToFocus.focus();
      }
    }
  }, [isOpen, isRoleRevealed]);

  // Handle dialog close
  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose?.();
      setIsClosing(false);
    }, 150); // Match animation duration
  }, [onClose]);

  // Background scroll prevention (Escape key handler removed - dialog only closes via buttons)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  // Focus trap - keep focus within dialog
  useEffect(() => {
    if (!isOpen) return;

    const focusableElements = dialogRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    if (!focusableElements?.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener('keydown', handleTabKey);
    return () => document.removeEventListener('keydown', handleTabKey);
  }, [isOpen, isRoleRevealed]);

  // Handle reveal role
  const handleRevealRole = useCallback(() => {
    setIsRoleRevealed(true);
    onRevealComplete?.();
  }, [onRevealComplete]);

  if (!isOpen || !player) return null;

  const { name, role } = player;
  // Handle both legacy string roles and new role objects
  const roleId = typeof role === 'string' ? role : role.id;
  const roleName = typeof role === 'string' ? role : role.name;
  const roleDescription = typeof role === 'object' && role.description 
    ? role.description 
    : roleId === ROLES.MAFIA
      ? 'Work with other Mafia players to eliminate Villagers'
      : 'Work with other Villagers to identify the Mafia';
  const isMafia = roleId === ROLES.MAFIA;

  return createPortal(
    <div
      className={`
        fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50
        transition-opacity duration-150
        ${isClosing ? 'opacity-0' : 'opacity-100'}
      `}
      role="dialog"
      aria-modal="true"
      aria-labelledby="role-reveal-title"
      aria-describedby="role-reveal-description"
    >
      <div
        ref={dialogRef}
        className={`
          bg-white rounded-2xl p-6 max-w-sm w-full mx-4
          shadow-2xl transform transition-all duration-150
          ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Dialog Header */}
        <div className="text-center mb-6">
          <h2 
            id="role-reveal-title"
            className="text-2xl font-bold text-gray-900 mb-2"
          >
            {name}
          </h2>
          <p 
            id="role-reveal-description"
            className="text-gray-600"
          >
            {isRoleRevealed ? 'Your role:' : 'Ready to see your role?'}
          </p>
        </div>

        {/* Role Display or Reveal Button */}
        <div className="mb-8">
          {isRoleRevealed ? (
            <div className={`
              text-center p-8 rounded-xl border-4
              ${isMafia 
                ? 'bg-red-50 border-red-500 text-red-900'
                : 'bg-green-50 border-green-500 text-green-900'
              }
            `}>
              {/* Role Icon */}
              <div className="mb-4">
                {isMafia ? (
                  <div className="mx-auto w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                ) : (
                  <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
              
              {/* Role Text */}
              <h3 className={`
                text-4xl font-bold mb-2
                ${isMafia ? 'text-red-700' : 'text-green-700'}
              `}>
                {roleName}
              </h3>
              
              {/* Role Description */}
              <p className={`
                text-sm font-medium
                ${isMafia ? 'text-red-600' : 'text-green-600'}
              `}>
                {roleDescription}
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              
              <button
                ref={revealButtonRef}
                type="button"
                onClick={handleRevealRole}
                className="
                  w-full h-14 px-6 text-lg font-semibold
                  bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                  text-white rounded-xl shadow-lg
                  focus:outline-none focus:ring-4 focus:ring-blue-200
                  transition-all duration-200
                  touch-manipulation
                "
              >
                Reveal Role
              </button>
            </div>
          )}
        </div>

        {/* Close Button */}
        {isRoleRevealed && (
          <button
            ref={closeButtonRef}
            type="button"
            onClick={handleClose}
            className="
              w-full h-12 px-6 text-base font-medium
              bg-gray-200 hover:bg-gray-300 active:bg-gray-400
              text-gray-700 rounded-lg
              focus:outline-none focus:ring-4 focus:ring-gray-200
              transition-all duration-200
              touch-manipulation
            "
          >
            Close
          </button>
        )}
      </div>
    </div>,
    document.body
  );
};

RoleRevealDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  player: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string.isRequired,
    role: PropTypes.oneOf([ROLES.MAFIA, ROLES.VILLAGER]).isRequired,
    revealed: PropTypes.bool
  }),
  onClose: PropTypes.func.isRequired,
  onRevealComplete: PropTypes.func,
};

export default RoleRevealDialog;
