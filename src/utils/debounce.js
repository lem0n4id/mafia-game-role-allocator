/**
 * Debounce Utility
 * Prevents rapid repeated function calls (double-tap protection)
 */

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds
 * have elapsed since the last time the debounced function was invoked.
 * 
 * @param {Function} func - The function to debounce
 * @param {number} wait - The number of milliseconds to delay (default: 300ms)
 * @param {boolean} immediate - If true, trigger on leading edge instead of trailing
 * @returns {Function} The debounced function
 */
export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  
  return function executedFunction(...args) {
    const context = this;
    
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    
    const callNow = immediate && !timeout;
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func.apply(context, args);
  };
};

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds.
 * Useful for limiting the rate at which a function can fire.
 * 
 * @param {Function} func - The function to throttle
 * @param {number} wait - The number of milliseconds to throttle (default: 300ms)
 * @returns {Function} The throttled function
 */
export const throttle = (func, wait = 300) => {
  let inThrottle;
  
  return function executedFunction(...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
};

/**
 * Creates a debounced callback function.
 * This is a plain JavaScript utility - for React components, consider using the useDebounce hook.
 * 
 * @param {Function} callback - The callback function to debounce
 * @param {number} wait - The number of milliseconds to delay (default: 300ms)
 * @returns {Function} The debounced callback function
 * 
 * @example
 * const debouncedSave = createDebouncedCallback(() => {
 *   saveData();
 * }, 500);
 */
export const createDebouncedCallback = (callback, wait = 300) => {
  return debounce(callback, wait);
};
