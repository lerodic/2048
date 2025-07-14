import "reflect-metadata";
import UIScoreService from "../src/lib/ui/services/UIScoreService";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import HTMLElementLocator from "../src/lib/ui/services/HTMLElementLocator";
import type { Config } from "../src/types.d";

describe("UIScoreService", () => {
  let uiScoreService: UIScoreService;
  let locator: HTMLElementLocator;
  let config: Config;
  let scoreContainerElement: HTMLDivElement;
  let scoreElement: HTMLParagraphElement;

  beforeEach(() => {
    vi.useFakeTimers();

    scoreContainerElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
    } as unknown as HTMLDivElement;

    scoreElement = {
      classList: {
        add: vi.fn(),
        remove: vi.fn(),
      },
      innerText: "",
    } as unknown as HTMLParagraphElement;

    locator = {
      getScoreContainerElement: vi.fn(() => scoreContainerElement),
      getScoreElement: vi.fn(() => scoreElement),
      getHighScoreElement: vi.fn(() => scoreElement),
    } as unknown as HTMLElementLocator;
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
    it("should animate score container", () => {
      uiScoreService.init();

      vi.advanceTimersByTime(250);

      expect(scoreContainerElement.classList.add).toHaveBeenCalledWith("show");
    });
  });

  describe("updateScore", () => {
    it.each([2, 4, 16, 32, 128, 2048])(
      "should set current score to: %d",
      (score: number) => {
        uiScoreService.updateScore(score);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(scoreElement.innerText).toStrictEqual(score.toString());
        expect(scoreElement.classList.add).toHaveBeenCalledWith(
          "score-updated"
        );

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(scoreElement.classList.remove).toHaveBeenCalledWith(
          "score-updated"
        );
      }
    );
  });

  describe("updateHighScore", () => {
    it.each([2, 4, 16, 128, 2048, 4096])(
      "should set high score to: %d",
      (highScore: number) => {
        uiScoreService.updateHighScore(highScore);

        vi.advanceTimersByTime(config.ANIMATION_DURATION);

        expect(scoreElement.innerText).toStrictEqual(highScore.toString());
      }
    );
  });
});
