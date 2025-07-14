import { boundClass } from "autobind-decorator";
import { injectable } from "inversify";

@boundClass
@injectable()
class HTMLElementLocator {
  getTileElementContainer(positionalIndex: number): HTMLDivElement {
    return document.querySelector(
      `.tile-container[data-container-id="${positionalIndex}"]`
    ) as HTMLDivElement;
  }

  getTileElement(id: string): HTMLDivElement {
    return document.querySelector(
      `.tile[data-tile-id="${id}"]`
    ) as HTMLDivElement;
  }

  getGameContainerElement(): HTMLDivElement {
    return document.querySelector("#game-container") as HTMLDivElement;
  }

  getTileContainerElement(positionalIndex: number): HTMLDivElement {
    return document.querySelector(
      `.tile-container[data-container-id="${positionalIndex}"]`
    ) as HTMLDivElement;
  }

  getTileValueElement(id: string): HTMLParagraphElement {
    return this.getTileElement(id).querySelector(
      ".tile-value"
    ) as HTMLParagraphElement;
  }
}

export default HTMLElementLocator;
