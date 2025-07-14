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
} from "./fixtures/UIGameService.fixtures";
import Tile from "../src/lib/game/entities/Tile";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

function createFakeTileElement() {
  return {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    remove: vi.fn(),
    style: {},
    insertAdjacentHTML: vi.fn(),
    innerHTML: "",
  } as unknown as HTMLDivElement;
}

function createFakeTileValueElement() {
  return {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    remove: vi.fn(),
    style: {},
    insertAdjacentHTML: vi.fn(),
    innerHTML: "",
  } as unknown as HTMLParagraphElement;
}

function createFakeTileContainerElement() {
  return {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    remove: vi.fn(),
    style: {},
    insertAdjacentHTML: vi.fn(),
    innerHTML: "",
  } as unknown as HTMLDivElement;
}

describe("UIGameService", () => {
  let locator: HTMLElementLocator;
  let config: Config;
  let emitter: EventEmitter;
  let uiGame: UIGameService;
  let tileElement: HTMLDivElement;
  let tileValueElement: HTMLParagraphElement;

  beforeEach(() => {
    vi.useFakeTimers();

    tileElement = createFakeTileElement();
    tileValueElement = createFakeTileValueElement();

    locator = {
      getGameContainerElement: vi.fn(() => tileElement),
      getTileElementContainer: vi.fn(() => tileElement),
      getTileElement: vi.fn(() => tileElement),
      getTileValueElement: vi.fn(() => tileValueElement),
      getTileContainerElement: vi.fn(),
    } as unknown as HTMLElementLocator;

    config = {
      ANIMATION_DURATION: 250,
    } as unknown as Config;

    emitter = vi.mocked(mitt<AppEvents>());

    uiGame = new UIGameService(locator, config, emitter);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  describe("init", () => {
    it("should animate game container", () => {
      uiGame.init();

      vi.advanceTimersByTime(2 * config.ANIMATION_DURATION);

      expect(locator.getGameContainerElement).toHaveBeenCalledOnce();
      const gameContainer = locator.getGameContainerElement();
      expect(gameContainer.classList.add).toHaveBeenCalledWith("show");

      vi.advanceTimersByTime(3 * config.ANIMATION_DURATION);
      expect(emitter.emit).toHaveBeenCalledWith("initialAnimationDone");
    });
  });

  describe("spawnTile", () => {
    it.each(provideSpawnTileTestCases())(
      "should spawn tile at position x: $position.x, y: $position.y",
      ({ position, positionalIndex, id }) => {
        const tile = new Tile(position, 2, id);
        const markAsSpawned = vi.spyOn(tile, "markAsSpawned");
        markAsSpawned.mockReturnValue();

        uiGame.spawnTile(tile);

        expect(locator.getTileElementContainer).toHaveBeenCalledWith(
          positionalIndex
        );
        const container = locator.getTileElementContainer(positionalIndex);
        expect(container.insertAdjacentHTML).toHaveBeenCalledWith(
          "beforeend",
          tile.asHtml
        );

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(locator.getTileElement).toHaveBeenCalledWith(id);
        const tileElement = locator.getTileElement(id);
        expect(tileElement.classList.remove).toHaveBeenCalledWith("spawning");
        expect(markAsSpawned).toHaveBeenCalledOnce();
      }
    );
  });

  describe("moveTile", () => {
    it.each(provideMoveTileTestCases())(
      "should move tile { x: $tile.position.x, y: $tile.position.y } $distance step(s) in direction: $direction",
      ({ tile, direction, distance, movementClass }) => {
        const oldTileContainer = createFakeTileContainerElement();
        const newTileContainer = createFakeTileContainerElement();
        (locator.getTileContainerElement as any).mockReturnValueOnce(
          oldTileContainer
        );
        (locator.getTileContainerElement as any).mockReturnValueOnce(
          newTileContainer
        );

        uiGame.moveTile({ tile, direction, distance });

        expect(tileElement.classList.add).toHaveBeenCalledWith(movementClass);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(oldTileContainer.innerHTML).toStrictEqual("");
        expect(newTileContainer.insertAdjacentHTML).toHaveBeenCalledWith(
          "beforeend",
          tile.asHtml
        );
      }
    );
  });

  describe("updateZIndex", () => {
    it("should update 'zIndex' property correctly", () => {
      const zIndex = 2;

      uiGame.updateZIndex({
        tile: new Tile({ x: 0, y: 0 }, 2, "1"),
        zIndex,
      });

      expect(tileElement.style.zIndex).toStrictEqual(`${zIndex}`);
    });
  });

  describe("mergeTiles", () => {
    it.each(provideMergeTilesTestCases())(
      "should move tile { x: $tile.position.x, y: $tile.position.y } $distance step(s) in direction: $direction, then remove it",
      ({ tile, mergedInto, direction, distance, movementClass }) => {
        uiGame.mergeTiles({
          tile,
          mergedInto,
          direction,
          distance,
        });

        expect(tileElement.classList.add).toHaveBeenCalledWith(movementClass);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(tileElement.remove).toHaveBeenCalledOnce();

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(tileValueElement.innerHTML).toStrictEqual(tile.value.toString());
        expect(tileElement.classList.remove).toHaveBeenCalledWith(
          `value-${tile.value / 2}`
        );
        expect(tileElement.classList.add).toHaveBeenCalledWith(
          `value-${tile.value}`
        );
        expect(tileValueElement.classList.add).toHaveBeenCalledWith("merged");

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(tileValueElement.classList.remove).toHaveBeenCalledWith(
          "merged"
        );
      }
    );
  });
});
