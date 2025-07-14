import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import type HTMLElementLocator from "./HTMLElementLocator";
import type Tile from "../../game/entities/Tile";
import type {
  Config,
  Direction,
  EventEmitter,
  TileMovedEvent,
  TilesMergedEvent,
  TileTravelDistance,
  ZIndexUpdatedEvent,
} from "../../../types";

@boundClass
@injectable()
class UIGameService {
  constructor(
    @inject(TYPES.HTMLElementLocator) private locator: HTMLElementLocator,
    @inject(TYPES.Config) private config: Config,
    @inject(TYPES.EventEmitter) private emitter: EventEmitter
  ) {}

  init() {
    setTimeout(() => {
      this.animateGameContainer();
    }, 2 * this.config.ANIMATION_DURATION);

    setTimeout(() => {
      this.emitter.emit("initialAnimationDone");
    }, 4 * this.config.ANIMATION_DURATION);
  }

  private animateGameContainer() {
    const gameContainer = this.locator.getGameContainerElement();

    gameContainer.classList.add("show");
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

  moveTile(event: TileMovedEvent) {
    const tileElement = this.locator.getTileElement(event.tile.id);
    const tileClass = this.getMovementClassName(
      event.direction,
      event.distance
    );

    tileElement.classList.add(tileClass);
    setTimeout(() => {
      this.respawnTile(event.tile);
    }, this.config.ANIMATION_DURATION);
  }

  private getMovementClassName(
    direction: Direction,
    distance: TileTravelDistance
  ): string {
    return `move-tile-${direction.toLowerCase()}-${distance}`;
  }

  private respawnTile(tile: Tile) {
    const previousTileContainer = this.locator.getTileContainerElement(
      tile.previousPositionalIndex
    );
    const newTileContainer = this.locator.getTileContainerElement(
      tile.positionalIndex
    );

    previousTileContainer.innerHTML = "";
    newTileContainer.insertAdjacentHTML("beforeend", tile.asHtml);
  }

  updateZIndex(event: ZIndexUpdatedEvent) {
    const tile = this.locator.getTileElement(event.tile.id);

    tile.style.zIndex = event.zIndex.toString();
  }

  mergeTiles(event: TilesMergedEvent) {
    this.moveAndRemove(event.tile, event.direction, event.distance);

    setTimeout(() => {
      this.updateTileAppearance(event.mergedInto);
    }, this.config.ANIMATION_DURATION);
  }

  private moveAndRemove(
    tile: Tile,
    direction: Direction,
    distance: TileTravelDistance
  ) {
    const tileElement = this.locator.getTileElement(tile.id);
    const tileClass = this.getMovementClassName(direction, distance);

    tileElement.classList.add(tileClass);
    setTimeout(() => {
      tileElement.remove();
    }, this.config.ANIMATION_DURATION);
  }

  private updateTileAppearance(tile: Tile) {
    const tileElement = this.locator.getTileElement(tile.id);
    const tileValueElement = this.locator.getTileValueElement(tile.id);
    const oldClass = this.getTileColorClassName(tile.value / 2);
    const newClass = this.getTileColorClassName(tile.value);

    tileValueElement.innerHTML = tile.value.toString();
    tileElement.classList.remove(oldClass);
    tileElement.classList.add(newClass);
    tileValueElement.classList.add("merged");

    setTimeout(() => {
      tileValueElement.classList.remove("merged");
    }, this.config.ANIMATION_DURATION);
  }

  private getTileColorClassName(value: number): string {
    const clamped = value > 2048 ? 2048 : value;

    return `value-${clamped}`;
  }
}

export default UIGameService;
