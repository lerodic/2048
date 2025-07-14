import "reflect-metadata";
import GameController from "../src/lib/game/controllers/GameController";
import GameService from "../src/lib/game/services/GameService";
import mitt from "mitt";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import { AppEvents, Config, Direction, EventEmitter } from "../src/types.d";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("GameController", () => {
  let gameController: GameController;
  let gameService: GameService;
  let emitter: EventEmitter;
  let config: Config;

  beforeEach(() => {
    vi.useFakeTimers();

    gameService = {
      init: vi.fn(),
      spawnTile: vi.fn(),
      moveTiles: vi.fn(),
      resetMergeStatus: vi.fn(),
    } as unknown as GameService;
    emitter = vi.mocked(mitt<AppEvents>());
    config = {
      ANIMATION_DURATION: 250,
    } as unknown as Config;

    gameController = new GameController(gameService, emitter, config);
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.clearAllTimers();
  });

  describe("init", () => {
    it("should init GameController", () => {
      gameController.init();

      expect(emitter.on).toHaveBeenCalledWith(
        "initialAnimationDone",
        (gameController as any).startGame
      );
      expect(gameService.init).toHaveBeenCalledOnce();
    });
  });

  describe("moveTiles", () => {
    it.each(["Up", "Down", "Left", "Right"])(
      "should move tiles in direction: %s",
      (direction) => {
        (gameService.moveTiles as unknown as any).mockReturnValue(true);

        gameController.moveTiles(direction as Direction);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(emitter.emit).toHaveBeenNthCalledWith(1, "inputDisabled");
        expect(gameService.spawnTile).toHaveBeenCalledOnce();
        expect(gameService.resetMergeStatus).toHaveBeenCalledOnce();
        expect(emitter.emit).toHaveBeenNthCalledWith(2, "inputEnabled");
      }
    );

    it.each(["Up", "Down", "Left", "Right"])(
      "should not perform any action if tiles have not been moved",
      (direction) => {
        gameController.moveTiles(direction as Direction);
        const setTimeout = vi.spyOn(globalThis, "setTimeout");

        expect(emitter.emit).toHaveBeenNthCalledWith(1, "inputDisabled");
        expect(emitter.emit).toHaveBeenNthCalledWith(2, "inputEnabled");
        expect(setTimeout).not.toHaveBeenCalled();
      }
    );

    it.each(["Up", "Down", "Left", "Right"])(
      "should move tiles and end game",
      (direction) => {
        (gameService.moveTiles as unknown as any).mockReturnValue(true);
        (gameService as any).isGameOver = true;

        gameController.moveTiles(direction as Direction);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(emitter.emit).toHaveBeenNthCalledWith(1, "inputDisabled");
        expect(gameService.spawnTile).toHaveBeenCalledOnce();
        expect(gameService.resetMergeStatus).toHaveBeenCalledOnce();
        expect(emitter.emit).toHaveBeenNthCalledWith(2, "inputDisabled");
        expect(emitter.emit).toHaveBeenNthCalledWith(3, "gameOver");
      }
    );
  });
});
