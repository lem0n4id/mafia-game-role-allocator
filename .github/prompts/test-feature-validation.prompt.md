# Feature Testing and Validation Prompt

## Overview
This prompt provides a systematic approach to testing and validating implemented features in the Mafia Game Role Allocator project. Use this template to ensure comprehensive feature validation across all critical areas.

## Input Parameters
- **Feature Name**: `{feature_name}` (e.g., "Allocation Confirmation Flow", "Player Count Management")
- **Feature Component**: Primary component file (e.g., `AllocationConfirmationFlow.jsx`)
- **Integration Points**: List of components/hooks this feature integrates with

## Instructions

You are testing the **{feature_name}** feature implementation. Follow this comprehensive testing checklist to validate all aspects of the feature.

### 🚀 **Getting Started**

1. **Environment Setup**
   - [ ] Start development server with `npm run dev`
   - [ ] Open browser to `http://localhost:5173`
   - [ ] Enable mobile viewport simulation for responsive testing
   - [ ] Open browser developer tools for console monitoring

2. **Initial State Verification**
   - [ ] Verify feature appears correctly in initial app state
   - [ ] Check that all dependencies are properly imported and working
   - [ ] Confirm debug information shows expected values

### 🧪 **Core Functionality Testing**

#### **State Management & Props**
- [ ] **Initial State**: Verify component initializes with correct default values
- [ ] **Props Validation**: Test all required and optional props are handled correctly
- [ ] **State Updates**: Verify state changes trigger appropriate UI updates
- [ ] **Parent Communication**: Test callback functions properly notify parent components

#### **User Interface Elements**
- [ ] **Visual Design**: Verify styling matches design specifications (colors, typography, spacing)
- [ ] **Button States**: Test enabled, disabled, loading, and hover states
- [ ] **Form Elements**: Verify input fields, dropdowns, and controls work correctly
- [ ] **Visual Feedback**: Test progress indicators, status icons, and state changes

#### **User Interactions**
- [ ] **Primary Actions**: Test main feature functionality (clicks, form submissions, etc.)
- [ ] **Secondary Actions**: Test cancel, reset, and alternative action paths
- [ ] **Keyboard Navigation**: Verify Tab, Enter, Escape, and arrow key functionality
- [ ] **Double-tap Protection**: Test rapid clicking doesn't cause duplicate actions

### 🎯 **Edge Cases & Validation**

#### **Input Validation**
- [ ] **Boundary Values**: Test minimum and maximum allowed values
- [ ] **Invalid Inputs**: Verify appropriate error handling for invalid data
- [ ] **Empty States**: Test behavior with empty or missing data
- [ ] **Error Messages**: Verify clear, actionable error messages appear

#### **Edge Case Scenarios**
- [ ] **Unusual Configurations**: Test edge cases specific to the feature
- [ ] **Error Recovery**: Verify graceful handling of error states
- [ ] **State Transitions**: Test unusual state change sequences
- [ ] **Performance Stress**: Test with maximum supported data loads

### 📱 **Mobile Responsiveness**

#### **Touch Targets & Layout**
- [ ] **Touch Targets**: Verify all interactive elements are 44px+ in size
- [ ] **Responsive Layout**: Test layout adaptation across viewport sizes (320px to 1024px+)
- [ ] **Orientation Changes**: Test portrait and landscape orientations
- [ ] **Scrolling Behavior**: Verify smooth scrolling and content accessibility

#### **Mobile-Specific Interactions**
- [ ] **Touch Feedback**: Test active states provide clear visual feedback
- [ ] **Gesture Support**: Verify swipe, pinch, and other relevant gestures
- [ ] **Mobile Performance**: Test feature performs smoothly on mobile devices
- [ ] **Network Sensitivity**: Test behavior with slow network conditions

### ♿ **Accessibility Compliance**

#### **ARIA & Semantic HTML**
- [ ] **ARIA Attributes**: Verify proper `role`, `aria-label`, `aria-describedby` usage
- [ ] **Semantic Elements**: Test proper use of headings, lists, buttons, form elements
- [ ] **Landmark Regions**: Verify proper document structure and navigation
- [ ] **Live Regions**: Test dynamic content announcements with `aria-live`

#### **Keyboard & Screen Reader Support**
- [ ] **Keyboard Navigation**: Test complete feature accessibility via keyboard only
- [ ] **Focus Management**: Verify logical focus order and visible focus indicators
- [ ] **Screen Reader**: Test with screen reader simulation or tools
- [ ] **Color Contrast**: Verify sufficient contrast ratios for all text and UI elements

### 🔗 **Integration Testing**

#### **Component Integration**
- [ ] **Parent Components**: Verify proper integration with parent component state
- [ ] **Child Components**: Test proper data flow to child components
- [ ] **Sibling Components**: Verify no conflicts with other feature components
- [ ] **Global State**: Test interaction with any global state management

#### **API & Data Flow**
- [ ] **Data Validation**: Test data flow between components matches specifications
- [ ] **Error Propagation**: Verify errors are properly handled and communicated
- [ ] **Performance Impact**: Measure and verify acceptable performance metrics
- [ ] **Memory Usage**: Check for memory leaks or excessive resource usage

### ⚡ **Performance Validation**

#### **Rendering Performance**
- [ ] **Initial Load**: Measure time to interactive and first meaningful paint
- [ ] **Re-rendering**: Verify efficient updates without unnecessary re-renders
- [ ] **Animation Smoothness**: Test 60fps for animations and transitions
- [ ] **Memory Efficiency**: Monitor memory usage during extended use

#### **Bundle Size & Loading**
- [ ] **Bundle Impact**: Verify feature doesn't exceed performance budgets
- [ ] **Lazy Loading**: Test code splitting and dynamic imports if applicable
- [ ] **Asset Optimization**: Verify images and assets are properly optimized
- [ ] **Network Efficiency**: Test minimal network requests and data transfer

### 📋 **Testing Results Documentation**

#### **Test Execution Summary**
- [ ] **Test Coverage**: Document percentage of test cases passed
- [ ] **Critical Issues**: List any blocking or high-priority issues found
- [ ] **Minor Issues**: Document low-priority improvements or suggestions
- [ ] **Performance Metrics**: Record key performance measurements

#### **Feature Validation Report**
Create a summary report with:
- **✅ Passed Tests**: List of successfully validated functionality
- **⚠️ Issues Found**: Detailed description of any problems discovered
- **🚀 Performance Results**: Key metrics and performance validation
- **📝 Recommendations**: Suggestions for improvements or next steps

### 🎯 **Success Criteria**

The **{feature_name}** feature is considered fully validated when:
- [ ] All core functionality works as specified
- [ ] Mobile responsiveness meets design requirements
- [ ] Accessibility compliance achieves WCAG AA standards
- [ ] Integration with other components is seamless
- [ ] Performance meets or exceeds project benchmarks
- [ ] Edge cases are handled gracefully
- [ ] User experience is intuitive and error-free

### 🔄 **Next Steps After Validation**

Upon successful testing:
1. **Documentation Update**: Update project documentation with validation results
2. **Code Review**: Prepare feature for code review if not already completed
3. **Integration**: Ensure feature is properly integrated with main application flow
4. **Deployment Preparation**: Verify feature is ready for production deployment

---

## Usage Instructions

1. **Replace `{feature_name}`** with the actual feature being tested
2. **Customize test scenarios** based on feature-specific requirements  
3. **Execute tests systematically** following the checklist order
4. **Document results** thoroughly for project records
5. **Address any issues** found before marking feature as complete

This comprehensive testing approach ensures that every feature meets the high standards for user experience, accessibility, performance, and reliability required for the Mafia Game Role Allocator project.