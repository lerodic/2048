import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import type {
  Direction,
  EventEmitter,
  TileTravelDistance,
} from "../../../types";
import type TileService from "./TileService";
import type TileFactory from "../factories/TileFactory";
import type Tile from "../entities/Tile";

@boundClass
@injectable()
class GameService {
  private _isGameOver: boolean = false;

  constructor(
    @inject(TYPES.EventEmitter) private emitter: EventEmitter,
    @inject(TYPES.TileService) private tileService: TileService,
    @inject(TYPES.TileFactory) private tileFactory: TileFactory
  ) {}

  get isGameOver(): boolean {
    return this._isGameOver;
  }

  init() {
    this.emitter.on("gameStarted", this.spawnInitialTiles);
  }

  private spawnInitialTiles() {
    for (let i = 0; i < 2; i++) {
      this.spawnTile();
    }
  }

  spawnTile() {
    const availablePositions = this.tileService.getUnoccupiedPositions();
    const tile = this.tileFactory.create(availablePositions);

    this.tileService.spawn(tile);

    this.emitter.emit("tileSpawned", tile);
  }

  moveTiles(direction: Direction): boolean {
    if (!this.isViableAction(direction)) {
      return false;
    }

    const sortedTiles = this.tileService.getSortedTiles(direction);

    sortedTiles.forEach((tile, index) => {
      this.emitter.emit("zIndexUpdated", { tile, zIndex: index + 1 });
      tile.persistPreviousPosition();
      this.moveTile(tile, direction);
    });

    return true;
  }

  private isViableAction(direction: Direction): boolean {
    return this.tileService.isAnyActionPossibleForDirection(direction);
  }

  private moveTile(tile: Tile, direction: Direction) {
    let distance = 0;

    while (this.tileService.canTileBeMoved(tile, direction)) {
      distance++;
      this.moveTileInDirection(tile, direction);
    }

    if (this.tileService.canTileBeMerged(tile, direction)) {
      return this.performTileMerge(tile, direction, distance + 1);
    }

    if (distance !== 0) {
      this.performTileMove(tile, direction, distance);
    }
  }

  private moveTileInDirection(tile: Tile, direction: Direction) {
    switch (direction) {
      case "Up":
        return this.moveTileUp(tile);
      case "Down":
        return this.moveTileDown(tile);
      case "Left":
        return this.moveTileLeft(tile);
      case "Right":
        return this.moveTileRight(tile);
    }
  }

  private moveTileUp(tile: Tile) {
    tile.moveUp();
  }

  private moveTileDown(tile: Tile) {
    tile.moveDown();
  }

  private moveTileLeft(tile: Tile) {
    tile.moveLeft();
  }

  private moveTileRight(tile: Tile) {
    tile.moveRight();
  }

  private performTileMerge(tile: Tile, direction: Direction, distance: number) {
    const mergedInto = this.tileService.merge(tile, direction) as Tile;

    this.emitter.emit("tilesMerged", {
      tile,
      mergedInto,
      direction,
      distance: distance as TileTravelDistance,
    });
  }

  private performTileMove(tile: Tile, direction: Direction, distance: number) {
    this.emitter.emit("tileMoved", {
      tile,
      direction,
      distance: distance as TileTravelDistance,
    });
  }

  resetMergeStatus() {
    this.tileService.resetMergeStatus();
  }

  evaluateGameState() {
    this._isGameOver = !this.tileService.isAnyActionPossible();
  }
}

export default GameService;
