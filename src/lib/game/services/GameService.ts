import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import type { EventEmitter } from "../../../types";
import type TileService from "./TileService";
import type TileFactory from "../factories/TileFactory";

@boundClass
@injectable()
class GameService {
  constructor(
    @inject(TYPES.EventEmitter) private emitter: EventEmitter,
    @inject(TYPES.TileService) private tileService: TileService,
    @inject(TYPES.TileFactory) private tileFactory: TileFactory
  ) {}

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
}

export default GameService;
