import "reflect-metadata";
import Tile from "../src/lib/game/entities/Tile";
import { describe, it, expect, vi } from "vitest";
import {
  provideIncreaseTwofoldTestCases,
  provideMoveDownTestCases,
  provideMoveLeftTestCases,
  provideMoveRightTestCases,
  provideMoveUpTestCases,
} from "./fixtures/Tile.fixtures";

describe("Tile", () => {
  describe("markAsSpawned", () => {
    it("should mark tile as spawned", () => {
      const tile = new Tile({ x: 0, y: 0 }, 2, "1");
      const initialHtml = tile.asHtml;

      tile.markAsSpawned();

      expect(initialHtml).toStrictEqual(`
    <div class="tile value-2 spawning" data-tile-id="1">
      <p class="tile-value">2</p>
    </div>
    `);
      expect(tile.asHtml).toStrictEqual(
        `
    <div class="tile value-2" data-tile-id="1">
      <p class="tile-value">2</p>
    </div>
    `
      );
    });
  });

  describe("moveUp", () => {
    it.each(provideMoveUpTestCases())(
      "should move tile upward and set position to { x: $expected.x, y: $expected.y }",
      ({ initial, expected }) => {
        const tile = new Tile(initial, 2, "1");

        tile.moveUp();

        expect(tile.position).toStrictEqual(expected);
      }
    );
  });

  describe("moveDown", () => {
    it.each(provideMoveDownTestCases())(
      "should move tile downward and set position to { x: $expected.x, y: $expected.y }",
      ({ initial, expected }) => {
        const tile = new Tile(initial, 2, "1");

        tile.moveDown();

        expect(tile.position).toStrictEqual(expected);
      }
    );
  });

  describe("moveLeft", () => {
    it.each(provideMoveLeftTestCases())(
      "should move tile to the left and set position to { x: $expected.x, y: $expected.y }",
      ({ initial, expected }) => {
        const tile = new Tile(initial, 2, "1");

        tile.moveLeft();

        expect(tile.position).toStrictEqual(expected);
      }
    );
  });

  describe("moveRight", () => {
    it.each(provideMoveRightTestCases())(
      "should move tile to the right and set position to { x: $expected.x, y: $expected.y }",
      ({ initial, expected }) => {
        const tile = new Tile(initial, 2, "1");

        tile.moveRight();

        expect(tile.position).toStrictEqual(expected);
      }
    );
  });

  describe("setMerged", () => {
    it("should set merged status of tile to true", () => {
      const tile = new Tile(
        {
          x: 0,
          y: 0,
        },
        2,
        "1"
      );

      tile.setMerged();

      expect(tile.hasBeenMerged).toBe(true);
    });
  });

  describe("resetMerged", () => {
    it("should reset merged status of tile", () => {
      const tile = new Tile(
        {
          x: 0,
          y: 0,
        },
        2,
        "1"
      );
      tile.setMerged();

      tile.resetMerged();

      expect(tile.hasBeenMerged).toBe(false);
    });
  });

  describe("increaseTwofold", () => {
    it.each(provideIncreaseTwofoldTestCases())(
      "should double value: $initial to $expected",
      ({ initial, expected }) => {
        const tile = new Tile(
          {
            x: 0,
            y: 0,
          },
          initial,
          "1"
        );

        tile.increaseTwofold();

        expect(tile.value).toStrictEqual(expected);
      }
    );
  });
});
