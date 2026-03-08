# Pre-renewal Ragnarok Online MVP Tracking
A web-based MVP (Most Valuable Player) boss respawn timer tracker for pre-renewal Ragnarok Online servers. Keep tabs on when MVPs are due to respawn so you never miss a hunt.

## Features
- Comprehensive MVP Database — Tracks 70+ MVPs and mini-bosses across all major maps, including Guild Dungeon variants.
- Respawn Timer Management — Log a time of death and see the estimated respawn window (min/max) for each MVP.
- Smart Sorting — Active timers are prioritized, with MVPs closest to spawning shown first.
- Timezone Support — Configurable timezone with local storage persistence, so your timers stay accurate across sessions.
- Quick Mob Info — Click an MVP name to copy the @mi command to your clipboard for quick in-game lookup.
- Tomb Update — Update MVP death times directly from tombstone information.

## Tech Stack
- React 19 with TypeScript
- Vite for fast development and builds
- Radix UI Themes for the component library
- Styled Components for custom styling
- Luxon for timezone-aware date/time handling
- React Hook Form for form management
- Maskito for input masking
- React Router for routing

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- Yarn package manager

### Installation
``` bash
yarn install
```

### Development
``` bash
yarn dev
```

### Build
``` bash
yarn build
```

### Project Structure
``` 
src/
├── assets/          # MVP database and timezone data
├── components/      # Reusable UI components
│   ├── MvpInformation/       # MVP name, map, and spawn window display
│   ├── TrackingAside/        # Side panel for tracking controls
│   ├── TrackingSpawnTime/    # Spawn countdown/timer display
│   └── UpdateFromTombForm/   # Form to update death time from in-game tombstones
├── containers/      # Page-level container components
│   └── TrackingContainer/    # Main tracking view
├── helpers/         # Utility functions (timers, sorting, timezone)
├── hooks/           # Custom React hooks
└── services/        # External service integrations
```

### License
Not specified — add a license of your choice.
