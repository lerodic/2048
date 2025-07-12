import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import type HTMLElementLocator from "./HTMLElementLocator";
import type Tile from "../../game/entities/Tile";
import type { Config, EventEmitter } from "../../../types";

@boundClass
@injectable()
class UIGameService {
  constructor(
    @inject(TYPES.HTMLElementLocator) private locator: HTMLElementLocator,
    @inject(TYPES.Config) private config: Config,
    @inject(TYPES.EventEmitter) private emitter: EventEmitter
  ) {}

  init() {
    this.animateGameContainer();
    setTimeout(() => {
      this.animateTileContainers();
    }, 500);
  }

  private animateGameContainer() {
    const gameContainer = this.locator.getGameContainerElement();

    gameContainer.classList.add("show");
  }

  private animateTileContainers() {
    for (let i = 0; i < 16; i++) {
      const container = this.locator.getTileElementContainer(i);

      setTimeout(() => {
        container.classList.add("show");

        if (i !== 15) return;

        setTimeout(() => {
          this.emitter.emit("initialAnimationDone");
        }, this.config.ANIMATION_DURATION);
      }, i * 50);
    }
  }

  spawnTile(tile: Tile) {
    const container = this.locator.getTileElementContainer(
      tile.positionalIndex
    );

    container.insertAdjacentHTML("beforeend", tile.asHtml);

    setTimeout(() => {
      this.cleanUpTileSpawn(tile);
    }, this.config.ANIMATION_DURATION);
  }

  private cleanUpTileSpawn(tile: Tile) {
    const tileElement = this.locator.getTileElement(tile.id);

    tileElement.classList.remove("spawning");
    tile.markAsSpawned();
  }
}

export default UIGameService;
