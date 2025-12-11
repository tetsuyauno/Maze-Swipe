# Maze Game

## Overview

A 7×7 maze puzzle game built with React Native and Expo. Players navigate through procedurally designed mazes by tapping on cells - the car moves to the tapped cell if a valid path exists. The app features a child-friendly design with peach/cream colors, haptic feedback, smooth animations, confetti celebrations, and star ratings. No authentication is required as this is a single-user local puzzle game.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation with native stack navigator (stack-only, no tabs)
- **State Management**: React hooks for local state, TanStack React Query for server state
- **Animations**: React Native Reanimated for smooth, performant animations
- **Gestures**: React Native Gesture Handler with Tap gesture for tap-to-move navigation
- **Styling**: StyleSheet API with a centralized theme system in `client/constants/theme.ts`

### Directory Structure
- `client/` - React Native frontend code
  - `screens/` - Screen components (GameScreen, SettingsScreen)
  - `components/` - Reusable UI components
  - `navigation/` - Stack navigator configuration
  - `hooks/` - Custom React hooks
  - `data/` - Maze level data definitions
  - `constants/` - Theme colors, spacing, typography
  - `lib/` - API client and query utilities
- `server/` - Express.js backend
- `shared/` - Shared types and database schema
- `assets/` - Images and icons

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Purpose**: Minimal backend for potential future features (currently serves landing page and handles CORS)
- **Storage**: In-memory storage implementation with interface for future database integration

### Data Storage
- **Current**: In-memory storage (`MemStorage` class in `server/storage.ts`)
- **Database Schema**: Drizzle ORM with PostgreSQL schema defined but not yet connected
- **Game State**: Local component state (no persistence currently implemented)

### Key Design Patterns
- **Path Aliases**: `@/` maps to `client/`, `@shared/` maps to `shared/`
- **Theming**: Dark-first design with `MazeColors` palette (background: #1A1A2E, player: #E94560)
- **Error Handling**: ErrorBoundary component wraps the app with fallback UI
- **Safe Area**: Consistent use of `react-native-safe-area-context` for device insets

### Game Mechanics
- **Maze Generation**: Recursive Backtracker (DFS) algorithm generates guaranteed-solvable 7x7 mazes
  - Starts from the start position, ensuring all cells are connected
  - New random maze generated for each game or replay
  - Difficulty levels vary start/end positions for variety
- Maze data stored as grid of cells with wall definitions (north, south, east, west booleans)
- Player movement via tap-to-move: tap any cell and the car moves there if a valid path exists
- BFS pathfinding algorithm finds the shortest path to the target cell
- Move counter increments by the number of cells in the path (not just one per tap)
- Wall collision detection based on cell wall properties
- Haptic feedback on movement and blocked moves
- Confetti animation and star rating (1-3 stars based on moves) when reaching goal

### Difficulty Levels
- Level 1 (Easy): Start at top-left (0,0), goal at bottom-right (6,6)
- Level 2 (Normal): Adds corner-to-corner variation
- Levels 3-5: More start/end position variations including edge positions
- All mazes use same generation algorithm - complexity comes from random maze structure and varied positions

## External Dependencies

### Core Services
- **Expo**: Build and development tooling for React Native
- **Replit**: Hosting environment with domain configuration via `REPLIT_DEV_DOMAIN` and `REPLIT_INTERNAL_APP_DOMAIN`

### Database
- **PostgreSQL**: Configured via `DATABASE_URL` environment variable (not yet provisioned)
- **Drizzle ORM**: Schema defined in `shared/schema.ts` with user table

### Key Libraries
- `expo-haptics` - Vibration feedback for game interactions
- `react-native-reanimated` - High-performance animations
- `react-native-gesture-handler` - Touch gesture handling
- `@tanstack/react-query` - Server state management
- `drizzle-orm` + `drizzle-zod` - Database ORM with validation