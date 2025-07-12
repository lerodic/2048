import "reflect-metadata";
import KeyboardInputService from "../src/lib/input/KeyboardInputService";
import { describe, it, vi, expect, beforeEach } from "vitest";
import mitt from "mitt";
import type { AppEvents, EventEmitter } from "../src/types.d";
import {
  provideInvalidInputKeyTestCases,
  provideValidInputKeyTestCases,
} from "./fixtures/KeyboardInputService.fixtures";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("KeyboardInputService", () => {
  let emitter: EventEmitter;
  let keyboardInputService: KeyboardInputService;

  beforeEach(() => {
    emitter = vi.mocked(mitt<AppEvents>());
    keyboardInputService = new KeyboardInputService(emitter);
  });

  describe("handle", () => {
    it.each(provideInvalidInputKeyTestCases())(
      "should not perform an action for invalid input key: $key",
      (event) => {
        keyboardInputService.handle(event as KeyboardEvent);

        expect(emitter.emit).not.toHaveBeenCalled();
      }
    );

    it.each(provideValidInputKeyTestCases())(
      "should emit 'inputRegistered' for key: $keyboardEvent.key",
      ({ keyboardEvent, direction }) => {
        keyboardInputService.handle(keyboardEvent as KeyboardEvent);

        expect(emitter.emit).toHaveBeenCalledWith("inputRegistered", direction);
      }
    );
  });
});
