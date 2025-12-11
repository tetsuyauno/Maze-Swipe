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

const GRID_SIZE = 7;

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

function createEmptyGrid(): CellWalls[][] {
  const grid: CellWalls[][] = [];
  for (let y = 0; y < GRID_SIZE; y++) {
    const row: CellWalls[] = [];
    for (let x = 0; x < GRID_SIZE; x++) {
      row.push({ north: true, south: true, east: true, west: true });
    }
    grid.push(row);
  }
  return grid;
}

function isValidCell(y: number, x: number): boolean {
  return y >= 0 && y < GRID_SIZE && x >= 0 && x < GRID_SIZE;
}

function generateMazeFromCell(startY: number, startX: number): CellWalls[][] {
  const grid = createEmptyGrid();
  const visited: boolean[][] = Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));
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
      
      if (isValidCell(newY, newX) && !visited[newY][newX]) {
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

function getStartEndPositions(level: number): { start: Cell; end: Cell } {
  const positionSets: { start: Cell; end: Cell }[][] = [
    [{ start: { y: 0, x: 0 }, end: { y: GRID_SIZE - 1, x: GRID_SIZE - 1 } }],
    
    [
      { start: { y: 0, x: 0 }, end: { y: GRID_SIZE - 1, x: GRID_SIZE - 1 } },
      { start: { y: GRID_SIZE - 1, x: 0 }, end: { y: 0, x: GRID_SIZE - 1 } },
    ],
    
    [
      { start: { y: 0, x: 0 }, end: { y: GRID_SIZE - 1, x: GRID_SIZE - 1 } },
      { start: { y: GRID_SIZE - 1, x: 0 }, end: { y: 0, x: GRID_SIZE - 1 } },
      { start: { y: 0, x: GRID_SIZE - 1 }, end: { y: GRID_SIZE - 1, x: 0 } },
    ],
    
    [
      { start: { y: 0, x: 0 }, end: { y: GRID_SIZE - 1, x: GRID_SIZE - 1 } },
      { start: { y: GRID_SIZE - 1, x: 0 }, end: { y: 0, x: GRID_SIZE - 1 } },
      { start: { y: 0, x: GRID_SIZE - 1 }, end: { y: GRID_SIZE - 1, x: 0 } },
      { start: { y: Math.floor(GRID_SIZE / 2), x: 0 }, end: { y: Math.floor(GRID_SIZE / 2), x: GRID_SIZE - 1 } },
    ],
    
    [
      { start: { y: 0, x: 0 }, end: { y: GRID_SIZE - 1, x: GRID_SIZE - 1 } },
      { start: { y: GRID_SIZE - 1, x: 0 }, end: { y: 0, x: GRID_SIZE - 1 } },
      { start: { y: 0, x: GRID_SIZE - 1 }, end: { y: GRID_SIZE - 1, x: 0 } },
      { start: { y: Math.floor(GRID_SIZE / 2), x: 0 }, end: { y: Math.floor(GRID_SIZE / 2), x: GRID_SIZE - 1 } },
      { start: { y: 0, x: Math.floor(GRID_SIZE / 2) }, end: { y: GRID_SIZE - 1, x: Math.floor(GRID_SIZE / 2) } },
    ],
  ];
  
  const levelIndex = Math.max(0, Math.min(4, level - 1));
  const positions = positionSets[levelIndex];
  return positions[Math.floor(Math.random() * positions.length)];
}

export function generateMaze(level: number): MazeData {
  const { start, end } = getStartEndPositions(level);
  
  const grid = generateMazeFromCell(start.y, start.x);
  
  return { grid, start, end };
}

export function getRandomMaze(level: number): MazeData {
  const clampedLevel = Math.max(1, Math.min(5, level));
  return generateMaze(clampedLevel);
}

export const LEVEL_1_DATA: MazeData = generateMaze(1);
