import "reflect-metadata";
import { Controller } from "../src/types.d";
import App from "../src/lib/App";
import { describe, it, vi, expect, beforeEach } from "vitest";

describe("App", () => {
  let app: App;
  let viewController: Controller;
  let gameController: Controller;

  beforeEach(() => {
    viewController = { init: () => {} };
    gameController = { init: () => {} };
    app = new App(gameController, viewController);
  });

  it("should init all controllers", () => {
    const initViewController = vi.spyOn(viewController, "init");
    const initGameController = vi.spyOn(gameController, "init");

    app.run();

    expect(initViewController).toHaveBeenCalledOnce();
    expect(initGameController).toHaveBeenCalledOnce();
  });
});
