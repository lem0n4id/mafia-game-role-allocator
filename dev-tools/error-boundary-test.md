# Error Boundary Testing Guide

## Manual Testing Instructions

To test the Error Boundary component, you can temporarily modify components to throw errors.

### Test 1: Component Error

Add this to any component (e.g., App.jsx at the top of the component):

```jsx
if (import.meta.env.DEV) {
  // Uncomment to test error boundary
  // throw new Error('Test component error');
}
```

**Expected Behavior:**
1. Error is caught by ErrorBoundary
2. Fallback UI displays with error message
3. "Try Again" and "Refresh Page" buttons appear
4. Development info shows error details

### Test 2: Async Error

Add this button to test async errors:

```jsx
<button onClick={() => {
  setTimeout(() => {
    throw new Error('Test async error');
  }, 100);
}}>
  Test Async Error
</button>
```

**Expected Behavior:**
1. Error is logged to console
2. Global error handler catches it
3. Application continues to function

### Test 3: Promise Rejection

Add this button to test promise rejections:

```jsx
<button onClick={() => {
  Promise.reject(new Error('Test promise rejection'));
}}>
  Test Promise Rejection
</button>
```

**Expected Behavior:**
1. Global handler catches the rejection
2. Error is logged to console
3. Browser default behavior is prevented
4. Application continues to function

### Test 4: Double-Tap Protection

Test existing double-tap protection:

1. **Allocate Button**: Rapidly tap "Allocate Roles" 10+ times
   - Expected: Only one allocation occurs
   - Button becomes disabled during processing

2. **Reveal Button**: Rapidly tap "Reveal Role" 10+ times
   - Expected: Dialog opens once
   - Multiple taps have no effect

3. **Reset Button**: Rapidly tap "Reset Game" 10+ times
   - Expected: Confirmation dialog opens once
   - Multiple taps are blocked

### Test 5: Reset During Reveal

1. Complete player setup (5 players, 1 mafia)
2. Click "Allocate Roles"
3. Click "Start Revealing Roles"
4. Reveal 2-3 players
5. Click "Reset Game"
6. Confirm reset

**Expected Behavior:**
1. Confirmation dialog appears
2. Shows current progress (e.g., "2 of 5 revealed")
3. Reset clears all assignment and reveal states
4. Returns to input screen
5. Player names are preserved
6. Can start new allocation immediately

### Test 6: State Validation

Test state validation utility:

```jsx
import { validateApplicationState } from './utils/errorRecovery';

// In a component
const testValidation = () => {
  const validation = validateApplicationState({
    assignment: currentAssignment,
    form: { playerCount, mafiaCount }
  });
  
  console.log('Validation result:', validation);
};
```

**Expected Behavior:**
1. Valid state returns `isValid: true, issues: []`
2. Invalid state returns specific issues
3. Each issue has type and message

### Test 7: Debounce Utility

Test debouncing:

```jsx
import { debounce } from './utils/debounce';

const debouncedHandler = debounce(() => {
  console.log('Debounced call executed');
}, 300);

// Tap button rapidly
<button onClick={debouncedHandler}>Test Debounce</button>
```

**Expected Behavior:**
1. Multiple rapid taps only trigger one execution
2. Execution happens 300ms after last tap
3. Console shows single log entry

## Verification Checklist

### AC-1: Reset During Reveal
- [ ] Reset button visible during reveal
- [ ] Confirmation dialog shows progress
- [ ] Reset clears all states
- [ ] Player names preserved
- [ ] Can restart allocation

### AC-2: Double-Tap Protection
- [ ] Allocate button protected
- [ ] Reveal button protected
- [ ] Reset button protected
- [ ] Close button protected
- [ ] No duplicate actions occur

### AC-3: Workflow Continuity
- [ ] Error boundary catches errors
- [ ] Fallback UI displays
- [ ] Recovery actions work
- [ ] App remains stable
- [ ] State transitions are clean

### AC-4: Shared Device Workflow
- [ ] No authentication required
- [ ] Memory-only state works
- [ ] Device passing works smoothly
- [ ] Consistent interaction patterns

## Common Issues and Solutions

### Issue: Error Boundary Not Catching Errors
**Solution:** Ensure error is thrown during render, not in event handlers. Event handler errors need try-catch.

### Issue: Double-Tap Still Going Through
**Solution:** Check that isProcessing/isResetting state is properly set before async operation starts.

### Issue: State Not Resetting Properly
**Solution:** Verify all state variables are cleared in handleReset function.

## Performance Testing

### Expected Performance Metrics
- Error boundary overhead: < 1ms
- State validation: < 10ms
- Debounce overhead: < 1ms
- Recovery action: < 500ms
- Reset operation: < 200ms

### How to Measure
```jsx
console.time('operation');
// Perform operation
console.timeEnd('operation');
```

## Production Readiness Checklist

- [x] Error boundary wraps entire app
- [x] Global error handlers registered
- [x] Double-tap protection on all buttons
- [x] Reset works during all phases
- [x] State validation utility available
- [x] Debounce utility available
- [x] Documentation complete
- [x] Build succeeds
- [x] Bundle size acceptable (<500KB)
- [x] Performance meets requirements

## Notes

- Error boundaries only catch errors during render, lifecycle methods, and constructors
- Event handler errors need try-catch blocks
- Async errors outside React need global handlers
- Development mode shows more detailed error info
- Production mode shows user-friendly messages only
