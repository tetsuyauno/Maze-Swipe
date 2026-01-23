import { Platform } from "react-native";

export const MazeColors = {
  background: "#FFE5B4",
  gridPath: "#FFF8DC",
  walls: "#8B4513",
  player: "#FF6B35",
  accent: "#9B59B6",
  textPrimary: "#2C3E50",
  textSecondary: "#7F8C8D",
  success: "#2ECC71",
  disabled: "#BDC3C7",
  headerBg: "#87CEEB",
};

export type MazeTheme = {
  name: string;
  icon: string;
  background: string;
  gridPath: string;
  walls: string;
  pathHighlight: string;
  goalColor: string;
};

export const MAZE_THEMES: Record<string, MazeTheme> = {
  classic: {
    name: "Classic",
    icon: "sun",
    background: "#FFE5B4",
    gridPath: "#FFF8DC",
    walls: "#8B4513",
    pathHighlight: "rgba(255, 165, 0, 0.4)",
    goalColor: "#90EE90",
  },
  candy: {
    name: "Candy",
    icon: "heart",
    background: "#FFB6C1",
    gridPath: "#FFF0F5",
    walls: "#FF69B4",
    pathHighlight: "rgba(255, 105, 180, 0.3)",
    goalColor: "#98FB98",
  },
  ocean: {
    name: "Ocean",
    icon: "droplet",
    background: "#87CEEB",
    gridPath: "#E0FFFF",
    walls: "#4169E1",
    pathHighlight: "rgba(65, 105, 225, 0.3)",
    goalColor: "#FFD700",
  },
  jungle: {
    name: "Jungle",
    icon: "feather",
    background: "#90EE90",
    gridPath: "#F0FFF0",
    walls: "#228B22",
    pathHighlight: "rgba(34, 139, 34, 0.3)",
    goalColor: "#FFD700",
  },
  space: {
    name: "Space",
    icon: "star",
    background: "#2C3E50",
    gridPath: "#34495E",
    walls: "#9B59B6",
    pathHighlight: "rgba(155, 89, 182, 0.4)",
    goalColor: "#FFD700",
  },
};

const tintColorLight = "#FF6B35";
const tintColorDark = "#FF6B35";

export const Colors = {
  light: {
    text: MazeColors.textPrimary,
    buttonText: "#FFFFFF",
    tabIconDefault: MazeColors.textSecondary,
    tabIconSelected: tintColorLight,
    link: MazeColors.player,
    backgroundRoot: MazeColors.background,
    backgroundDefault: MazeColors.gridPath,
    backgroundSecondary: MazeColors.walls,
    backgroundTertiary: MazeColors.accent,
  },
  dark: {
    text: MazeColors.textPrimary,
    buttonText: "#FFFFFF",
    tabIconDefault: MazeColors.textSecondary,
    tabIconSelected: tintColorDark,
    link: MazeColors.player,
    backgroundRoot: MazeColors.background,
    backgroundDefault: MazeColors.gridPath,
    backgroundSecondary: MazeColors.walls,
    backgroundTertiary: MazeColors.accent,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  "2xl": 32,
  "3xl": 40,
  "4xl": 48,
  "5xl": 56,
  inputHeight: 48,
  buttonHeight: 52,
};

export const BorderRadius = {
  xs: 8,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  "2xl": 40,
  "3xl": 50,
  full: 9999,
};

export const Typography = {
  h1: {
    fontSize: 32,
    fontWeight: "700" as const,
  },
  h2: {
    fontSize: 28,
    fontWeight: "700" as const,
  },
  h3: {
    fontSize: 24,
    fontWeight: "600" as const,
  },
  h4: {
    fontSize: 20,
    fontWeight: "600" as const,
  },
  body: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
  small: {
    fontSize: 14,
    fontWeight: "400" as const,
  },
  link: {
    fontSize: 16,
    fontWeight: "400" as const,
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: "system-ui",
    serif: "ui-serif",
    rounded: "ui-rounded",
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
