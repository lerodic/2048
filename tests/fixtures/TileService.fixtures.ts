import Tile from "../../src/lib/game/entities/Tile";
import type { Position, ValidCoordinate } from "../../src/types";

const _tiles = [
  new Tile(
    {
      x: 0,
      y: 0,
    },
    2,
    "1"
  ),
  new Tile(
    {
      x: 1,
      y: 0,
    },
    2,
    "2"
  ),
  new Tile(
    {
      x: 1,
      y: 1,
    },
    4,
    "3"
  ),
];

export function provideGetUnoccupiedSpotsTestCases() {
  return [
    {
      tiles: [
        new Tile({ x: 0, y: 0 }, 2, "1"),
        new Tile({ x: 3, y: 2 }, 2, "2"),
      ],
      expected: [
        {
          x: 0,
          y: 1,
        },
        {
          x: 0,
          y: 2,
        },
        {
          x: 0,
          y: 3,
        },
        {
          x: 1,
          y: 0,
        },
        {
          x: 1,
          y: 1,
        },
        {
          x: 1,
          y: 2,
        },
        {
          x: 1,
          y: 3,
        },
        {
          x: 2,
          y: 0,
        },
        {
          x: 2,
          y: 1,
        },
        {
          x: 2,
          y: 2,
        },
        {
          x: 2,
          y: 3,
        },
        {
          x: 3,
          y: 0,
        },
        {
          x: 3,
          y: 1,
        },
        {
          x: 3,
          y: 3,
        },
      ],
    },
  ];
}

export function provideSpawnTestCases(): { tile: Tile; position: Position }[] {
  const testCases: { tile: Tile; position: Position }[] = [];

  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      const position = { x: x as ValidCoordinate, y: y as ValidCoordinate };

      testCases.push({
        tile: new Tile(position, 2, (y * 4 + x).toString()),
        position,
      });
    }
  }

  return testCases;
}

export function provideIsAnyActionPossibleTrueTestCases() {
  return [
    {
      tiles: [new Tile({ x: 0, y: 0 }, 2, "1")],
    },
    {
      tiles: [
        new Tile({ x: 0, y: 2 }, 2, "1"),
        new Tile({ x: 1, y: 3 }, 2, "2"),
      ],
    },
    {
      tiles: [
        new Tile({ x: 0, y: 2 }, 2, "1"),
        new Tile({ x: 1, y: 3 }, 2, "2"),
        new Tile({ x: 2, y: 2 }, 2, "3"),
      ],
    },
    {
      tiles: [
        new Tile({ x: 0, y: 2 }, 2, "1"),
        new Tile({ x: 1, y: 3 }, 2, "2"),
        new Tile({ x: 2, y: 2 }, 4, "3"),
        new Tile({ x: 2, y: 1 }, 16, "4"),
        new Tile({ x: 2, y: 0 }, 4, "5"),
        new Tile({ x: 2, y: 3 }, 8, "6"),
        new Tile({ x: 0, y: 3 }, 4, "7"),
        new Tile({ x: 0, y: 1 }, 2, "8"),
        new Tile({ x: 1, y: 2 }, 4, "9"),
        new Tile({ x: 1, y: 1 }, 2, "10"),
        new Tile({ x: 3, y: 0 }, 2, "11"),
      ],
    },
  ];
}

export function provideIsAnyActionPossibleFalseTestCases() {
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

export function provideCanTileBeMovedTrueTestCases() {
  return [
    {
      tiles: [_tiles[0]],
      tile: _tiles[0],
      direction: "Right",
    },
    {
      tiles: [_tiles[0]],
      tile: _tiles[0],
      direction: "Down",
    },
    {
      tiles: [_tiles[1]],
      tile: _tiles[1],
      direction: "Right",
    },
    {
      tiles: [_tiles[1]],
      tile: _tiles[1],
      direction: "Left",
    },
    {
      tiles: [_tiles[0], _tiles[1]],
      tile: _tiles[1],
      direction: "Down",
    },
  ];
}

export function provideCanTileBeMovedFalseTestCases() {
  return [
    {
      tiles: [_tiles[0]],
      tile: _tiles[0],
      direction: "Up",
    },
    {
      tiles: [_tiles[0]],
      tile: _tiles[0],
      direction: "Left",
    },
    {
      tiles: [_tiles[0], _tiles[1]],
      tile: _tiles[0],
      direction: "Right",
    },
  ];
}

export function provideCanTileBeMergedTrueTestCases() {
  return [
    {
      tiles: [_tiles[0], _tiles[1]],
      tile: _tiles[1],
      direction: "Left",
    },
  ];
}

export function provideCanTileBeMergedFalseTestCases() {
  return [
    {
      tiles: [_tiles[0], _tiles[1], _tiles[2]],
      tile: _tiles[2],
      direction: "Up",
    },
  ];
}

export function provideGetSortedTilesTestCases() {
  return [
    {
      input: [new Tile({ x: 0, y: 0 }, 2, "1")],
      direction: "Down",
      sortedIds: ["1"],
    },
    {
      input: [
        new Tile({ x: 0, y: 0 }, 2, "1"),
        new Tile({ x: 0, y: 2 }, 2, "2"),
      ],
      direction: "Down",
      sortedIds: ["2", "1"],
    },
    {
      input: [
        new Tile({ x: 0, y: 0 }, 2, "1"),
        new Tile({ x: 0, y: 2 }, 2, "2"),
        new Tile({ x: 3, y: 2 }, 2, "3"),
      ],
      direction: "Down",
      sortedIds: ["2", "3", "1"],
    },
    {
      input: [
        new Tile({ x: 0, y: 0 }, 2, "1"),
        new Tile({ x: 2, y: 2 }, 2, "2"),
        new Tile({ x: 1, y: 2 }, 2, "3"),
        new Tile({ x: 3, y: 2 }, 2, "4"),
      ],
      direction: "Right",
      sortedIds: ["4", "2", "3", "1"],
    },
  ];
}

export function provideMergedTiles() {
  const tiles: Tile[] = [];

  for (let x = 0; x < 4; x++) {
    for (let y = 0; y < 2; y++) {
      tiles.push(
        new Tile(
          { x: x as ValidCoordinate, y: y as ValidCoordinate },
          2,
          `${y * 4 + x}`
        )
      );
      tiles[tiles.length - 1].setMerged();
    }
  }

  return tiles;
}

export function provideMergeSuccessTestCases() {
  const tilesCopy = [..._tiles];

  return [
    {
      tiles: [tilesCopy[0], tilesCopy[1]],
      tile: tilesCopy[1],
      direction: "Left",
    },
  ];
}

export function provideMergeFailureTestCases() {
  const tilesCopy = [..._tiles];

  return [
    {
      tiles: [tilesCopy[0], tilesCopy[2]],
      tile: tilesCopy[0],
      direction: "Right",
    },
  ];
}
