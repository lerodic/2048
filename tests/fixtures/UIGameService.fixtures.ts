import Tile from "../../src/lib/game/entities/Tile";
import type { TileMovedEvent, TilesMergedEvent } from "../../src/types.d";

export const tiles = [
  {
    tiles: [new Tile({ x: 1, y: 1 }, 2, "tile-1")],
    numTiles: 1,
  },
  {
    tiles: [
      new Tile({ x: 0, y: 0 }, 4, "tile-2"),
      new Tile({ x: 2, y: 3 }, 2, "tile-3"),
    ],
    numTiles: 2,
  },
  {
    tiles: [
      new Tile({ x: 0, y: 1 }, 8, "tile-4"),
      new Tile({ x: 1, y: 0 }, 4, "tile-5"),
      new Tile({ x: 3, y: 2 }, 2, "tile-6"),
    ],
    numTiles: 3,
  },
  {
    tiles: [
      new Tile({ x: 2, y: 2 }, 4, "tile-7"),
      new Tile({ x: 0, y: 3 }, 2, "tile-8"),
      new Tile({ x: 3, y: 1 }, 8, "tile-9"),
      new Tile({ x: 1, y: 2 }, 4, "tile-10"),
    ],
    numTiles: 4,
  },
  {
    tiles: [
      new Tile({ x: 2, y: 0 }, 2, "tile-11"),
      new Tile({ x: 3, y: 3 }, 4, "tile-12"),
      new Tile({ x: 1, y: 1 }, 8, "tile-13"),
      new Tile({ x: 0, y: 2 }, 2, "tile-14"),
      new Tile({ x: 3, y: 0 }, 4, "tile-15"),
    ],
    numTiles: 5,
  },
  {
    tiles: [
      new Tile({ x: 0, y: 0 }, 2, "tile-16"),
      new Tile({ x: 0, y: 1 }, 4, "tile-17"),
      new Tile({ x: 0, y: 2 }, 2, "tile-18"),
      new Tile({ x: 0, y: 3 }, 8, "tile-19"),
      new Tile({ x: 1, y: 0 }, 2, "tile-20"),
      new Tile({ x: 1, y: 1 }, 4, "tile-21"),
      new Tile({ x: 1, y: 2 }, 2, "tile-22"),
      new Tile({ x: 1, y: 3 }, 8, "tile-23"),
      new Tile({ x: 2, y: 0 }, 4, "tile-24"),
      new Tile({ x: 2, y: 1 }, 2, "tile-25"),
      new Tile({ x: 2, y: 2 }, 128, "tile-26"),
      new Tile({ x: 2, y: 3 }, 4, "tile-27"),
    ],
    numTiles: 12,
  },
  {
    tiles: [
      new Tile({ x: 0, y: 0 }, 2, "tile-28"),
      new Tile({ x: 0, y: 1 }, 4, "tile-29"),
      new Tile({ x: 0, y: 2 }, 2, "tile-30"),
      new Tile({ x: 0, y: 3 }, 8, "tile-31"),
      new Tile({ x: 1, y: 0 }, 2, "tile-32"),
      new Tile({ x: 1, y: 1 }, 4, "tile-33"),
      new Tile({ x: 1, y: 2 }, 8, "tile-34"),
      new Tile({ x: 1, y: 3 }, 2, "tile-35"),
      new Tile({ x: 2, y: 0 }, 4, "tile-36"),
      new Tile({ x: 2, y: 1 }, 2, "tile-37"),
      new Tile({ x: 2, y: 2 }, 8, "tile-38"),
      new Tile({ x: 2, y: 3 }, 4, "tile-39"),
      new Tile({ x: 3, y: 0 }, 2048, "tile-40"),
      new Tile({ x: 3, y: 1 }, 4096, "tile-41"),
      new Tile({ x: 3, y: 2 }, 2, "tile-42"),
      new Tile({ x: 3, y: 3 }, 4, "tile-43"),
    ],
    numTiles: 16,
  },
];

export function provideSpawnTileTestCases() {
  const tileId = "tile-99";

  return [
    {
      tile: new Tile({ x: 0, y: 0 }, 2, tileId),
      tiles: tiles[2].tiles,
    },
    {
      tile: new Tile({ x: 3, y: 1 }, 4, tileId),
      tiles: tiles[4].tiles,
    },
    {
      tile: new Tile({ x: 3, y: 0 }, 2, tileId),
      tiles: tiles[5].tiles,
    },
  ];
}

export function provideMoveTileTestCases() {
  return [
    {
      tiles: tiles[0].tiles,
      event: {
        tile: tiles[0].tiles[0],
        direction: "Up",
        distance: 1,
      },
    },
    {
      tiles: tiles[1].tiles,
      event: {
        tile: tiles[1].tiles[0],
        direction: "Down",
        distance: 3,
      },
    },
    {
      tiles: tiles[5].tiles,
      event: {
        tile: tiles[5].tiles[0],
        direction: "Right",
        distance: 3,
      },
    },
  ] as { tiles: Tile[]; event: TileMovedEvent }[];
}

export function provideMergeTilesTestCases() {
  return [
    {
      tiles: tiles[3].tiles,
      event: {
        tile: tiles[3].tiles[0],
        mergedInto: tiles[3].tiles[3],
        direction: "Left",
        distance: 1,
      },
    },
  ] as {
    tiles: Tile[];
    event: TilesMergedEvent;
  }[];
}
