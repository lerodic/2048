import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import HTMLElementLocator from "./HTMLElementLocator";
import type { UIService } from "../../../types";

@injectable()
@boundClass
class UIBannerService implements UIService {
  constructor(
    @inject(TYPES.HTMLElementLocator) private locator: HTMLElementLocator
  ) {}

  init() {
    // intentionally left blank
  }

  show() {
    const bannerElement = this.locator.getBannerElement();

    bannerElement.classList.remove("hidden");
    this.toggleTranslucent();
    setTimeout(() => {
      bannerElement.classList.remove("hide-banner");
    }, 25);
  }

  hide() {
    const bannerElement = this.locator.getBannerElement();

    bannerElement.classList.add("hide-banner");
    this.toggleTranslucent();

    setTimeout(() => {
      bannerElement.classList.add("hidden");
    }, 500);
  }

  private toggleTranslucent() {
    const gameContainerElement = this.locator.getGameContainerElement();
    const scoreContainerElement = this.locator.getScoreContainerElement();
    const toggleThemeList = this.locator.getToggleThemeListElement();

    [gameContainerElement, scoreContainerElement, toggleThemeList].forEach(
      (el) => el.classList.toggle("translucent")
    );
  }
}

export default UIBannerService;
