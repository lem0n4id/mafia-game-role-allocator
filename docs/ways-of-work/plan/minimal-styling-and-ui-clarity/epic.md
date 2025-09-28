# Epic Product Requirements Document: Minimal Styling / UI Clarity

## Epic Name

Minimal Styling / UI Clarity

## Goal

### Problem
The app must remain lightweight and prioritise functional clarity on mobile. Without a minimal, consistent visual language and portrait-only constraints, users may struggle with discoverability (what to tap next), poor touch targets, or visual clutter that slows down the flow.

### Solution
Apply a minimal styling system using Tailwind CSS v3.4.17 utilities to ensure:
- Clear hierarchy and spacing, with readable text sizes on mobile
- Consistent button styles and states for primary actions (Allocate, Reveal, Close, Reset)
- Portrait-only layout with mobile-friendly paddings and safe-area awareness
- Persistent current player cue styling that remains visible at the top during reveal
- Basic visual differentiation between cards and buttons, without heavy theming

### Impact
- Faster comprehension of what to do next, reducing mis-taps
- Consistent, predictable UI that supports the core flows
- Keeps bundle small and performance high

## User Personas

- Hosts and Players using a single shared mobile device who benefit from clear, uncluttered UI.

## High-Level User Journeys

1. User sees a clean input screen with clear fields and a primary action
2. After allocation, the card list presents clear Reveal buttons and the current player cue is prominent
3. Buttons and cards remain easy to distinguish and tap throughout the flow

## Business Requirements

### Functional Requirements
- Minimal but clear styling for: Inputs, Buttons (primary/secondary/disabled), Cards, Dialog
- Portrait-only layout guidance and spacing standards appropriate for mobile
- Current player cue styled to remain visible at the top during reveal
- Visual differentiation for interactive elements vs. static labels

### Non-Functional Requirements
- Use Tailwind CSS v3.4.17 strictly; avoid Tailwind v4 patterns
- Maintain minimal custom CSS; rely on utilities to keep CSS size low
- 44px minimum tap targets for all controls; legible font sizes for mobile
- No global CSS selectors that can degrade button UI (avoid `* {}`)

## Success Metrics
- No reports of confusing or ambiguous controls in manual tests
- Tap targets consistently meet 44px minimum; no frequent mis-taps observed
- Bundle remains <500KB with styling in place

## Out of Scope
- Theming, dark mode, complex visual design systems
- Third-party UI libraries or component kits
- Animation-heavy interactions beyond simple transitions

## Business Value
Medium. Clear, minimal styling directly supports speed, accuracy, and performance without delaying implementation.

## Context Template

- Epic Idea: Apply a minimal, mobile-first visual system (Tailwind v3.4.17) for clarity, portrait-only layout, and a persistent current player cue.
- Target Users: Hosts and players who need fast, clear interactions on a single mobile device.
