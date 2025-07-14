import "reflect-metadata";
import TileFactory from "../src/lib/game/factories/TileFactory";
import { describe, it, vi, beforeEach, expect, afterEach } from "vitest";
import { Position } from "../src/types.d";

describe("TileFactory", () => {
  let tileFactory: TileFactory;

  beforeEach(() => {
    tileFactory = new TileFactory();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("create", () => {
    it.each([
      {
        availablePositions: [{ x: 0, y: 0 }],
        value: 2,
        position: { x: 0, y: 0 },
      },
      {
        availablePositions: [
          { x: 0, y: 3 },
          { x: 2, y: 0 },
        ],
        value: 4,
        position: { x: 2, y: 1 },
      },
    ])(
      "should create tile with value: $value and position: (x: $position.x, y: $position.y)",
      ({ availablePositions, value, position }) => {
        const getRandomTilePosition = vi.spyOn(
          tileFactory as any,
          "getRandomPosition"
        );
        const getRandomTileValue = vi.spyOn(
          tileFactory as any,
          "getRandomValue"
        );
        getRandomTileValue.mockImplementation(() => value);
        getRandomTilePosition.mockImplementation(() => position);

        const tile = tileFactory.create(availablePositions as Position[]);

        expect(tile.position.x).toStrictEqual(position.x);
        expect(tile.position.y).toStrictEqual(position.y);
        expect(tile.value).toStrictEqual(value);
      }
    );
  });
});
