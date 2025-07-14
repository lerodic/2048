import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import type {
  Config,
  Controller,
  Direction,
  EventEmitter,
} from "../../../types";
import TYPES from "../../../config/inversify/inversify.types";
import type GameService from "../services/GameService";

@boundClass
@injectable()
class GameController implements Controller {
  constructor(
    @inject(TYPES.GameService) private gameService: GameService,
    @inject(TYPES.EventEmitter) private emitter: EventEmitter,
    @inject(TYPES.Config) private config: Config
  ) {}

  init() {
    this.gameService.init();
    this.emitter.on("inputRegistered", this.moveTiles);
    this.emitter.on("initialAnimationDone", this.startGame);
  }

  private startGame() {
    this.emitter.emit("gameStarted");
  }

  moveTiles(direction: Direction) {
    this.emitter.emit("inputDisabled");
    const tilesMoved = this.gameService.moveTiles(direction);
    if (!tilesMoved) {
      return this.emitter.emit("inputEnabled");
    }

    setTimeout(() => {
      this.endTurn();
    }, this.config.ANIMATION_DURATION);
  }

  private endTurn() {
    this.gameService.spawnTile();
    this.gameService.resetMergeStatus();

    if (this.gameService.isGameOver) {
      return this.endGame();
    }

    this.emitter.emit("inputEnabled");
  }

  private endGame() {
    this.emitter.emit("inputDisabled");
    this.emitter.emit("gameOver");
  }
}

export default GameController;
