# Epic Architecture Specification: Minimal Styling & UI Clarity

## 1. Epic Architecture Overview

This epic implements a lightweight, mobile-first styling system using Tailwind CSS v3.4.17 utilities to establish clear visual hierarchy and consistent interaction patterns. The architecture focuses on utility-first styling with minimal custom CSS, ensuring fast performance and clear visual differentiation while maintaining the application's lightweight bundle requirements.

Key properties:
- Utility-first styling approach using Tailwind CSS v3.4.17 exclusively
- Mobile-first responsive design with portrait-only layout constraints
- Consistent component styling system for buttons, inputs, cards, and dialogs
- Accessibility-compliant touch targets and color contrast requirements
- Performance-optimized CSS with minimal custom styles and no global overrides
- Current player cue styling with persistent visibility during reveal phases

## 2. System Architecture Diagram

```mermaid
flowchart TB
  %% Color definitions
  classDef user fill:#fef3c7,stroke:#d97706,color:#78350f;
  classDef component fill:#d1fae5,stroke:#10b981,color:#065f46;
  classDef style fill:#e0f2fe,stroke:#0284c7,color:#0c4a6e;
  classDef system fill:#f8fafc,stroke:#64748b,color:#334155;
  classDef mobile fill:#fdf4ff,stroke:#c084fc,color:#581c87;

  subgraph UL[User Layer]
    MOBILE_USER[Mobile Device Users]:::user
  end

  subgraph CL[Component Layer]
    STYLED_INPUTS[Styled Input Components]:::component
    STYLED_BUTTONS[Styled Button Components]:::component
    STYLED_CARDS[Styled Card Components]:::component
    STYLED_DIALOGS[Styled Dialog Components]:::component
    CURRENT_PLAYER_CUE[Styled Current Player Cue]:::component
  end

  subgraph SL[Style System Layer]
    TAILWIND_CONFIG[Tailwind Configuration]:::style
    UTILITY_CLASSES[Utility Class System]:::style
    COMPONENT_VARIANTS[Component Variant System]:::style
    MOBILE_FIRST[Mobile-First Breakpoints]:::mobile
  end

  subgraph AL[Accessibility Layer]
    TOUCH_TARGETS[44px Touch Target System]:::system
    COLOR_CONTRAST[Color Contrast System]:::system
    FOCUS_STYLES[Focus State Styles]:::system
  end

  subgraph PL[Performance Layer]
    CSS_PURGING[CSS Purging System]:::system
    BUNDLE_OPTIMIZATION[Bundle Size Optimization]:::system
  end

  %% User interactions
  MOBILE_USER --> STYLED_INPUTS
  MOBILE_USER --> STYLED_BUTTONS
  MOBILE_USER --> STYLED_CARDS
  MOBILE_USER --> STYLED_DIALOGS

  %% Component styling
  STYLED_INPUTS --> UTILITY_CLASSES
  STYLED_BUTTONS --> COMPONENT_VARIANTS
  STYLED_CARDS --> UTILITY_CLASSES
  STYLED_DIALOGS --> COMPONENT_VARIANTS
  CURRENT_PLAYER_CUE --> COMPONENT_VARIANTS

  %% Style system
  TAILWIND_CONFIG --> UTILITY_CLASSES
  TAILWIND_CONFIG --> COMPONENT_VARIANTS
  TAILWIND_CONFIG --> MOBILE_FIRST

  %% Accessibility integration
  UTILITY_CLASSES --> TOUCH_TARGETS
  COMPONENT_VARIANTS --> COLOR_CONTRAST
  STYLED_BUTTONS --> FOCUS_STYLES
  STYLED_INPUTS --> FOCUS_STYLES

  %% Performance optimization
  TAILWIND_CONFIG --> CSS_PURGING
  CSS_PURGING --> BUNDLE_OPTIMIZATION
```

Notes:
- All styling achieved through Tailwind utilities without custom CSS
- Mobile-first approach ensures optimal performance on target devices
- Accessibility requirements built into the utility class system

## 3. High-Level Features & Technical Enablers

### Features
- **Component Style System**: Consistent styling for inputs, buttons, cards, and dialogs
- **Mobile-First Responsive Design**: Portrait-only layout with optimized touch targets
- **Current Player Cue Styling**: Persistent, prominent styling for active player indication
- **Accessibility Styling**: WCAG-compliant color contrast and focus indicators
- **Performance-Optimized CSS**: Minimal bundle size through utility classes and purging
- **State-Based Styling**: Clear visual states for enabled, disabled, active, and error conditions

### Technical Enablers
- **Tailwind CSS v3.4.17**: Utility-first CSS framework with mobile-first breakpoints
- **Component Variant System**: Reusable styling patterns for consistent component appearance
- **CSS Purging Configuration**: Automated removal of unused styles for optimal bundle size
- **Touch Target System**: Standardized 44px minimum touch areas for mobile accessibility
- **Color Contrast System**: Predefined color combinations meeting WCAG requirements
- **Focus Management Styles**: Accessible focus indicators for keyboard and screen reader users

## 4. Technology Stack
- Tailwind CSS v3.4.17 (utility classes, responsive design, component variants)
- PostCSS with Autoprefixer (CSS processing and vendor prefixing)
- CSS Custom Properties (minimal use for dynamic theming if needed)
- Mobile viewport meta configuration (portrait orientation, proper scaling)
- Tailwind purge configuration (tree-shaking unused styles)

## 5. Technical Value
**Value: Medium**
- Establishes consistent visual language for entire application
- Ensures accessibility compliance from the foundation level
- Maintains performance requirements through optimized CSS delivery
- Creates scalable styling patterns for future feature development

## 6. T-Shirt Size Estimate
**Size: M (≈ 1 day)**
- Tailwind configuration and component styling system setup
- Accessibility testing and touch target validation across devices
- Performance optimization and bundle size validation
- Integration testing with all existing components and states

## Context Template
- **Epic PRD**: `docs/ways-of-work/plan/minimal-styling-and-ui-clarity/epic.md`