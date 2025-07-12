import "reflect-metadata";
import TouchInputService from "../src/lib/input/TouchInputService";
import { describe, it, beforeEach, vi, expect } from "vitest";
import type { EventEmitter, AppEvents, Config } from "../src/types.d";
import mitt from "mitt";
import {
  provideHandleTouchMoveTestCases,
  provideHandleTouchStartTestCases,
  provideInputBelowThresholdTestCases,
  provideValidTouchInputTestCases,
} from "./fixtures/TouchInputService.fixtures";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("TouchInputService", () => {
  let emitter: EventEmitter;
  let config: Config;
  let touchInputService: TouchInputService;

  beforeEach(() => {
    emitter = vi.mocked(mitt<AppEvents>());
    config = {
      ANIMATION_DURATION: 250,
      MIN_TOUCH_THRESHOLD: 0,
    };
    touchInputService = new TouchInputService(emitter, config);
  });

  describe("handleTouchStart", () => {
    it.each(provideHandleTouchStartTestCases())(
      "should set starting touch position to x: $touches.0.clientX and y: $touches.0.clientY",
      (event) => {
        touchInputService.handleTouchStart(event as unknown as TouchEvent);

        expect(
          (touchInputService as any).startingTouchPosition.x
        ).toStrictEqual(event.touches[0].clientX);
        expect(
          (touchInputService as any).startingTouchPosition.y
        ).toStrictEqual(event.touches[0].clientY);
      }
    );
  });

  describe("handleTouchMove", () => {
    it.each(provideHandleTouchMoveTestCases())(
      "should set current touch position to x: $touches.0.clientX and y: $touches.0.clientY",
      (event) => {
        touchInputService.handleTouchMove(event as unknown as TouchEvent);

        expect((touchInputService as any).currentTouchPosition.x).toStrictEqual(
          event.touches[0].clientX
        );
        expect((touchInputService as any).currentTouchPosition.y).toStrictEqual(
          event.touches[0].clientY
        );
      }
    );
  });

  describe("handleTouchEnd", () => {
    it.each(provideValidTouchInputTestCases())(
      "should emit UserInputRegistered for direction: $direction",
      ({ touchStartEvent, touchEvents, direction }) => {
        touchInputService.handleTouchStart(
          touchStartEvent as unknown as TouchEvent
        );
        touchEvents.forEach((touchEvent) =>
          touchInputService.handleTouchMove(touchEvent as unknown as TouchEvent)
        );

        touchInputService.handleTouchEnd();

        expect(emitter.emit).toHaveBeenCalledWith("inputRegistered", direction);
        expect((touchInputService as any).currentTouchPosition).toStrictEqual({
          x: undefined,
          y: undefined,
        });
        expect((touchInputService as any).startingTouchPosition).toStrictEqual({
          x: undefined,
          y: undefined,
        });
      }
    );

    it.each(provideInputBelowThresholdTestCases())(
      "should not emit UserInputRegistered if touch travel distance is below threshold",
      ({ touchStartEvent, touchEvents, minThreshold }) => {
        emitter = vi.mocked(mitt<AppEvents>());
        config = {
          ANIMATION_DURATION: 250,
          MIN_TOUCH_THRESHOLD: minThreshold,
        };
        touchInputService = new TouchInputService(emitter, config);

        touchInputService.handleTouchStart(
          touchStartEvent as unknown as TouchEvent
        );
        touchEvents.forEach((touchEvent) => {
          touchInputService.handleTouchMove(
            touchEvent as unknown as TouchEvent
          );
        });

        touchInputService.handleTouchEnd();

        expect(emitter.emit).not.toHaveBeenCalled();
        expect((touchInputService as any).startingTouchPosition).toStrictEqual({
          x: undefined,
          y: undefined,
        });
        expect((touchInputService as any).currentTouchPosition).toStrictEqual({
          x: undefined,
          y: undefined,
        });
      }
    );
  });
});
