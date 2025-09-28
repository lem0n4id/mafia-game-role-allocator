/**
 * Performance Monitoring Utilities
 * Mobile-focused performance tracking and optimization
 */

/**
 * Performance budget thresholds
 */
export const PERFORMANCE_BUDGETS = {
  BUNDLE_WARNING: 400 * 1024, // 400KB warning
  BUNDLE_ERROR: 500 * 1024,   // 500KB error
  FCP_TARGET: 1500,           // First Contentful Paint < 1.5s
  LCP_TARGET: 2500,           // Largest Contentful Paint < 2.5s
  CLS_TARGET: 0.1,            // Cumulative Layout Shift < 0.1
  LOAD_TARGET: 2000           // Page load < 2s
};

/**
 * Track Core Web Vitals for mobile performance
 */
export const trackWebVitals = () => {
  if (typeof window === 'undefined') return;
  
  // Track First Contentful Paint (FCP)
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (entry.name === 'first-contentful-paint') {
        const fcp = entry.startTime;
        console.log(`FCP: ${fcp.toFixed(2)}ms`, fcp < PERFORMANCE_BUDGETS.FCP_TARGET ? '✓' : '⚠️');
      }
    }
  });
  
  observer.observe({ entryTypes: ['paint'] });
  
  // Track page load time
  window.addEventListener('load', () => {
    const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
    console.log(`Page Load: ${loadTime}ms`, loadTime < PERFORMANCE_BUDGETS.LOAD_TARGET ? '✓' : '⚠️');
  });
};

/**
 * Memory usage monitoring for mobile devices
 */
export const trackMemoryUsage = () => {
  if (typeof window === 'undefined' || !performance.memory) return;
  
  const memory = performance.memory;
  const usage = {
    used: Math.round(memory.usedJSHeapSize / 1048576), // MB
    total: Math.round(memory.totalJSHeapSize / 1048576), // MB
    limit: Math.round(memory.jsHeapSizeLimit / 1048576) // MB
  };
  
  console.log('Memory Usage:', usage);
  return usage;
};

/**
 * Check if device is likely low-end mobile
 */
export const isLowEndDevice = () => {
  if (typeof navigator === 'undefined') return false;
  
  // Check for limited memory or slow CPU
  const memory = navigator.deviceMemory || 4; // Default to 4GB if unknown
  const cores = navigator.hardwareConcurrency || 4; // Default to 4 cores if unknown
  
  return memory <= 2 || cores <= 2;
};

/**
 * Network-aware loading patterns
 */
export const getNetworkInfo = () => {
  if (typeof navigator === 'undefined' || !navigator.connection) {
    return { effectiveType: 'unknown', downlink: 'unknown' };
  }
  
  const connection = navigator.connection;
  return {
    effectiveType: connection.effectiveType,
    downlink: connection.downlink,
    rtt: connection.rtt,
    saveData: connection.saveData
  };
};

/**
 * Optimize for mobile performance
 */
export const optimizeForMobile = () => {
  if (typeof window === 'undefined') return;
  
  // Enable passive listeners for better scroll performance
  const passiveSupported = (() => {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch {
      passiveSupported = false;
    }
    return passiveSupported;
  })();
  
  if (passiveSupported) {
    // Add passive scroll listeners
    document.addEventListener('touchstart', () => {}, { passive: true });
    document.addEventListener('touchmove', () => {}, { passive: true });
  }
  
  // Preload critical resources
  const preloadCriticalResources = () => {
    // This can be extended to preload fonts, critical images, etc.
    console.log('Optimizing for mobile performance...');
  };
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', preloadCriticalResources);
  } else {
    preloadCriticalResources();
  }
};