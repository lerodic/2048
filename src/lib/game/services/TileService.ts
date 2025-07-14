import { boundClass } from "autobind-decorator";
import { injectable } from "inversify";
import type { Direction, Position, ValidCoordinate } from "../../../types";
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

  isAnyActionPossible(): boolean {
    const directions: Direction[] = ["Up", "Down", "Left", "Right"];

    return directions.some((direction) =>
      this.isAnyActionPossibleForDirection(direction)
    );
  }

  isAnyActionPossibleForDirection(direction: Direction): boolean {
    return this.tiles.some((tile) =>
      this.canTileBeMovedOrMerged(tile, direction)
    );
  }

  private canTileBeMovedOrMerged(tile: Tile, direction: Direction): boolean {
    return (
      this.canTileBeMoved(tile, direction) ||
      this.canTileBeMerged(tile, direction)
    );
  }

  canTileBeMoved(tile: Tile, direction: Direction): boolean {
    return (
      !this.isTouchingBoundaries(tile, direction) &&
      !this.hasImmediateNeighbour(tile, direction)
    );
  }

  private isTouchingBoundaries(tile: Tile, direction: Direction): boolean {
    switch (direction) {
      case "Up":
        return tile.position.y === 0;
      case "Down":
        return tile.position.y === 3;
      case "Left":
        return tile.position.x === 0;
      case "Right":
        return tile.position.x === 3;
    }
  }

  private hasImmediateNeighbour(tile: Tile, direction: Direction): boolean {
    return this.getImmediateNeighbour(tile, direction) !== undefined;
  }

  private getImmediateNeighbour(
    tile: Tile,
    direction: Direction
  ): Tile | undefined {
    const x = this.getNeighbourCoordinateX(tile, direction);
    const y = this.getNeighbourCoordinateY(tile, direction);

    return this.tiles.find(
      (tile) => tile.position.x === x && tile.position.y === y
    );
  }

  private getNeighbourCoordinateX(
    tile: Tile,
    direction: Direction
  ): ValidCoordinate {
    if (!["Left", "Right"].includes(direction)) {
      return tile.position.x;
    }

    return direction === "Left"
      ? ((tile.position.x - 1) as ValidCoordinate)
      : ((tile.position.x + 1) as ValidCoordinate);
  }

  private getNeighbourCoordinateY(
    tile: Tile,
    direction: Direction
  ): ValidCoordinate {
    if (!["Up", "Down"].includes(direction)) {
      return tile.position.y;
    }

    return direction === "Up"
      ? ((tile.position.y - 1) as ValidCoordinate)
      : ((tile.position.y + 1) as ValidCoordinate);
  }

  canTileBeMerged(tile: Tile, direction: Direction): boolean {
    return this.getMergePartner(tile, direction) !== undefined;
  }

  private getMergePartner(tile: Tile, direction: Direction): Tile | undefined {
    const neighbour = this.getImmediateNeighbour(tile, direction);

    return neighbour?.value === tile.value && !neighbour?.hasBeenMerged
      ? neighbour
      : undefined;
  }

  getSortedTiles(direction: Direction): Tile[] {
    switch (direction) {
      case "Up":
        return this.sortTilesForDirectionUp();
      case "Down":
        return this.sortTilesForDirectionDown();
      case "Left":
        return this.sortTilesForDirectionLeft();
      case "Right":
        return this.sortTilesForDirectionRight();
    }
  }

  private sortTilesForDirectionUp(): Tile[] {
    return this.tiles.sort((a, b) => a.position.y - b.position.y);
  }

  private sortTilesForDirectionDown(): Tile[] {
    return this.tiles.sort((a, b) => b.position.y - a.position.y);
  }

  private sortTilesForDirectionLeft(): Tile[] {
    return this.tiles.sort((a, b) => a.position.x - b.position.x);
  }

  private sortTilesForDirectionRight(): Tile[] {
    return this.tiles.sort((a, b) => b.position.x - a.position.x);
  }

  merge(tile: Tile, direction: Direction): Tile | undefined {
    const mergePartner = this.getMergePartner(tile, direction);
    if (!mergePartner) return;

    mergePartner.increaseTwofold();
    mergePartner.setMerged();
    this.removeMergedTile(tile);

    return mergePartner;
  }

  private removeMergedTile(tile: Tile) {
    this.tiles = this.tiles.filter((t) => t.id !== tile.id);
  }

  resetMergeStatus() {
    this.tiles.forEach((tile) => tile.resetMerged());
  }
}

export default TileService;
