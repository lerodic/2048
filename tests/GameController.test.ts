import "reflect-metadata";
import GameController from "../src/lib/game/controllers/GameController";
import GameService from "../src/lib/game/services/GameService";
import mitt from "mitt";
import { describe, it, vi, expect } from "vitest";
import { AppEvents } from "../src/types.d";

vi.mock("../src/lib/game/services/GameService", () => {
  return {
    default: vi.fn(() => ({
      init: vi.fn(),
      spawnTile: vi.fn(),
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

function setup() {
  const gameService = {
    init: vi.fn(),
    spawnTile: vi.fn(),
  } as unknown as GameService;
  const emitter = vi.mocked(mitt<AppEvents>());
  const gameController = new GameController(gameService, emitter);

  return { gameService, emitter, gameController };
}

describe("GameController", () => {
  describe("init", () => {
    it("should init GameController", () => {
      const { emitter, gameService, gameController } = setup();

      gameController.init();

      expect(emitter.on).toHaveBeenCalledWith(
        "initialAnimationDone",
        (gameController as any).startGame
      );
      expect(gameService.init).toHaveBeenCalledOnce();
    });
  });
});
