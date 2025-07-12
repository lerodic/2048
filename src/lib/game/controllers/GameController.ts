import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import type { Controller, EventEmitter } from "../../../types";
import TYPES from "../../../config/inversify/inversify.types";
import type GameService from "../services/GameService";

@boundClass
@injectable()
class GameController implements Controller {
  constructor(
    @inject(TYPES.GameService) private gameService: GameService,
    @inject(TYPES.EventEmitter) private emitter: EventEmitter
  ) {}

  init() {
    this.emitter.on("initialAnimationDone", this.startGame);
    this.gameService.init();
  }

  private startGame() {
    this.emitter.emit("gameStarted");
  }
}

export default GameController;
