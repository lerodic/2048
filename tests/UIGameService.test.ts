// @vitest-environment happy-dom
import "reflect-metadata";
import UIGameService from "../src/lib/ui/services/UIGameService";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import mitt from "mitt";
import HTMLElementLocator from "../src/lib/ui/services/HTMLElementLocator";
import { AppEvents, Config, EventEmitter } from "../src/types.d";
import {
  provideMergeTilesTestCases,
  provideMoveTileTestCases,
  provideSpawnTileTestCases,
  tiles,
} from "./fixtures/UIGameService.fixtures";
import { setupDOM, setupDOMWithPreExistingTiles } from "./fixtures/ui.fixtures";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("UIGameService", () => {
  let uiGameService: UIGameService;
  let locator: HTMLElementLocator;
  let config: Config;
  let emitter: EventEmitter;

  beforeEach(() => {
    vi.useFakeTimers();

    locator = new HTMLElementLocator();
    config = {
      ANIMATION_DURATION: 250,
    } as Config;
    emitter = vi.mocked(mitt<AppEvents>());
    uiGameService = new UIGameService(locator, config, emitter);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  describe("init", () => {
    it("should init UIGameService", () => {
      setupDOM();

      uiGameService.init();

      vi.advanceTimersByTime(2 * config.ANIMATION_DURATION);

      const gameContainerElement = document.querySelector("#game-container");

      expect(gameContainerElement?.classList.contains("show")).toBe(true);

      vi.advanceTimersByTime(2 * config.ANIMATION_DURATION);

      expect(emitter.emit).toHaveBeenCalledWith("initialAnimationDone");
    });
  });

  describe("removeAllTiles", () => {
    it.each(tiles)("should remove all tiles ($numTiles)", ({ tiles }) => {
      setupDOMWithPreExistingTiles(tiles);

      uiGameService.removeAllTiles();

      vi.advanceTimersByTime(config.ANIMATION_DURATION);

      const tileElements = document.querySelectorAll(".tile");

      expect(tileElements.length).toBe(0);
    });
  });

  describe("spawnTile", () => {
    it.each(provideSpawnTileTestCases())(
      "should spawn tile at position: { x: $tile.position.x, y: $tile.position.y}",
      ({ tile, tiles }) => {
        setupDOMWithPreExistingTiles(tiles);

        uiGameService.spawnTile(tile);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        const tileContainerElement = document.querySelector(
          `.tile-container[data-container-id="${tile.positionalIndex}"]`
        );
        const tileElement = document.querySelector(
          `.tile[data-tile-id="${tile.id}"]`
        );

        expect(tileContainerElement?.innerHTML).toStrictEqual(tile.asHtml);
        expect(tileElement?.classList.contains("spawning")).toBe(false);
      }
    );
  });

  describe("moveTile", () => {
    it.each(provideMoveTileTestCases())(
      "should move tile at { x: $event.tile.position.x, y: $event.tile.position.y} $event.distance step(s) in direction $event.direction",
      ({ tiles, event }) => {
        setupDOMWithPreExistingTiles(tiles);

        uiGameService.moveTile(event);

        const tileElement = document.querySelector(
          `.tile[data-tile-id="${event.tile.id}"]`
        );
        const movementClass = `move-tile-${event.direction.toLowerCase()}-${
          event.distance
        }`;

        expect(tileElement?.classList.contains(movementClass)).toBe(true);
      }
    );
  });

  describe("updateZIndex", () => {
    it.each(tiles)(
      "should update the 'z-index' property correctly",
      ({ tiles }) => {
        const zIndex = 10;
        setupDOMWithPreExistingTiles(tiles);

        uiGameService.updateZIndex({ tile: tiles[0], zIndex });

        const tileElement = document.querySelector(
          `.tile[data-tile-id="${tiles[0].id}"]`
        ) as HTMLDivElement;

        expect(tileElement.style.zIndex).toStrictEqual(zIndex.toString());
      }
    );
  });

  describe("mergeTiles", () => {
    it.each(provideMergeTilesTestCases())(
      "should merge { x: $event.tile.position.x, y: $event.tile.position.y } into { x: $event.mergedInto.position.x, y: $event.mergedInto.position.y }",
      ({ tiles, event }) => {
        setupDOMWithPreExistingTiles(tiles);

        uiGameService.mergeTiles(event);

        const movementClass = `move-tile-${event.direction.toLowerCase()}-${
          event.distance
        }`;
        const tileElementContainsMovementClass = document
          .querySelector(`.tile[data-tile-id="${event.tile.id}"]`)
          ?.classList.contains(movementClass);

        expect(tileElementContainsMovementClass).toBe(true);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        const tileElement = document.querySelector(
          `.tile[data-tile-id="${event.tile.id}"]`
        );

        expect(tileElement).toBeNull();

        const mergedIntoTileElement = document.querySelector(
          `.tile[data-tile-id="${event.mergedInto.id}"]`
        );
        const mergedIntoTileValueElement =
          mergedIntoTileElement?.querySelector(".tile-value");

        expect(mergedIntoTileValueElement?.innerHTML).toStrictEqual(
          event.tile.value.toString()
        );
        expect(
          mergedIntoTileElement?.classList.contains(`value-${event.tile.value}`)
        ).toBe(true);
        expect(mergedIntoTileValueElement?.classList.contains("merged")).toBe(
          true
        );

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(mergedIntoTileValueElement?.classList.contains("merged")).toBe(
          false
        );
      }
    );
  });
});
