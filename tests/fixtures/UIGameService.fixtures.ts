import Tile from "../../src/lib/game/entities/Tile";
import type {
  Direction,
  Position,
  TileTravelDistance,
} from "../../src/types.d";

export function provideSpawnTileTestCases() {
  return [
    {
      position: {
        x: 0,
        y: 0,
      } as Position,
      positionalIndex: 0,
      id: "1",
    },
    {
      position: {
        x: 2,
        y: 0,
      } as Position,
      positionalIndex: 2,
      id: "2",
    },
    {
      position: {
        x: 1,
        y: 3,
      } as Position,
      positionalIndex: 13,
      id: "3",
    },
    {
      position: {
        x: 3,
        y: 3,
      } as Position,
      positionalIndex: 15,
      id: "4",
    },
    {
      position: {
        x: 2,
        y: 1,
      } as Position,
      positionalIndex: 6,
      id: "5",
    },
  ];
}

export function provideMoveTileTestCases() {
  return [
    {
      tile: new Tile({ x: 0, y: 0 }, 2, "1"),
      direction: "Down",
      distance: 2,
      movementClass: "move-tile-down-2",
    },
  ] as {
    tile: Tile;
    direction: Direction;
    distance: TileTravelDistance;
    movementClass: string;
  }[];
}

export function provideMergeTilesTestCases() {
  return [
    {
      tile: new Tile({ x: 1, y: 0 }, 2, "1"),
      mergedInto: new Tile({ x: 0, y: 0 }, 2, "1"),
      direction: "Left",
      distance: 1,
      movementClass: "move-tile-left-1",
    },
  ] as {
    tile: Tile;
    mergedInto: Tile;
    direction: Direction;
    distance: TileTravelDistance;
    movementClass: string;
  }[];
}
