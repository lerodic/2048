import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import type HTMLElementLocator from "./HTMLElementLocator";
import type { Config } from "../../../types";

@boundClass
@injectable()
class UIScoreService {
  constructor(
    @inject(TYPES.HTMLElementLocator) private locator: HTMLElementLocator,
    @inject(TYPES.Config) private config: Config
  ) {}

  init() {
    const scoreContainer = this.locator.getScoreContainerElement();

    setTimeout(() => {
      scoreContainer.classList.add("show");
    }, this.config.ANIMATION_DURATION);
  }

  updateScore(newScore: number) {
    const scoreElement = this.locator.getScoreElement();

    setTimeout(() => {
      scoreElement.innerText = newScore.toString();
      scoreElement.classList.add("score-updated");
    }, this.config.ANIMATION_DURATION);

    setTimeout(() => {
      scoreElement.classList.remove("score-updated");
    }, 2 * this.config.ANIMATION_DURATION);
  }

  updateHighScore(newHighScore: number) {
    setTimeout(() => {
      const highScoreElement = this.locator.getHighScoreElement();

      highScoreElement.innerText = newHighScore.toString();
    }, this.config.ANIMATION_DURATION);
  }
}

export default UIScoreService;
