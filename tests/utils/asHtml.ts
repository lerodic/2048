import Tile from "../../src/lib/game/entities/Tile";

export function asHtml(tile: Tile): string {
  const clampedValue = tile.value > 2048 ? 2048 : tile.value;

  const classList = `tile value-${clampedValue}${
    tile.isSpawning ? " spawning" : ""
  }`;

  return `
    <div class="${classList}" data-tile-id="${tile.id}">
      <p class="tile-value">${tile.value}</p>
    </div>
    `;
}
