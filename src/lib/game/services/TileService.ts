import { boundClass } from "autobind-decorator";
import { injectable } from "inversify";
import type { Position, ValidCoordinate } from "../../../types";
import type Tile from "../entities/Tile";

@boundClass
@injectable()
class TileService {
  constructor(private tiles: Tile[] = []) {}

  getUnoccupiedPositions(): Position[] {
    const positions: Position[] = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const x = i as ValidCoordinate;
        const y = j as ValidCoordinate;

        if (this.isPositionOccupied({ x, y })) continue;

        positions.push({ x, y });
      }
    }

    return positions;
  }

  private isPositionOccupied(position: Position): boolean {
    return (
      this.tiles.find(
        (tile) =>
          tile.position.x === position.x && tile.position.y === position.y
      ) !== undefined
    );
  }

  spawn(tile: Tile) {
    this.tiles.push(tile);
  }
}

export default TileService;
