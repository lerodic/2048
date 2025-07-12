import { boundClass } from "autobind-decorator";
import { injectable } from "inversify";
import Tile from "../entities/Tile";
import type { Position } from "../../../types";
import { v4 as uuid } from "uuid";

@boundClass
@injectable()
class TileFactory {
  create(positions: Position[]): Tile {
    const position = this.getRandomPosition(positions);
    const value = this.getRandomValue();

    return new Tile(position, value, uuid());
  }

  private getRandomPosition(positions: Position[]): Position {
    const randomIndex = Math.floor(Math.random() * positions.length);

    return positions[randomIndex];
  }

  private getRandomValue(): number {
    return Math.random() > 0.5 ? 4 : 2;
  }
}

export default TileFactory;
