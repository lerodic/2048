import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../config/inversify/inversify.types";
import type {
  Config,
  Direction,
  EventEmitter,
  TouchPosition,
} from "../../types";

@boundClass
@injectable()
class TouchInputService {
  private startingTouchPosition: TouchPosition = {
    x: undefined,
    y: undefined,
  };

  private currentTouchPosition: TouchPosition = {
    x: undefined,
    y: undefined,
  };

  constructor(
    @inject(TYPES.EventEmitter) private emitter: EventEmitter,
    @inject(TYPES.Config) private config: Config
  ) {}

  handleTouchStart(event: TouchEvent) {
    this.startingTouchPosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  handleTouchMove(event: TouchEvent) {
    this.currentTouchPosition = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  handleTouchEnd() {
    if (this.qualifiesAsTouchInput()) {
      this.emitter.emit("inputRegistered", this.convertToDirection());
    }

    this.resetTouchPosition();
  }

  private qualifiesAsTouchInput(): boolean {
    return (
      this.getVerticalDelta() >= this.config.MIN_TOUCH_THRESHOLD ||
      this.getHorizontalDelta() >= this.config.MIN_TOUCH_THRESHOLD
    );
  }

  private getVerticalDelta(): number {
    return (
      (this.currentTouchPosition.y as number) -
      (this.startingTouchPosition.y as number)
    );
  }

  private getHorizontalDelta(): number {
    return (
      (this.currentTouchPosition.x as number) -
      (this.startingTouchPosition.x as number)
    );
  }

  private convertToDirection(): Direction {
    return this.isHorizontalGesture()
      ? this.getHorizontalDirection()
      : this.getVerticalDirection();
  }

  private isHorizontalGesture(): boolean {
    return (
      Math.abs(this.getHorizontalDelta()) > Math.abs(this.getVerticalDelta())
    );
  }

  private getHorizontalDirection(): Direction {
    return this.getHorizontalDelta() > 0 ? "Right" : "Left";
  }

  private getVerticalDirection(): Direction {
    return this.getVerticalDelta() > 0 ? "Down" : "Up";
  }

  private resetTouchPosition() {
    this.startingTouchPosition = { x: undefined, y: undefined };
    this.currentTouchPosition = { x: undefined, y: undefined };
  }
}

export default TouchInputService;
