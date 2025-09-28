/**
 * Mobile Layout Utilities
 * Mobile-first responsive design patterns and constants
 */

/**
 * Mobile breakpoints and media queries
 */
export const BREAKPOINTS = {
  mobile: '0px',
  mobileLarge: '414px',
  tablet: '768px',
  desktop: '1024px',
};

export const MEDIA_QUERIES = {
  mobile: `(max-width: ${BREAKPOINTS.tablet})`,
  mobileLarge: `(min-width: ${BREAKPOINTS.mobileLarge})`,
  tablet: `(min-width: ${BREAKPOINTS.tablet})`,
  desktop: `(min-width: ${BREAKPOINTS.desktop})`,
};

/**
 * Mobile-optimized spacing system
 */
export const MOBILE_SPACING = {
  // Container padding
  containerPadding: 'px-4 sm:px-6',
  containerPaddingLarge: 'px-6 sm:px-8',

  // Vertical spacing
  sectionGap: 'space-y-6',
  componentGap: 'space-y-4',
  elementGap: 'space-y-3',

  // Touch-friendly margins
  touchMargin: 'my-3',
  buttonSpacing: 'space-y-3',

  // Safe areas for notched devices
  safeTop: 'pt-safe-top',
  safeBottom: 'pb-safe-bottom',
  safeLeft: 'pl-safe-left',
  safeRight: 'pr-safe-right',
};

/**
 * Touch target sizing (44px minimum for accessibility)
 */
export const TOUCH_TARGETS = {
  minimum: 'min-h-[44px] min-w-[44px]',
  comfortable: 'min-h-[48px] min-w-[48px]',
  large: 'min-h-[56px] min-w-[56px]',

  // Button heights
  buttonSmall: 'h-10',
  buttonMedium: 'h-12',
  buttonLarge: 'h-14',
  buttonXLarge: 'h-16',
};

/**
 * Mobile-specific utilities
 */
export const MOBILE_UTILS = {
  // Touch manipulation
  touchManipulation: 'touch-manipulation',

  // Prevent zoom on inputs (16px prevents zoom on iOS)
  preventZoom: 'text-base',

  // Smooth scrolling
  smoothScroll: 'scroll-smooth',

  // Full width containers
  fullWidth: 'w-full',
  fullScreen: 'min-h-screen',

  // Mobile-friendly shadows
  mobileShadow: 'shadow-lg sm:shadow-xl',

  // Animation performance
  willChange: 'will-change-transform',
  transform3d: 'transform-gpu',
};

/**
 * Detect mobile device and capabilities
 */
export const isMobile = () => {
  if (typeof window === 'undefined') return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
};

/**
 * Check if device supports touch
 */
export const isTouchDevice = () => {
  if (typeof window === 'undefined') return false;

  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

/**
 * Get viewport dimensions
 */
export const getViewportSize = () => {
  if (typeof window === 'undefined') return { width: 0, height: 0 };

  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
