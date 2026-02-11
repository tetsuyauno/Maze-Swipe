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
  rows: number;
  cols: number;
}

export type CarIconName = "submarine" | "gorilla" | "police" | "helicopter" | "ambulance" | "fire_engine";

export const CAR_ICONS: { name: CarIconName; label: string; image: any }[] = [
  { name: "submarine", label: "Submarine", image: require("../../assets/images/submarine.png") },
  { name: "gorilla", label: "Gorilla", image: require("../../assets/images/gorilla.png") },
  { name: "police", label: "Police", image: require("../../assets/images/police.png") },
  { name: "helicopter", label: "Helicopter", image: require("../../assets/images/helicopter.png") },
  { name: "ambulance", label: "Ambulance", image: require("../../assets/images/ambulance.png") },
  { name: "fire_engine", label: "Fire Engine", image: require("../../assets/images/fire_engine.png") },
];

export interface MazeSizeConfig {
  rows: number;
  cols: number;
  label: string;
  icon: "grid" | "square" | "maximize" | "layout" | "box";
}

export const LEVEL_IMAGES: Record<number, any> = {
  1: require("../../assets/levels/level1.png"),
  2: require("../../assets/levels/level2.png"),
  3: require("../../assets/levels/level3.png"),
  4: require("../../assets/levels/level4.png"),
  5: require("../../assets/levels/level5.png"),
};


import { Dimensions } from "react-native";

export const MAZE_BASE_SIZES: Record<number, { large: number; small: number; label: string }> = {
  1: { large: 5, small: 3, label: "5 x 3" },
  2: { large: 6, small: 4, label: "6 x 4" },
  3: { large: 7, small: 5, label: "7 x 5" },
  4: { large: 8, small: 5, label: "8 x 5" },
  5: { large: 9, small: 6, label: "9 x 6" },
};

export function getDynamicMazeSize(level: number): { rows: number; cols: number } {
  const { width, height } = Dimensions.get("window");
  const isPortrait = height >= width;
  const config = MAZE_BASE_SIZES[level] || MAZE_BASE_SIZES[1];

  return {
    rows: isPortrait ? config.large : config.small,
    cols: isPortrait ? config.small : config.large,
  };
}

export const MAZE_SIZES: Record<number, MazeSizeConfig> = {
  1: { rows: 3, cols: 5, label: "5 x 3", icon: "grid" },
  2: { rows: 4, cols: 6, label: "6 x 4", icon: "square" },
  3: { rows: 5, cols: 7, label: "7 x 5", icon: "maximize" },
  4: { rows: 5, cols: 8, label: "8 x 5", icon: "layout" },
  5: { rows: 6, cols: 9, label: "9 x 6", icon: "box" },
};

type Direction = 'north' | 'south' | 'east' | 'west';

interface Cell {
  y: number;
  x: number;
}

const DIRECTIONS: { dir: Direction; dy: number; dx: number; opposite: Direction }[] = [
  { dir: 'north', dy: -1, dx: 0, opposite: 'south' },
  { dir: 'south', dy: 1, dx: 0, opposite: 'north' },
  { dir: 'east', dy: 0, dx: 1, opposite: 'west' },
  { dir: 'west', dy: 0, dx: -1, opposite: 'east' },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createEmptyGrid(rows: number, cols: number): CellWalls[][] {
  const grid: CellWalls[][] = [];
  for (let y = 0; y < rows; y++) {
    const row: CellWalls[] = [];
    for (let x = 0; x < cols; x++) {
      row.push({ north: true, south: true, east: true, west: true });
    }
    grid.push(row);
  }
  return grid;
}

function isValidCell(y: number, x: number, rows: number, cols: number): boolean {
  return y >= 0 && y < rows && x >= 0 && x < cols;
}

function generateMazeFromCell(startY: number, startX: number, rows: number, cols: number): CellWalls[][] {
  const grid = createEmptyGrid(rows, cols);
  const visited: boolean[][] = Array(rows).fill(null).map(() => Array(cols).fill(false));
  const stack: Cell[] = [];

  stack.push({ y: startY, x: startX });
  visited[startY][startX] = true;

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const { y, x } = current;

    const shuffledDirections = shuffleArray(DIRECTIONS);
    let foundUnvisited = false;

    for (const { dir, dy, dx, opposite } of shuffledDirections) {
      const newY = y + dy;
      const newX = x + dx;

      if (isValidCell(newY, newX, rows, cols) && !visited[newY][newX]) {
        grid[y][x][dir] = false;
        grid[newY][newX][opposite] = false;

        visited[newY][newX] = true;
        stack.push({ y: newY, x: newX });
        foundUnvisited = true;
        break;
      }
    }

    if (!foundUnvisited) {
      stack.pop();
    }
  }

  return grid;
}

function findFarthestCell(grid: CellWalls[][], start: Cell, rows: number, cols: number): Cell {
  const distances: number[][] = Array(rows).fill(null).map(() => Array(cols).fill(-1));
  const queue: Cell[] = [start];
  distances[start.y][start.x] = 0;

  let farthestCell = start;
  let maxDistance = 0;

  while (queue.length > 0) {
    const current = queue.shift()!;
    const { y, x } = current;
    const currentDistance = distances[y][x];

    if (currentDistance > maxDistance) {
      maxDistance = currentDistance;
      farthestCell = current;
    }

    for (const { dir, dy, dx } of DIRECTIONS) {
      const newY = y + dy;
      const newX = x + dx;

      if (isValidCell(newY, newX, rows, cols) &&
        distances[newY][newX] === -1 &&
        !grid[y][x][dir]) {
        distances[newY][newX] = currentDistance + 1;
        queue.push({ y: newY, x: newX });
      }
    }
  }

  return farthestCell;
}

function getRandomStartPosition(rows: number, cols: number): Cell {
  const corners: Cell[] = [
    { y: 0, x: 0 },
    { y: rows - 1, x: cols - 1 },
    { y: 0, x: cols - 1 },
    { y: rows - 1, x: 0 },
  ];

  return corners[Math.floor(Math.random() * corners.length)];
}

export function generateMaze(level: number): MazeData {
  const clampedLevel = Math.max(1, Math.min(5, level));
  const { rows, cols } = getDynamicMazeSize(clampedLevel);

  const start = getRandomStartPosition(rows, cols);
  const grid = generateMazeFromCell(start.y, start.x, rows, cols);
  const end = findFarthestCell(grid, start, rows, cols);

  return { grid, start, end, rows, cols };
}

export function getRandomMaze(level: number): MazeData {
  return generateMaze(level);
}

export const LEVEL_1_DATA: MazeData = generateMaze(1);
