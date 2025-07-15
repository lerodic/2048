import "reflect-metadata";
import ViewController from "../src/lib/ui/controllers/ViewController";
import { describe, it, vi, expect, beforeEach } from "vitest";
import mitt from "mitt";
import type { AppEvents, EventEmitter } from "../src/types.d";
import UIGameService from "../src/lib/ui/services/UIGameService";
import UIScoreService from "../src/lib/ui/services/UIScoreService";
import UIThemeService from "../src/lib/ui/services/UIThemeService";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("ViewController", () => {
  let emitter: EventEmitter;
  let uiGameService: UIGameService;
  let uiScoreService: UIScoreService;
  let uiThemeService: UIThemeService;
  let viewController: ViewController;

  beforeEach(() => {
    emitter = vi.mocked(mitt<AppEvents>());
    uiGameService = {
      init: vi.fn(),
      spawnTile: vi.fn(),
    } as unknown as UIGameService;
    uiScoreService = {
      init: vi.fn(),
      updateScore: vi.fn(),
      updateHighScore: vi.fn(),
    } as unknown as UIScoreService;
    uiThemeService = {
      init: vi.fn(),
    } as unknown as UIThemeService;
    viewController = new ViewController(
      emitter,
      uiGameService,
      uiScoreService,
      uiThemeService
    );
  });

  describe("init", () => {
    it("should init ViewController", () => {
      viewController.init();

      expect(uiGameService.init).toHaveBeenCalledOnce();
      expect(uiScoreService.init).toHaveBeenCalledOnce();
      expect(uiThemeService.init).toHaveBeenCalledOnce();
      expect(uiGameService.init).toHaveBeenCalledOnce();
      expect(emitter.on).toHaveBeenCalledWith(
        "tileSpawned",
        uiGameService.spawnTile
      );
      expect(emitter.on).toHaveBeenCalledWith(
        "tileMoved",
        uiGameService.moveTile
      );
      expect(emitter.on).toHaveBeenCalledWith(
        "zIndexUpdated",
        uiGameService.updateZIndex
      );
      expect(emitter.on).toHaveBeenCalledWith(
        "tilesMerged",
        uiGameService.mergeTiles
      );
      expect(emitter.on).toHaveBeenCalledWith(
        "scoreUpdated",
        uiScoreService.updateScore
      );
      expect(emitter.on).toHaveBeenCalledWith(
        "highScoreUpdated",
        uiScoreService.updateHighScore
      );
    });
  });
});
