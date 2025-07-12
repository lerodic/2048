import Tile from "../../src/lib/game/entities/Tile";
import type { Position, ValidCoordinate } from "../../src/types";

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
