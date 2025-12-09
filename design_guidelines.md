# Design Guidelines: 7×7 Maze Game

## Architecture Decisions

### Authentication
**No Auth Required** - This is a single-user puzzle game with local gameplay.
- No login/signup screens needed
- Implement a simple **Settings screen** accessible via a gear icon in the header with:
  - Sound effects toggle
  - Haptic feedback toggle
  - Reset progress button

### Navigation
**Stack-Only Navigation** - Linear game flow
- Main Game Screen (default)
- Settings Screen (modal)

## Screen Specifications

### Main Game Screen
**Purpose:** Primary gameplay interface for navigating the maze

**Layout:**
- **Header:**
  - Transparent background
  - Right button: Settings gear icon (Feather: "settings")
  - Title: "Maze Level 1" (centered)
  
- **Main Content:**
  - Non-scrollable fixed view
  - Centered 7×7 grid taking up majority of screen space
  - Player position indicator overlaid on grid
  - Bottom instruction text: "Swipe to move"
  
- **Safe Area Insets:**
  - Top: `insets.top + Spacing.xl`
  - Bottom: `insets.bottom + Spacing.xl`
  - Left/Right: `Spacing.lg`

**Components:**
- 7×7 grid container (equal width/height cells)
- Cell components with conditional wall borders
- Player indicator (animated circle/square)
- Instruction text label

### Settings Screen
**Purpose:** Game preferences and controls

**Layout:**
- **Header:**
  - Default navigation header with back button
  - Title: "Settings"
  
- **Main Content:**
  - Scrollable form layout
  - Toggle switches for preferences
  - Destructive action button at bottom

**Components:**
- Toggle switches with labels
- Primary button (Reset Progress) with confirmation alert

## Design System

### Color Palette
**Primary Colors:**
- **Background:** `#1A1A2E` (Dark blue-gray)
- **Grid Path:** `#16213E` (Slightly lighter blue-gray)
- **Walls:** `#0F3460` (Deep blue - rendered as thick borders)
- **Player:** `#E94560` (Vibrant coral/pink)
- **Accent:** `#533483` (Purple for UI elements)

**UI Colors:**
- **Text Primary:** `#FFFFFF`
- **Text Secondary:** `#A0A0B0`
- **Success:** `#4ECDC4`
- **Disabled:** `#4A4A5A`

### Typography
- **Header Title:** 18pt, SemiBold, System font
- **Instruction Text:** 14pt, Regular, System font
- **Settings Labels:** 16pt, Medium, System font

### Spacing
- **xl:** 24px
- **lg:** 16px
- **md:** 12px
- **sm:** 8px
- **xs:** 4px

### Grid Specifications
- **Cell Size:** Calculate dynamically as `(screenWidth - 2 * Spacing.xl) / 7`
- **Wall Thickness:** 3px solid borders
- **Wall Rendering:**
  - North wall: `borderTopWidth: 3, borderTopColor: '#0F3460'`
  - South wall: `borderBottomWidth: 3, borderBottomColor: '#0F3460'`
  - East wall: `borderRightWidth: 3, borderRightColor: '#0F3460'`
  - West wall: `borderLeftWidth: 3, borderLeftColor: '#0F3460'`
- **Cell Background:** `#16213E` (path cells)

### Player Indicator
- **Shape:** Circle (use `borderRadius` equal to half width/height)
- **Size:** 60% of cell size
- **Color:** `#E94560`
- **Position:** Centered within current cell
- **Shadow (iOS):**
  - shadowOffset: `{ width: 0, height: 2 }`
  - shadowOpacity: `0.3`
  - shadowRadius: `4`
  - shadowColor: `#E94560`
- **Elevation (Android):** 4

### Interaction Design

**Swipe Gesture Feedback:**
- **Valid Move:** Player indicator animates smoothly to new cell (200ms duration, easeOut)
- **Invalid Move (wall collision):**
  - Subtle shake animation (horizontal 5px oscillation, 150ms)
  - Optional: Brief haptic feedback (if enabled)
  - Player remains in current position

**Visual Feedback:**
- All touchable elements (settings button) scale down to 95% when pressed
- Settings button should have subtle opacity change (0.7) on press

**Swipe Detection:**
- Minimum swipe distance: 40px
- Swipe angle tolerance: ±45° from cardinal directions
- No visual indicator during swipe (player moves on release)

### Accessibility
- Ensure minimum touch target size of 44×44pt for settings button
- Provide sufficient color contrast (all combinations meet WCAG AA)
- Support dynamic type scaling for instruction text
- Consider adding sound effects as alternative feedback for wall collisions

### Assets Required
**None** - Use system icons and programmatic shapes:
- Settings icon: Feather "settings" from @expo/vector-icons
- Player: Programmatically rendered circle with gradient (optional enhancement)

### Notes
- Grid should maintain aspect ratio on all screen sizes
- Use `AspectRatio` or calculate square dimensions to prevent distortion
- Center grid vertically in available space between header and instruction text
- Instruction text should pulse gently on first launch (optional onboarding hint)