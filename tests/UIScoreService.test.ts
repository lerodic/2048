// @vitest-environment happy-dom
import "reflect-metadata";
import UIScoreService from "../src/lib/ui/services/UIScoreService";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HTMLElementLocator from "../src/lib/ui/services/HTMLElementLocator";
import type { Config } from "../src/types.d";
import { setupDOM } from "./fixtures/ui.fixtures";

describe("UIScoreService", () => {
  let uiScoreService: UIScoreService;
  let locator: HTMLElementLocator;
  let config: Config;

  beforeEach(() => {
    vi.useFakeTimers();

    locator = new HTMLElementLocator();
    config = {
      ANIMATION_DURATION: 250,
    } as unknown as Config;
    uiScoreService = new UIScoreService(locator, config);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.clearAllMocks();
  });

  describe("init", () => {
    it("should animate score container element", () => {
      setupDOM();

      uiScoreService.init();

      const scoreContainer = document.querySelector("#score-container");

      vi.advanceTimersByTime(config.ANIMATION_DURATION);

      expect(scoreContainer?.classList.contains("show")).toBe(true);
    });
  });

  describe("updateScore", () => {
    it.each([2, 4, 8, 16, 32, 64, 128, 2048])(
      "should set score to %d and animate score display",
      (score: number) => {
        setupDOM();

        uiScoreService.updateScore(score);

        const scoreElement = document.querySelector(
          ".score-container__current .score"
        );

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(scoreElement?.innerHTML).toStrictEqual(score.toString());
        expect(scoreElement?.classList.contains("score-updated")).toBe(true);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(scoreElement?.classList.contains("score-updated")).toBe(false);
      }
    );
  });

  describe("updateHighScore", () => {
    it.each([1200, 4490, 90, 112344])(
      "should set high score to %d",
      (highScore: number) => {
        setupDOM();

        uiScoreService.updateHighScore(highScore);

        const highScoreElement = document.querySelector(
          ".score-container__high-score .score"
        ) as HTMLParagraphElement;

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(highScoreElement?.innerText).toStrictEqual(highScore.toString());
      }
    );
  });
});
