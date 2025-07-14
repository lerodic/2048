import "reflect-metadata";
import GameService from "../src/lib/game/services/GameService";
import { describe, it, vi, expect, afterEach } from "vitest";
import Tile from "../src/lib/game/entities/Tile";
import TileService from "../src/lib/game/services/TileService";
import TileFactory from "../src/lib/game/factories/TileFactory";
import mitt from "mitt";
import type { AppEvents, Direction, EventEmitter } from "../src/types.d";
import {
  provideEvaluateGameStateFalseTestCases,
  provideMoveTilesFailureTestCases,
  provideSpawnTileTestCases,
} from "./fixtures/GameService.fixtures";
import ScoreService from "../src/lib/game/services/ScoreService";

vi.mock("../src/lib/game/services/TileService", () => {
  return {
    default: vi.fn(() => ({
      isAnyActionPossible: vi.fn(),
      isAnyActionPossibleForDirection: vi.fn(),
      getUnoccupiedPositions: vi.fn(),
      getSortedTiles: vi.fn(),
      canTileBeMoved: vi.fn(),
      canTileBeMerged: vi.fn(),
      merge: vi.fn(),
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

vi.mock("../src/lib/game/services/ScoreService", () => {
  return {
    default: vi.fn(() => ({
      loadSavedHighScore: vi.fn(),
      updateScore: vi.fn(),
      updateHighScore: vi.fn(),
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

describe("GameService", () => {
  let tileService: TileService;
  let emitter: EventEmitter;
  let tileFactory: TileFactory;
  let gameService: GameService;
  let scoreService: ScoreService;

  function setup(tiles: Tile[] = []) {
    tileService = vi.mocked(new TileService(tiles));
    emitter = vi.mocked(mitt<AppEvents>());
    tileFactory = vi.mocked(new TileFactory());
    scoreService = vi.mocked(new ScoreService(emitter));
    gameService = new GameService(
      emitter,
      tileService,
      tileFactory,
      scoreService
    );
  }

  function createMockTile() {
    return {
      moveUp: vi.fn(),
      moveDown: vi.fn(),
      moveLeft: vi.fn(),
      moveRight: vi.fn(),
      persistPreviousPosition: vi.fn(),
    } as unknown as Tile;
  }

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("init", () => {
    it("should init GameService", () => {
      setup();

      gameService.init();

      expect(scoreService.loadSavedHighScore).toHaveBeenCalledOnce();
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
        setup();

        (tileService.getUnoccupiedPositions as any).mockReturnValue(
          availablePositions
        );
        (tileFactory.create as any).mockReturnValue(tile);

        gameService.spawnTile();

        expect(tileFactory.create).toHaveBeenCalledWith(availablePositions);
        expect(tileService.spawn).toHaveBeenCalledWith(tile);
        expect(emitter.emit).toHaveBeenCalledWith("tileSpawned", tile);
      }
    );
  });

  describe("moveTiles", () => {
    describe("successful move", () => {
      it("should move tiles and emit tileMoved event", () => {
        const tile = createMockTile();

        (tileService.isAnyActionPossibleForDirection as any).mockReturnValue(
          true
        );
        (tileService.getSortedTiles as any).mockReturnValue([tile]);
        (tileService.canTileBeMoved as any)
          .mockReturnValueOnce(true)
          .mockReturnValueOnce(false);
        (tileService.canTileBeMerged as any).mockReturnValue(false);

        const result = gameService.moveTiles("Right");

        expect(result).toBe(true);
        expect(tile.persistPreviousPosition).toHaveBeenCalledOnce();
        expect(tile.moveRight).toHaveBeenCalledTimes(1);
        expect(emitter.emit).toHaveBeenCalledWith("tileMoved", {
          tile,
          direction: "Right",
          distance: 1,
        });
      });

      it("should merge tile if possible and emit tilesMerged", () => {
        const tile = createMockTile();
        const mergedInto = createMockTile();

        (tileService.isAnyActionPossibleForDirection as any).mockReturnValue(
          true
        );
        (tileService.getSortedTiles as any).mockReturnValue([tile]);
        (tileService.canTileBeMoved as any).mockReturnValue(false);
        (tileService.canTileBeMerged as any).mockReturnValue(true);
        (tileService.merge as any).mockReturnValue(mergedInto);

        const result = gameService.moveTiles("Up");

        expect(result).toBe(true);
        expect(tileService.merge).toHaveBeenCalledWith(tile, "Up");
        expect(scoreService.updateScore).toHaveBeenCalledWith(tile.value * 2);
        expect(emitter.emit).toHaveBeenCalledWith("tilesMerged", {
          tile,
          mergedInto,
          direction: "Up",
          distance: 1,
        });
      });

      it("should emit zIndexUpdated for each tile", () => {
        const tile1 = createMockTile();
        const tile2 = createMockTile();

        (tileService.isAnyActionPossibleForDirection as any).mockReturnValue(
          true
        );
        (tileService.getSortedTiles as any).mockReturnValue([tile1, tile2]);
        (tileService.canTileBeMoved as any).mockReturnValue(false);
        (tileService.canTileBeMerged as any).mockReturnValue(false);

        gameService.moveTiles("Down");

        expect(emitter.emit).toHaveBeenCalledWith("zIndexUpdated", {
          tile: tile1,
          zIndex: 1,
        });
        expect(emitter.emit).toHaveBeenCalledWith("zIndexUpdated", {
          tile: tile2,
          zIndex: 2,
        });
      });
    });

    describe("failed move", () => {
      it.each(provideMoveTilesFailureTestCases())(
        "should return false if no tile can be moved/merged in direction: $direction",
        ({ tiles, direction }) => {
          setup(tiles);
          (tileService.isAnyActionPossibleForDirection as any).mockReturnValue(
            false
          );

          const result = gameService.moveTiles(direction as Direction);

          expect(result).toBe(false);
        }
      );
    });
  });

  describe("evaluateGameState", () => {
    it("should set isGameOver to false if game is not over yet", () => {
      setup();
      (tileService.isAnyActionPossible as any).mockReturnValue(true);

      gameService.evaluateGameState();

      expect(gameService.isGameOver).toBe(false);
    });

    it.each(provideEvaluateGameStateFalseTestCases())(
      "should set isGameOver to true if game is over",
      ({ tiles }) => {
        setup(tiles);
        (tileService.isAnyActionPossible as any).mockReturnValue(false);

        gameService.evaluateGameState();

        expect(gameService.isGameOver).toBe(true);
      }
    );
  });
});
