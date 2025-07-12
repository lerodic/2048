import type { Position } from "../../src/types.d";

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
