import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/inversify.types";
import type { EventEmitter } from "../../types";

@boundClass
@injectable()
class MouseInputService {
  constructor(@inject(TYPES.EventEmitter) private emitter: EventEmitter) {}

  handleClick(event: MouseEvent) {
    if (!event.target) return;

    if (this.isRestartGameButton(event.target)) {
      return this.emitter.emit("gameRestarted");
    }

    if (this.isToggleThemeListButton(event.target)) {
      return this.emitter.emit("themeListToggled");
    }

    if (this.isSelectThemeButton(event.target)) {
      const theme = this.getDataThemeAttribute(event.target);

      this.emitter.emit("themeSelected", theme);
    }
  }

  private isRestartGameButton(
    element: EventTarget | HTMLButtonElement
  ): element is HTMLButtonElement {
    return (element as HTMLButtonElement).classList.contains("restart-game");
  }

  private isToggleThemeListButton(
    element: EventTarget | HTMLButtonElement
  ): element is HTMLButtonElement {
    return (
      (element as HTMLButtonElement).closest(".toggle-theme-list") !== null
    );
  }

  private isSelectThemeButton(
    element: EventTarget | HTMLButtonElement
  ): element is HTMLButtonElement {
    if (!(element instanceof Element)) {
      return false;
    }

    const button = element.closest<HTMLButtonElement>(".select-theme");

    return button !== null && button.getAttribute("data-theme") !== null;
  }

  private getDataThemeAttribute(element: HTMLElement): string {
    return (
      element.getAttribute("data-theme") ??
      (element.closest(".select-theme")?.getAttribute("data-theme") as string)
    );
  }
}

export default MouseInputService;
