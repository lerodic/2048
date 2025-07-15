import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import type { Controller, EventEmitter } from "../../../types";
import TYPES from "../../../config/inversify/inversify.types";
import type UIGameService from "../services/UIGameService";
import type UIScoreService from "../services/UIScoreService";
import type UIThemeService from "../services/UIThemeService";
import type UIBannerService from "../services/UIBannerService";

@boundClass
@injectable()
class ViewController implements Controller {
  constructor(
    @inject(TYPES.EventEmitter) private emitter: EventEmitter,
    @inject(TYPES.UIGameService) private uiGame: UIGameService,
    @inject(TYPES.UIScoreService) private uiScore: UIScoreService,
    @inject(TYPES.UIThemeService) private uiTheme: UIThemeService,
    @inject(TYPES.UIBannerService) private uiBanner: UIBannerService
  ) {}

  init() {
    this.uiGame.init();
    this.uiScore.init();
    this.uiTheme.init();

    this.registerEventListeners();
  }

  private registerEventListeners() {
    this.emitter.on("tileSpawned", this.uiGame.spawnTile);
    this.emitter.on("tileMoved", this.uiGame.moveTile);
    this.emitter.on("zIndexUpdated", this.uiGame.updateZIndex);
    this.emitter.on("tilesMerged", this.uiGame.mergeTiles);
    this.emitter.on("scoreUpdated", this.uiScore.updateScore);
    this.emitter.on("highScoreUpdated", this.uiScore.updateHighScore);
    this.emitter.on("themeListToggled", this.uiTheme.toggleThemeList);
    this.emitter.on("themeSelected", this.uiTheme.selectTheme);
    this.emitter.on("gameOver", this.uiBanner.show);
    this.emitter.on("gameRestarted", this.restartGame);
  }

  private restartGame() {
    this.uiGame.removeAllTiles();
    this.uiBanner.hide();
  }
}

export default ViewController;
