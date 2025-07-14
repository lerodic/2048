import "reflect-metadata";
import ViewController from "../src/lib/ui/controllers/ViewController";
import { describe, it, vi, expect, beforeEach } from "vitest";
import mitt from "mitt";
import type { AppEvents, EventEmitter } from "../src/types.d";
import UIGameService from "../src/lib/ui/services/UIGameService";

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
  let viewController: ViewController;

  beforeEach(() => {
    emitter = vi.mocked(mitt<AppEvents>());
    uiGameService = {
      init: vi.fn(),
      spawnTile: vi.fn(),
    } as unknown as UIGameService;
    viewController = new ViewController(emitter, uiGameService);
  });

  describe("init", () => {
    it("should init ViewController", () => {
      viewController.init();

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
    });
  });
});
