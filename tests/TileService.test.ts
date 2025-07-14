import "reflect-metadata";
import TileService from "../src/lib/game/services/TileService";
import { describe, it, expect } from "vitest";
import Tile from "../src/lib/game/entities/Tile";
import {
  provideCanTileBeMergedFalseTestCases,
  provideCanTileBeMergedTrueTestCases,
  provideCanTileBeMovedFalseTestCases,
  provideCanTileBeMovedTrueTestCases,
  provideGetSortedTilesTestCases,
  provideGetUnoccupiedSpotsTestCases,
  provideIsAnyActionPossibleFalseTestCases,
  provideIsAnyActionPossibleTrueTestCases,
  provideMergedTiles,
  provideMergeFailureTestCases,
  provideMergeSuccessTestCases,
  provideSpawnTestCases,
} from "./fixtures/TileService.fixtures";
import { Direction } from "../src/types.d";

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

  describe("isAnyActionPossible", () => {
    it.each(provideIsAnyActionPossibleTrueTestCases())(
      "should return true if at least one tile can be moved or merged",
      ({ tiles }) => {
        tileService = createTileService(tiles);
        const result = tileService.isAnyActionPossible();

        expect(result).toBe(true);
      }
    );

    it.each(provideIsAnyActionPossibleFalseTestCases())(
      "should return false if no action is possible in any direction",
      ({ tiles }) => {
        tileService = createTileService(tiles);
        const result = tileService.isAnyActionPossible();

        expect(result).toBe(false);
      }
    );
  });

  describe("canTileBeMoved", () => {
    it.each(provideCanTileBeMovedTrueTestCases())(
      "should return true if tile can be moved",
      ({ tiles, tile, direction }) => {
        tileService = createTileService(tiles);

        const result = tileService.canTileBeMoved(tile, direction as Direction);

        expect(result).toBe(true);
      }
    );

    it.each(provideCanTileBeMovedFalseTestCases())(
      "should return false if tile can't be moved",
      ({ tiles, tile, direction }) => {
        tileService = createTileService(tiles);

        const result = tileService.canTileBeMoved(tile, direction as Direction);

        expect(result).toBe(false);
      }
    );
  });

  describe("canTileBeMerged", () => {
    it.each(provideCanTileBeMergedTrueTestCases())(
      "should return true if tile can be merged",
      ({ tiles, tile, direction }) => {
        tileService = createTileService(tiles);

        const result = tileService.canTileBeMerged(
          tile,
          direction as Direction
        );

        expect(result).toBe(true);
      }
    );

    it.each(provideCanTileBeMergedFalseTestCases())(
      "should return false if tile can't be merged",
      ({ tiles, tile, direction }) => {
        tileService = createTileService(tiles);

        const result = tileService.canTileBeMerged(
          tile,
          direction as Direction
        );

        expect(result).toBe(false);
      }
    );
  });

  describe("getSortedTiles", () => {
    it.each(provideGetSortedTilesTestCases())(
      "should return tiles with ids: $sortedIds in correct order for direction: $direction",
      ({ input, sortedIds, direction }) => {
        tileService = createTileService(input);

        const result = tileService.getSortedTiles(direction as Direction);

        expect(result.map((tile) => tile.id)).toStrictEqual(sortedIds);
      }
    );
  });

  describe("merge", () => {
    it.each(provideMergeSuccessTestCases())(
      "should merge tiles and return remaining tile",
      ({ tiles, tile, direction }) => {
        tileService = createTileService(tiles);

        const result = tileService.merge(tile, direction as Direction);

        expect(result?.value).toStrictEqual(tile.value * 2);
      }
    );

    it.each(provideMergeFailureTestCases())(
      "should abort if no merge partner can be found",
      ({ tiles, tile, direction }) => {
        tileService = createTileService(tiles);

        const result = tileService.merge(tile, direction as Direction);

        expect(result).toBeUndefined();
      }
    );
  });

  describe("resetMergeStatus", () => {
    it("should reset merged status of all tiles", () => {
      const tiles = provideMergedTiles();
      tileService = createTileService(tiles);

      tileService.resetMergeStatus();

      expect(
        (tileService as any).tiles.every((t: Tile) => t.hasBeenMerged)
      ).toBe(false);
    });
  });
});
