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

export type CarIconName = "truck" | "navigation" | "compass" | "send" | "zap" | "star";

export const CAR_ICONS: { name: CarIconName; label: string }[] = [
  { name: "truck", label: "Truck" },
  { name: "navigation", label: "Arrow" },
  { name: "compass", label: "Compass" },
  { name: "send", label: "Rocket" },
  { name: "zap", label: "Bolt" },
  { name: "star", label: "Star" },
];

export interface MazeSizeConfig {
  rows: number;
  cols: number;
  label: string;
  icon: "grid" | "square" | "maximize" | "layout" | "box";
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

function getStartEndPositions(level: number, rows: number, cols: number): { start: Cell; end: Cell } {
  const cornerPairs: { start: Cell; end: Cell }[] = [
    { start: { y: 0, x: 0 }, end: { y: rows - 1, x: cols - 1 } },
    { start: { y: rows - 1, x: cols - 1 }, end: { y: 0, x: 0 } },
    { start: { y: 0, x: cols - 1 }, end: { y: rows - 1, x: 0 } },
    { start: { y: rows - 1, x: 0 }, end: { y: 0, x: cols - 1 } },
  ];
  
  return cornerPairs[Math.floor(Math.random() * cornerPairs.length)];
}

export function generateMaze(level: number): MazeData {
  const clampedLevel = Math.max(1, Math.min(5, level));
  const sizeConfig = MAZE_SIZES[clampedLevel];
  const { rows, cols } = sizeConfig;
  
  const { start, end } = getStartEndPositions(level, rows, cols);
  const grid = generateMazeFromCell(start.y, start.x, rows, cols);
  
  return { grid, start, end, rows, cols };
}

export function getRandomMaze(level: number): MazeData {
  return generateMaze(level);
}

export const LEVEL_1_DATA: MazeData = generateMaze(1);
