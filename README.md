# Mafia Game Role Allocator

A minimal, mobile-first web application for allocating roles in Mafia games. Built with React 18 and Vite for fast development and optimal performance.

## Features

- **Mobile-First Design**: Portrait layout optimized for mobile devices
- **Touch-Optimized Controls**: Custom counter controls with 44px+ touch targets eliminating mobile keyboard dependencies
- **Simple Role System**: Mafia vs Villagers only
- **Real-Time Allocation**: Instant role assignment with confirmation
- **Sequential Reveal**: Ordered role revelation system
- **Reset & Re-Allocate**: Easy game restart functionality

## Getting Started

### Prerequisites

- Node.js 20+ 
- npm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start development server with mobile network access
npm run dev:mobile

# Build for production
npm run build

# Build and generate bundle analysis
npm run build:analyze

# Preview production build
npm run preview

# Preview with mobile network access
npm run preview:mobile
```

### Mobile Development

The application is optimized for mobile-first development:

- **Network Access**: Use `npm run dev:mobile` to access dev server from mobile devices
- **Performance Monitoring**: Bundle analysis generated at `dist/bundle-analysis.html`
- **Touch Optimization**: 44px minimum touch targets for accessibility
- **Performance Budgets**: Warnings at 400KB, errors at 500KB bundle size

#### Mobile Testing Workflow

1. Start mobile dev server: `npm run dev:mobile`
2. Connect mobile device to same network
3. Access the IP address shown in terminal (e.g., `http://10.1.0.242:5173/`)
4. Test touch interactions and responsive behavior
5. Check performance in mobile browser dev tools

### Development

The application uses:
- **React 18** with functional components and Hooks
- **Vite** for fast development and optimized builds
- **ESLint** with React plugin for comprehensive code quality
- **Prettier** for consistent code formatting
- **Mobile-first** responsive design

#### Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check if code is properly formatted
```

### Project Structure

```
src/
├── components/       # React components
│   ├── PlayerCountManager.jsx       # Dynamic player count with name fields
│   ├── MafiaCountValidator.jsx      # Mafia count validation with edge cases
│   ├── CounterControl.jsx           # Touch-optimized counter component
│   └── AllocationConfirmationFlow.jsx  # Role allocation confirmation
├── hooks/            # Custom React hooks  
│   ├── usePlayerCountManager.js     # Player count and names state management
│   ├── useMafiaCountValidation.js   # Mafia count validation logic
│   └── useCounterControl.js         # Counter control state management
├── utils/            # Utility functions and mobile helpers
│   ├── mobileLayout.js      # Mobile-first responsive patterns
│   └── performance.js       # Performance monitoring utilities
├── styles/           # CSS files
│   └── mobile.css           # Mobile-optimized styles
├── App.jsx           # Root application component
└── main.jsx          # Application entry point
```

## Performance Goals

- Load time: < 2 seconds on mobile
- Interaction latency: < 200ms
- Bundle size: < 500KB

## License

Private project for mafia game role allocation.
