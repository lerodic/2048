import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import type HTMLElementLocator from "./HTMLElementLocator";
import THEMES from "../../../assets/themes/themes.json" assert { type: "json" };
import type { Theme, UIService } from "../../../types";
import CheckmarkIcon from "../../../assets/images/checkmark.webp";

@boundClass
@injectable()
class UIThemeService implements UIService {
  constructor(
    @inject(TYPES.HTMLElementLocator) private locator: HTMLElementLocator
  ) {}

  init() {
    this.populateThemeList();

    setTimeout(() => {
      const toggleThemeList = this.locator.getToggleThemeListElement();
      toggleThemeList.classList.add("show");
    }, 1000);
  }

  private populateThemeList() {
    const themeListElement = this.locator.getThemeListElement();
    const currentTheme = this.loadCurrentTheme() ?? "Classic";

    for (const theme of THEMES) {
      const classList =
        theme.title === currentTheme ? "select-theme active" : "select-theme";

      const themeButton = this.getThemeButtonHtml(classList, theme);

      themeListElement.insertAdjacentHTML("beforeend", themeButton);
    }

    this.selectTheme(currentTheme, true);
  }

  private getThemeButtonHtml(classList: string, theme: Theme): string {
    return `<button class="${classList}" data-theme="${theme.title}">
      <div class="theme-preview" style="background-color: ${theme.values["backgroundColor"]}">
        <img src="${CheckmarkIcon}" alt="A checkmark icon"/>
      </div>
      <p class="theme-title">${theme.title}</p>
      </button>`;
  }

  toggleThemeList() {
    const themeListElement = this.locator.getThemeListElement();

    this.toggleOverlay();
    themeListElement.classList.toggle("show");
  }

  private toggleOverlay() {
    const overlayElement = this.locator.getOverlayElement();

    return this.shouldShowOverlay(overlayElement)
      ? this.hideOverlay(overlayElement)
      : this.showOverlay(overlayElement);
  }

  private shouldShowOverlay(overlayElement: HTMLDivElement): boolean {
    return overlayElement.classList.contains("show");
  }

  private hideOverlay(overlayElement: HTMLDivElement) {
    overlayElement.classList.add("hide");

    setTimeout(() => {
      overlayElement.classList.remove("hide");
      overlayElement.classList.remove("show");
    }, 500);
  }

  private showOverlay(overlayElement: HTMLDivElement) {
    overlayElement.classList.add("show");
  }

  selectTheme(themeName: string, onLoad: boolean = false) {
    const theme = THEMES.find((t) => t.title === themeName);
    if (!theme) return;

    for (const [cssVariable, value] of Object.entries(theme.values)) {
      document.documentElement.style.setProperty(`--${cssVariable}`, value);
    }

    this.highlightCurrentTheme(theme.title);
    this.persistCurrentTheme(theme.title);

    if (!onLoad) {
      this.toggleThemeList();
    }
  }

  private highlightCurrentTheme(theme: string) {
    const themeElement = this.locator.getSelectThemeElement(theme);
    if (!themeElement) return;

    this.resetThemeHighlight();
    themeElement.classList.add("active");
  }

  private resetThemeHighlight() {
    const themeElements = this.locator.getAllThemeElements();

    themeElements.forEach((themeElement) =>
      themeElement.classList.remove("active")
    );
  }

  private persistCurrentTheme(theme: string) {
    localStorage.setItem("theme", theme);
  }

  private loadCurrentTheme() {
    return localStorage.getItem("theme");
  }
}

export default UIThemeService;
