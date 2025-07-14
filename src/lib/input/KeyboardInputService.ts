import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/inversify.types";
import type { Direction, EventEmitter, ValidInputKey } from "../../types";

@boundClass
@injectable()
class KeyboardInputService {
  public static readonly VALID_INPUT_KEYS = [
    "ArrowUp",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
  ] as const;

  constructor(@inject(TYPES.EventEmitter) private emitter: EventEmitter) {}

  handle(event: KeyboardEvent) {
    if (!this.isValidInputKey(event.key)) return;

    this.emitter.emit("inputRegistered", this.convertToDirection(event.key));
  }

  private isValidInputKey(key: string | ValidInputKey): key is ValidInputKey {
    return KeyboardInputService.VALID_INPUT_KEYS.includes(key as ValidInputKey);
  }

  private convertToDirection(key: ValidInputKey): Direction {
    return key.replace("Arrow", "") as Direction;
  }
}

export default KeyboardInputService;
