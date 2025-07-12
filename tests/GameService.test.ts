import "reflect-metadata";
import GameService from "../src/lib/game/services/GameService";
import { describe, it, vi, expect, afterEach } from "vitest";
import Tile from "../src/lib/game/entities/Tile";
import TileService from "../src/lib/game/services/TileService";
import TileFactory from "../src/lib/game/factories/TileFactory";
import mitt from "mitt";
import type { AppEvents } from "../src/types";
import { provideSpawnTileTestCases } from "./fixtures/GameService.fixtures";

vi.mock("../src/lib/game/services/TileService", () => {
  return {
    default: vi.fn(() => ({
      getUnoccupiedPositions: vi.fn(),
      spawn: vi.fn(),
    })),
  };
});

vi.mock("../src/lib/game/factories/TileFactory", () => {
  return {
    default: vi.fn(() => ({
      create: vi.fn(),
    })),
  };
});

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

function setup(tiles: Tile[] = []) {
  const tileService = vi.mocked(new TileService(tiles));
  const emitter = vi.mocked(mitt<AppEvents>());
  const tileFactory = vi.mocked(new TileFactory());
  const gameService = new GameService(emitter, tileService, tileFactory);

  return { gameService, tileService, emitter, tileFactory };
}

describe("GameService", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("should init GameService", () => {
      const { gameService, emitter } = setup();

      gameService.init();

      expect(emitter.on).toHaveBeenCalledWith(
        "gameStarted",
        (gameService as any).spawnInitialTiles
      );
    });
  });

  describe("spawnTile", () => {
    it.each(provideSpawnTileTestCases())(
      "should spawn tile at position (x: $tile.x, y: $tile.y)",
      ({ availablePositions, tile }) => {
        const { gameService, tileService, emitter, tileFactory } = setup();

        tileService.getUnoccupiedPositions.mockReturnValue(availablePositions);
        tileFactory.create.mockReturnValue(tile);

        gameService.spawnTile();

        expect(tileFactory.create).toHaveBeenCalledWith(availablePositions);
        expect(tileService.spawn).toHaveBeenCalledWith(tile);
        expect(emitter.emit).toHaveBeenCalledWith("tileSpawned", tile);
      }
    );
  });
});
