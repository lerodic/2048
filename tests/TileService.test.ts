import "reflect-metadata";
import TileService from "../src/lib/game/services/TileService";
import { describe, it, expect } from "vitest";
import Tile from "../src/lib/game/entities/Tile";
import {
  provideGetUnoccupiedSpotsTestCases,
  provideSpawnTestCases,
} from "./fixtures/TileService.fixtures";

function createTileService(tiles: Tile[] = []): TileService {
  return new TileService(tiles);
}

describe("TileService", () => {
  let tileService: TileService;

  describe("getUnoccupiedPositions", () => {
    it.each(provideGetUnoccupiedSpotsTestCases())(
      "should return all unoccupied spots",
      ({ tiles, expected }) => {
        tileService = createTileService(tiles);

        const result = tileService.getUnoccupiedPositions();

        expect(result).toStrictEqual(expected);
      }
    );
  });

  describe("spawn", () => {
    it.each(provideSpawnTestCases())(
      "should spawn tile with position x: $position.x and y: $position.y",
      ({ tile, position }) => {
        tileService = new TileService();

        tileService.spawn(tile);

        expect((tileService as any).tiles.includes(tile)).toBe(true);
      }
    );
  });
});
