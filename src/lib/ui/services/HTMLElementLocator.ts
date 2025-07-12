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
}

export default HTMLElementLocator;
