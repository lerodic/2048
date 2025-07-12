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
