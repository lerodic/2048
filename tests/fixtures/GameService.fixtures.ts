import Tile from "../../src/lib/game/entities/Tile";
import type { Position } from "../../src/types";

export function provideSpawnTileTestCases(): {
  availablePositions: Position[];
  tile: Tile;
}[] {
  return [
    {
      availablePositions: [
        { x: 0, y: 0 },
        { x: 1, y: 0 },
      ],
      tile: new Tile({ x: 0, y: 0 }, 2, "1"),
    },
  ];
}

export function provideMoveTilesFailureTestCases() {
  return [
    {
      tiles: [
        new Tile({ x: 0, y: 0 }, 2, "1"),
        new Tile({ x: 1, y: 0 }, 4, "2"),
        new Tile({ x: 2, y: 0 }, 8, "3"),
        new Tile({ x: 3, y: 0 }, 16, "4"),
        new Tile({ x: 0, y: 1 }, 32, "5"),
        new Tile({ x: 1, y: 1 }, 64, "6"),
        new Tile({ x: 2, y: 1 }, 128, "7"),
        new Tile({ x: 3, y: 1 }, 256, "8"),
        new Tile({ x: 0, y: 2 }, 512, "9"),
        new Tile({ x: 1, y: 2 }, 1024, "10"),
        new Tile({ x: 2, y: 2 }, 2048, "11"),
        new Tile({ x: 3, y: 2 }, 4096, "12"),
        new Tile({ x: 0, y: 3 }, 8192, "13"),
        new Tile({ x: 1, y: 3 }, 16384, "14"),
        new Tile({ x: 2, y: 3 }, 32768, "15"),
        new Tile({ x: 3, y: 3 }, 65536, "16"),
      ],
      direction: "Right",
    },
  ];
}

export function provideEvaluateGameStateFalseTestCases() {
  return [
    {
      tiles: [
        new Tile({ x: 0, y: 0 }, 2, "1"),
        new Tile({ x: 1, y: 0 }, 4, "2"),
        new Tile({ x: 2, y: 0 }, 8, "3"),
        new Tile({ x: 3, y: 0 }, 16, "4"),
        new Tile({ x: 0, y: 1 }, 32, "5"),
        new Tile({ x: 1, y: 1 }, 64, "6"),
        new Tile({ x: 2, y: 1 }, 128, "7"),
        new Tile({ x: 3, y: 1 }, 256, "8"),
        new Tile({ x: 0, y: 2 }, 512, "9"),
        new Tile({ x: 1, y: 2 }, 1024, "10"),
        new Tile({ x: 2, y: 2 }, 2048, "11"),
        new Tile({ x: 3, y: 2 }, 4096, "12"),
        new Tile({ x: 0, y: 3 }, 8192, "13"),
        new Tile({ x: 1, y: 3 }, 16384, "14"),
        new Tile({ x: 2, y: 3 }, 32768, "15"),
        new Tile({ x: 3, y: 3 }, 65536, "16"),
      ],
    },
  ];
}
