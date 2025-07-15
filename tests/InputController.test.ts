import "reflect-metadata";
import InputController from "../src/lib/input/InputController";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import mitt from "mitt";
import KeyboardInputService from "../src/lib/input/KeyboardInputService";
import TouchInputService from "../src/lib/input/TouchInputService";
import { AppEvents, EventEmitter } from "../src/types.d";
import MouseInputService from "../src/lib/input/MouseInputService";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("InputController", () => {
  let inputController: InputController;
  let keyboard: KeyboardInputService;
  let touch: TouchInputService;
  let mouse: MouseInputService;
  let emitter: EventEmitter;

  beforeEach(() => {
    keyboard = {
      handle: vi.fn(),
    } as unknown as KeyboardInputService;

    touch = {
      handleTouchStart: vi.fn(),
      handleTouchMove: vi.fn(),
      handleTouchEnd: vi.fn(),
    } as unknown as TouchInputService;

    mouse = {
      handleClick: vi.fn(),
    } as unknown as MouseInputService;

    emitter = vi.mocked(mitt<AppEvents>());

    // @ts-ignore
    global.window = {
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    };

    inputController = new InputController(keyboard, touch, mouse, emitter);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("init", () => {
    it("should init InputController", () => {
      const listeners = [
        {
          event: "keydown",
          callback: inputController.handleKeyboardInput,
        },
        {
          event: "touchstart",
          callback: inputController.handleTouchStart,
        },
        {
          event: "touchmove",
          callback: inputController.handleTouchMove,
        },
        {
          event: "touchend",
          callback: inputController.handleTouchEnd,
        },
      ];

      inputController.init();

      expect(emitter.on).toHaveBeenNthCalledWith(
        1,
        "inputDisabled",
        (inputController as any).disableInput
      );
      expect(emitter.on).toHaveBeenNthCalledWith(
        2,
        "inputEnabled",
        (inputController as any).enableInput
      );

      expect(window.addEventListener).toHaveBeenNthCalledWith(
        1,
        "click",
        mouse.handleClick
      );

      for (let i = 0; i < 4; i++) {
        expect(window.addEventListener).toHaveBeenNthCalledWith(
          i + 2,
          listeners[i].event,
          listeners[i].callback
        );
      }
    });
  });
});
