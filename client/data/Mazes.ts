export interface CellWalls {
  north: boolean;
  south: boolean;
  east: boolean;
  west: boolean;
}

export interface MazeData {
  grid: CellWalls[][];
  start: { y: number; x: number };
  end: { y: number; x: number };
}

export type CarIconName = "truck" | "navigation" | "compass" | "send" | "zap" | "star";

export const CAR_ICONS: { name: CarIconName; label: string }[] = [
  { name: "truck", label: "Truck" },
  { name: "navigation", label: "Arrow" },
  { name: "compass", label: "Compass" },
  { name: "send", label: "Rocket" },
  { name: "zap", label: "Bolt" },
  { name: "star", label: "Star" },
];

// Level 1 - Easy, mostly straight paths
export const LEVEL_1_MAZES: MazeData[] = [
  {
    start: { y: 0, x: 0 },
    end: { y: 6, x: 6 },
    grid: [
      [{ north: true, south: false, east: false, west: true }, { north: true, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: false, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: false, south: false, east: true, west: false }],
      [{ north: false, south: false, east: true, west: true }, { north: false, south: false, east: false, west: true }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: true, west: true }],
      [{ north: false, south: false, east: true, west: true }, { north: false, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: false, south: false, east: true, west: false }],
      [{ north: false, south: false, east: true, west: true }, { north: false, south: false, east: false, west: true }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: true, west: true }],
      [{ north: false, south: false, east: true, west: true }, { north: false, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: false, south: false, east: true, west: false }],
      [{ north: false, south: true, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }],
    ],
  },
  {
    start: { y: 0, x: 0 },
    end: { y: 6, x: 6 },
    grid: [
      [{ north: true, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: true, east: true, west: false }],
      [{ north: false, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: false, south: false, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: false, south: false, east: true, west: false }],
      [{ north: false, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: true, west: true }],
      [{ north: false, south: false, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: false, south: false, east: true, west: false }],
      [{ north: false, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: true, west: true }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: true, east: false, west: true }, { north: true, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }],
    ],
  },
];

// Level 2 - Moderate with a few turns
export const LEVEL_2_MAZES: MazeData[] = [
  {
    start: { y: 0, x: 0 },
    end: { y: 6, x: 6 },
    grid: [
      [{ north: true, south: false, east: false, west: true }, { north: true, south: true, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: false, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: false, south: false, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: false, south: true, east: true, west: false }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: true, south: true, east: false, west: false }, { north: false, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: true, west: true }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }],
    ],
  },
  {
    start: { y: 3, x: 0 },
    end: { y: 3, x: 6 },
    grid: [
      [{ north: true, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: true, east: false, west: false }, { north: true, south: false, east: false, west: false }, { north: true, south: true, east: true, west: false }],
      [{ north: false, south: true, east: true, west: true }, { north: false, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: false, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: false, south: false, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: false, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: true, east: true, west: true }, { north: false, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: false, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: true, east: false, west: false }, { north: false, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
    ],
  },
];

// Level 3 - Medium complexity with more dead ends
export const LEVEL_3_MAZES: MazeData[] = [
  {
    start: { y: 0, x: 0 },
    end: { y: 6, x: 6 },
    grid: [
      [{ north: true, south: false, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: true, south: true, east: false, west: false }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: false, west: false }, { north: true, south: true, east: true, west: false }],
      [{ north: false, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
    ],
  },
  {
    start: { y: 6, x: 0 },
    end: { y: 0, x: 6 },
    grid: [
      [{ north: true, south: false, east: true, west: true }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: true, west: true }],
    ],
  },
];

// Level 4 - Hard with complex paths
export const LEVEL_4_MAZES: MazeData[] = [
  {
    start: { y: 0, x: 0 },
    end: { y: 6, x: 6 },
    grid: [
      [{ north: true, south: false, east: false, west: true }, { north: true, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: true, west: true }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: false, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: true, south: true, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
    ],
  },
  {
    start: { y: 3, x: 3 },
    end: { y: 6, x: 6 },
    grid: [
      [{ north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: false, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }],
      [{ north: false, south: true, east: true, west: true }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
    ],
  },
];

// Level 5 - Expert with many dead ends and complex solutions
export const LEVEL_5_MAZES: MazeData[] = [
  {
    start: { y: 0, x: 0 },
    end: { y: 6, x: 6 },
    grid: [
      [{ north: true, south: false, east: true, west: true }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: true, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
    ],
  },
  {
    start: { y: 6, x: 6 },
    end: { y: 0, x: 0 },
    grid: [
      [{ north: true, south: false, east: true, west: true }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: false, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
      [{ north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: false, east: true, west: false }, { north: true, south: false, east: true, west: true }],
      [{ north: true, south: true, east: true, west: true }, { north: false, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: true, south: true, east: true, west: false }, { north: false, south: true, east: false, west: true }, { north: false, south: true, east: true, west: false }],
    ],
  },
];

export const ALL_MAZES = {
  1: LEVEL_1_MAZES,
  2: LEVEL_2_MAZES,
  3: LEVEL_3_MAZES,
  4: LEVEL_4_MAZES,
  5: LEVEL_5_MAZES,
};

export function getRandomMaze(level: number): MazeData {
  const mazes = ALL_MAZES[level as keyof typeof ALL_MAZES] || LEVEL_1_MAZES;
  const randomIndex = Math.floor(Math.random() * mazes.length);
  return mazes[randomIndex];
}

// Keep LEVEL_1_DATA for backwards compatibility
export const LEVEL_1_DATA = LEVEL_1_MAZES[0];
