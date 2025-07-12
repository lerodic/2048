import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import type { Controller, EventEmitter } from "../../../types";
import TYPES from "../../../config/inversify/inversify.types";
import type UIGameService from "../services/UIGameService";

@boundClass
@injectable()
class ViewController implements Controller {
  constructor(
    @inject(TYPES.EventEmitter) private emitter: EventEmitter,
    @inject(TYPES.UIGameService) private uiGame: UIGameService
  ) {}

  init() {
    this.uiGame.init();

    this.registerEventListeners();
  }

  private registerEventListeners() {
    this.emitter.on("tileSpawned", this.uiGame.spawnTile);
  }
}

export default ViewController;
