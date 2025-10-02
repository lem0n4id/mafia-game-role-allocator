import { useEffect, useRef, useCallback, useState } from 'react';

/**
 * React hook that returns a memoized debounced callback function.
 * The callback reference is kept up-to-date using a ref, ensuring the latest
 * version is always called while maintaining a stable debounced function identity.
 * 
 * @param {Function} callback - The callback function to debounce
 * @param {number} delay - The debounce delay in milliseconds (default: 300ms)
 * @returns {Function} A memoized debounced callback function
 * 
 * @example
 * const MyComponent = () => {
 *   const debouncedSearch = useDebounce((searchTerm) => {
 *     performSearch(searchTerm);
 *   }, 500);
 * 
 *   return <input onChange={(e) => debouncedSearch(e.target.value)} />;
 * };
 */
export const useDebounce = (callback, delay = 300) => {
  // Store the latest callback in a ref so we always call the most recent version
  const callbackRef = useRef(callback);
  
  // Update the ref whenever callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);
  
  // Create the debounced function using useCallback for stable reference
  const debouncedCallback = useCallback((...args) => {
    const timeoutId = setTimeout(() => {
      callbackRef.current(...args);
    }, delay);
    
    // Return cleanup function
    return () => clearTimeout(timeoutId);
  }, [delay]);
  
  return debouncedCallback;
};

/**
 * React hook that debounces a value.
 * Returns the debounced value after the specified delay.
 * 
 * @param {*} value - The value to debounce
 * @param {number} delay - The debounce delay in milliseconds (default: 300ms)
 * @returns {*} The debounced value
 * 
 * @example
 * const MyComponent = () => {
 *   const [searchTerm, setSearchTerm] = useState('');
 *   const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
 * 
 *   useEffect(() => {
 *     if (debouncedSearchTerm) {
 *       performSearch(debouncedSearchTerm);
 *     }
 *   }, [debouncedSearchTerm]);
 * 
 *   return <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />;
 * };
 */
export const useDebouncedValue = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(timeoutId);
  }, [value, delay]);
  
  return debouncedValue;
};

export default useDebounce;
