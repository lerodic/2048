import "reflect-metadata";
import { Controller } from "../src/types.d";
import App from "../src/lib/App";
import { describe, it, vi, expect, beforeEach } from "vitest";

describe("App", () => {
  let app: App;
  let viewController: Controller;
  let gameController: Controller;
  let inputController: Controller;

  beforeEach(() => {
    viewController = { init: () => {} };
    gameController = { init: () => {} };
    inputController = { init: () => {} };
    app = new App(gameController, viewController, inputController);
  });

  it("should init all controllers", () => {
    const initViewController = vi.spyOn(viewController, "init");
    const initGameController = vi.spyOn(gameController, "init");
    const initInputController = vi.spyOn(inputController, "init");

    app.run();

    expect(initViewController).toHaveBeenCalledOnce();
    expect(initGameController).toHaveBeenCalledOnce();
    expect(initInputController).toHaveBeenCalledOnce();
  });
});
