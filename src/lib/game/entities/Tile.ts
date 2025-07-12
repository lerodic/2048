import { boundClass } from "autobind-decorator";
import type { Position } from "../../../types";

@boundClass
class Tile {
  private _previousPosition: Position;

  constructor(
    private _position: Position,
    private _value: number,
    private _id: string,
    private _isSpawning: boolean = true
  ) {
    this._previousPosition = { ...this.position };
  }

  get previousPosition(): Position {
    return this._previousPosition;
  }

  get value(): number {
    return this._value;
  }

  get id(): string {
    return this._id;
  }

  get position(): Position {
    return this._position;
  }

  get positionalIndex(): number {
    return this.position.y * 4 + this.position.x;
  }

  get isSpawning(): boolean {
    return this._isSpawning;
  }

  get asHtml(): string {
    const clampedValue = this.value > 2048 ? 2048 : this.value;

    const classList = `tile value-${clampedValue} ${
      this._isSpawning ? "spawning" : ""
    }`;

    return `
    <div class="${classList}" data-tile-id="${this.id}">
      <p class="tile-value">${this.value}</p>
    </div>
    `;
  }

  markAsSpawned() {
    this._isSpawning = false;
  }
}

export default Tile;
