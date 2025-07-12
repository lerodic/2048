import "reflect-metadata";
import ViewController from "../src/lib/ui/controllers/ViewController";
import { describe, it, vi, expect } from "vitest";
import mitt from "mitt";
import type { AppEvents } from "../src/types.d";
import UIGameService from "../src/lib/ui/services/UIGameService";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

function setup() {
  const emitter = vi.mocked(mitt<AppEvents>());
  const uiGameService = {
    init: vi.fn(),
    spawnTile: vi.fn(),
  } as unknown as UIGameService;
  const viewController = new ViewController(emitter, uiGameService);

  return { emitter, uiGameService, viewController };
}

describe("ViewController", () => {
  describe("init", () => {
    it("should init ViewController", () => {
      const { emitter, uiGameService, viewController } = setup();

      viewController.init();

      expect(uiGameService.init).toHaveBeenCalledOnce();
      expect(emitter.on).toHaveBeenCalledWith(
        "tileSpawned",
        uiGameService.spawnTile
      );
    });
  });
});
