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

export const LEVEL_1_DATA: MazeData = {
  start: { y: 0, x: 0 },
  end: { y: 6, x: 6 },
  grid: [
    [
      { north: true, south: false, east: false, west: true },
      { north: true, south: true, east: false, west: false },
      { north: true, south: false, east: false, west: false },
      { north: true, south: true, east: false, west: false },
      { north: true, south: false, east: false, west: false },
      { north: true, south: true, east: false, west: false },
      { north: true, south: false, east: true, west: false },
    ],
    [
      { north: false, south: false, east: true, west: true },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
    ],
    [
      { north: false, south: true, east: false, west: true },
      { north: false, south: false, east: true, west: false },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: true, south: false, east: true, west: true },
    ],
    [
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: false, south: false, east: false, west: true },
      { north: true, south: false, east: true, west: false },
      { north: false, south: true, east: false, west: true },
      { north: true, south: false, east: false, west: false },
      { north: false, south: true, east: true, west: false },
    ],
    [
      { north: false, south: true, east: true, west: true },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: true, south: false, east: false, west: true },
      { north: true, south: true, east: false, west: false },
      { north: false, south: false, east: true, west: false },
      { north: true, south: false, east: true, west: true },
    ],
    [
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: true, south: false, east: false, west: true },
      { north: false, south: true, east: true, west: false },
      { north: false, south: false, east: true, west: true },
    ],
    [
      { north: false, south: true, east: false, west: true },
      { north: true, south: true, east: false, west: false },
      { north: false, south: true, east: true, west: false },
      { north: true, south: true, east: false, west: true },
      { north: false, south: true, east: false, west: false },
      { north: true, south: true, east: false, west: false },
      { north: false, south: true, east: true, west: false },
    ],
  ],
};
