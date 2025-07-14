import "reflect-metadata";
import ScoreService from "../src/lib/game/services/ScoreService";
import { it, describe, vi, expect, beforeEach } from "vitest";
import mitt from "mitt";
import { AppEvents, EventEmitter } from "../src/types.d";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("ScoreService", () => {
  let scoreService: ScoreService;
  let emitter: EventEmitter;

  beforeEach(() => {
    const localStorage = (() => {
      let store: Record<string, string> = {};

      return {
        getItem: vi.fn((key: string) => store[key] || null),
        setItem: vi.fn((key: string, value: string) => {
          store[key] = value;
        }),
        removeItem: vi.fn((key: string) => {
          delete store[key];
        }),
        clear: vi.fn(() => {
          store = {};
        }),
      };
    })();

    emitter = vi.mocked(mitt<AppEvents>());
    scoreService = new ScoreService(emitter);

    // @ts-ignore
    global.localStorage = localStorage;
  });

  describe("loadSavedHighScore", () => {
    it.each([1, 50, 2000, 50000])(
      "should update high score and set it to: %d",
      (score: number) => {
        const getItem = vi.spyOn(global.localStorage, "getItem");
        getItem.mockReturnValue(score.toString());

        scoreService.loadSavedHighScore();

        expect((scoreService as any).highScore).toStrictEqual(score);
      }
    );

    it("should not perform any action if no saved highscore was found", () => {
      const getItem = vi.spyOn(global.localStorage, "getItem");
      getItem.mockReturnValue(null);

      scoreService.loadSavedHighScore();

      expect((scoreService as any).highScore).toStrictEqual(0);
    });
  });
});
