import Tile from "../../src/lib/game/entities/Tile";

export function setupDOM() {
  const html = `
  <div id="app">
      <div class="overlay"></div>

      <button class="toggle-theme-list">
        <img src="/src/assets/images/theme.webp" alt="A paintbrush icon" />
      </button>

      <div class="theme-list"></div>

      <div class="game-over-banner hidden hide-banner">
        <p class="game-over-banner__message">Game over!</p>
        <button class="restart-game" aria-label="Restart game button">
          Try again
        </button>
      </div>

      <div id="score-container">
        <div class="score-container__current">
          <p class="title">Score</p>
          <p class="score">0</p>
        </div>
        <div class="score-container__high-score">
          <p class="title">Best</p>
          <p class="score">0</p>
        </div>
      </div>

      <main id="game-container">
        <div class="tile-row">
          <div class="tile-container" data-container-id="0"></div>
          <div class="tile-container" data-container-id="1"></div>
          <div class="tile-container" data-container-id="2"></div>
          <div class="tile-container" data-container-id="3"></div>
        </div>
        <div class="tile-row">
          <div class="tile-container" data-container-id="4"></div>
          <div class="tile-container" data-container-id="5"></div>
          <div class="tile-container" data-container-id="6"></div>
          <div class="tile-container" data-container-id="7"></div>
        </div>
        <div class="tile-row">
          <div class="tile-container" data-container-id="8"></div>
          <div class="tile-container" data-container-id="9"></div>
          <div class="tile-container" data-container-id="10"></div>
          <div class="tile-container" data-container-id="11"></div>
        </div>
        <div class="tile-row">
          <div class="tile-container" data-container-id="12"></div>
          <div class="tile-container" data-container-id="13"></div>
          <div class="tile-container" data-container-id="14"></div>
          <div class="tile-container" data-container-id="15"></div>
        </div>
      </main>
    </div>
  `;

  document.body.innerHTML = html;
}

export function setupDOMWithPreExistingTiles(tiles: Tile[]) {
  setupDOM();

  tiles.forEach((tile) => {
    const tileContainer = document.querySelector(
      `.tile-container[data-container-id="${tile.positionalIndex}"]`
    );

    tileContainer?.insertAdjacentHTML("beforeend", tile.asHtml);
  });
}

export function setupDOMWithVisibleBanner() {
  setupDOM();

  const bannerElement = document.querySelector(".game-over-banner");

  bannerElement?.classList.remove("hidden");
  bannerElement?.classList.remove("hide-banner");

  const gameContainerElement = document.querySelector("#game-container");
  const scoreContainerElement = document.querySelector("#score-container");
  const toggleThemeList = document.querySelector(".toggle-theme-list");

  [gameContainerElement, scoreContainerElement, toggleThemeList].forEach((el) =>
    el?.classList.toggle("translucent")
  );
}

export function setupDOMWithVisibleThemeList() {
  setupDOM();

  const themeListElement = document.querySelector(".theme-list");
  const overlayElement = document.querySelector(".overlay");

  themeListElement?.classList.add("show");
  overlayElement?.classList.add("show");
}

export function setupDOMWithPopulatedThemeList() {
  setupDOM();

  const themeListElement = document.querySelector(".theme-list");
  const themes = `<button class="select-theme" data-theme="Classic">
          <div class="theme-preview" style="background-color: #FAF9EF">
            <img src="/src/assets/images/checkmark.webp" alt="A checkmark icon">
          </div>
          <p class="theme-title">Classic</p>
        </button>
        
        <button class="select-theme" data-theme="Ayu Light">
          <div class="theme-preview" style="background-color: #FAFAFA">
            <img src="/src/assets/images/checkmark.webp" alt="A checkmark icon">
          </div>
          <p class="theme-title">Ayu Light</p>
        </button>`;

  themeListElement?.insertAdjacentHTML("beforeend", themes);
}
