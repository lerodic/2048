import "reflect-metadata";
import UIGameService from "../src/lib/ui/services/UIGameService";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import mitt from "mitt";
import HTMLElementLocator from "../src/lib/ui/services/HTMLElementLocator";
import { AppEvents, Config, EventEmitter } from "../src/types.d";
import { provideSpawnTileTestCases } from "./fixtures/UIGameService.fixtures";
import Tile from "../src/lib/game/entities/Tile";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

function createFakeElement() {
  return {
    classList: {
      add: vi.fn(),
      remove: vi.fn(),
    },
    insertAdjacentHTML: vi.fn(),
  } as unknown as HTMLDivElement;
}

describe("UIGameService", () => {
  let locator: HTMLElementLocator;
  let config: Config;
  let emitter: EventEmitter;
  let uiGame: UIGameService;

  beforeEach(() => {
    vi.useFakeTimers();

    const element = createFakeElement();

    locator = {
      getGameContainerElement: vi.fn(() => element),
      getTileElementContainer: vi.fn(() => element),
      getTileElement: vi.fn(() => element),
    };

    config = {
      ANIMATION_DURATION: 250,
    };

    emitter = vi.mocked(mitt<AppEvents>());

    uiGame = new UIGameService(locator, config, emitter);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.restoreAllMocks();
  });

  describe("init", () => {
    it("should animate game container and individual tile containers", () => {
      uiGame.init();

      expect(locator.getGameContainerElement).toHaveBeenCalledOnce();
      const gameContainer = locator.getGameContainerElement();
      expect(gameContainer.classList.add).toHaveBeenCalledWith("show");

      vi.advanceTimersByTime(500);

      for (let i = 0; i < 16; i++) {
        vi.advanceTimersByTime(50);
        expect(locator.getTileElementContainer).toHaveBeenCalledWith(i);
        const container = locator.getTileElementContainer(i);
        expect(container.classList.add).toHaveBeenCalledWith("show");
      }

      vi.advanceTimersByTime(config.ANIMATION_DURATION);
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
});
