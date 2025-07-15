// @vitest-environment happy-dom
import "reflect-metadata";
import UIBannerService from "../src/lib/ui/services/UIBannerService";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import HTMLElementLocator from "../src/lib/ui/services/HTMLElementLocator";
import { setupDOM, setupDOMWithVisibleBanner } from "./fixtures/ui.fixtures";

describe("UIBannerService", () => {
  let uiBannerService: UIBannerService;
  let locator: HTMLElementLocator;

  beforeEach(() => {
    vi.useFakeTimers();

    locator = new HTMLElementLocator();
    uiBannerService = new UIBannerService(locator);
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.resetAllMocks();
  });

  describe("show", () => {
    it("should show the game over banner", () => {
      setupDOM();

      uiBannerService.show();

      const bannerElement = document.querySelector(
        ".game-over-banner"
      ) as HTMLDivElement;
      const otherElements = [
        document.querySelector("#game-container") as HTMLDivElement,
        document.querySelector("#score-container") as HTMLDivElement,
        document.querySelector(".toggle-theme-list") as HTMLButtonElement,
      ];

      expect(bannerElement.classList.contains("hidden")).toBe(false);
      otherElements.forEach((element) => {
        expect(element.classList.contains("translucent")).toBe(true);
      });

      vi.advanceTimersByTime(25);

      expect(bannerElement.classList.contains("hide-banner")).toBe(false);
    });
  });

  describe("hide", () => {
    it("should hide the game over banner", () => {
      setupDOMWithVisibleBanner();

      uiBannerService.hide();

      const bannerElement = document.querySelector(
        ".game-over-banner"
      ) as HTMLDivElement;
      const otherElements = [
        document.querySelector("#game-container") as HTMLDivElement,
        document.querySelector("#score-container") as HTMLDivElement,
        document.querySelector(".toggle-theme-list") as HTMLButtonElement,
      ];

      expect(bannerElement.classList.contains("hide-banner")).toBe(true);
      otherElements.forEach((element) => {
        expect(element.classList.contains("translucent")).toBe(false);
      });

      vi.advanceTimersByTime(500);

      expect(bannerElement.classList.contains("hidden")).toBe(true);
    });
  });
});
