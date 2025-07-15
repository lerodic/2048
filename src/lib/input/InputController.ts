import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/inversify.types";
import type KeyboardInputService from "./KeyboardInputService";
import type TouchInputService from "./TouchInputService";
import type { Controller, EventEmitter } from "../../types";
import type MouseInputService from "./MouseInputService";

@boundClass
@injectable()
class InputController implements Controller {
  constructor(
    @inject(TYPES.KeyboardInputService) private keyboard: KeyboardInputService,
    @inject(TYPES.TouchInputService) private touch: TouchInputService,
    @inject(TYPES.MouseInputService) private mouse: MouseInputService,
    @inject(TYPES.EventEmitter) private emitter: EventEmitter
  ) {}

  init() {
    this.emitter.on("inputDisabled", this.disableInput);
    this.emitter.on("inputEnabled", this.enableInput);
    window.addEventListener("click", this.mouse.handleClick);

    this.enableInput();
  }

  handleKeyboardInput(event: KeyboardEvent) {
    this.keyboard.handle(event);
  }

  handleTouchStart(event: TouchEvent) {
    this.touch.handleTouchStart(event);
  }

  handleTouchMove(event: TouchEvent) {
    this.touch.handleTouchMove(event);
  }

  handleTouchEnd(_event: TouchEvent) {
    this.touch.handleTouchEnd();
  }

  private enableInput() {
    window.addEventListener("keydown", this.handleKeyboardInput);
    window.addEventListener("touchstart", this.handleTouchStart);
    window.addEventListener("touchmove", this.handleTouchMove);
    window.addEventListener("touchend", this.handleTouchEnd);
  }

  private disableInput() {
    window.removeEventListener("keydown", this.handleKeyboardInput);
    window.removeEventListener("touchstart", this.handleTouchStart);
    window.removeEventListener("touchmove", this.handleTouchMove);
    window.removeEventListener("touchend", this.handleTouchEnd);
  }
}

export default InputController;
