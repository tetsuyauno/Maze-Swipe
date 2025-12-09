# Maze Game

## Overview

A 7×7 maze puzzle game built with React Native and Expo. Players navigate through procedurally designed mazes using swipe gestures. The app features a dark theme with vibrant accent colors, haptic feedback, and smooth animations. No authentication is required as this is a single-user local puzzle game.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React Native with Expo SDK 54
- **Navigation**: React Navigation with native stack navigator (stack-only, no tabs)
- **State Management**: React hooks for local state, TanStack React Query for server state
- **Animations**: React Native Reanimated for smooth, performant animations
- **Gestures**: React Native Gesture Handler with PanResponder for swipe detection
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
- Maze data stored as grid of cells with wall definitions (north, south, east, west booleans)
- Player movement via swipe gestures with minimum 40px threshold
- Wall collision detection based on cell wall properties
- Haptic feedback on movement and collisions

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