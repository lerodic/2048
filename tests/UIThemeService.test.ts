// @vitest-environment happy-dom
import "reflect-metadata";
import UIThemeService from "../src/lib/ui/services/UIThemeService";
import { describe, it, vi, expect, beforeEach, afterEach } from "vitest";
import HTMLElementLocator from "../src/lib/ui/services/HTMLElementLocator";
import {
  setupDOM,
  setupDOMWithPopulatedThemeList,
  setupDOMWithVisibleThemeList,
} from "./fixtures/ui.fixtures";
import {
  provideSelectThemeNonExistingThemeTestCases,
  provideSelectThemeTestCases,
} from "./fixtures/UIThemeService.fixtures";

vi.mock("../src/assets/themes/themes.json", () => ({
  default: [
    {
      title: "Classic",
      values: {
        "2": "#EEE3D9",
        "4": "#EDE0C8",
        "8": "#F2B179",
        "16": "#F59564",
        "32": "#F67C60",
        "64": "#F65E3A",
        "128": "#EDD072",
        "256": "#EDCC60",
        "512": "#FFB904",
        "1024": "#FF9600",
        "2048": "black",
        altText: "#776E65",
        backgroundColor: "#FAF9EF",
        tileBackground: "#CCC0B4",
        gameBackground: "#BBADA0",
        textColor: "#fff",
        overlayColor: "rgba(255, 255, 255, 0.98)",
      },
    },
    {
      title: "Ayu Light",
      values: {
        "2": "#FAF8F5",
        "4": "#F2F0EC",
        "8": "#FFD580",
        "16": "#FFB454",
        "32": "#F29668",
        "64": "#F07178",
        "128": "#C2D94C",
        "256": "#95E6CB",
        "512": "#53D6F1",
        "1024": "#59C2FF",
        "2048": "#36A3D9",
        altText: "#5C6773",
        backgroundColor: "#FAFAFA",
        tileBackground: "#EDEDED",
        gameBackground: "#D4D4D4",
        textColor: "#121212",
        overlayColor: "rgba(255, 255, 255, 0.98)",
      },
    },
  ],
}));

describe("UIThemeService", () => {
  let uiThemeService: UIThemeService;
  let locator: HTMLElementLocator;

  beforeEach(() => {
    vi.useFakeTimers();

    locator = new HTMLElementLocator();
    uiThemeService = new UIThemeService(locator);
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  describe("init", () => {
    it("should init UIThemeService", () => {
      setupDOM();

      uiThemeService.init();

      vi.advanceTimersByTime(1000);

      const toggleThemeListElement =
        document.querySelector(".toggle-theme-list");

      expect(toggleThemeListElement?.classList.contains("show")).toBe(true);
    });
  });

  describe("toggleThemeList", () => {
    it("should open theme list if it's currently closed", () => {
      setupDOM();

      uiThemeService.toggleThemeList();

      const themeListElement = document.querySelector(".theme-list");
      const overlay = document.querySelector(".overlay");

      expect(themeListElement?.classList.contains("show")).toBe(true);
      expect(overlay?.classList.contains("show")).toBe(true);
    });

    it("should close theme list if it's currently open", () => {
      setupDOMWithVisibleThemeList();

      uiThemeService.toggleThemeList();

      const themeListElement = document.querySelector(".theme-list");
      const overlay = document.querySelector(".overlay");

      expect(overlay?.classList.contains("hide")).toBe(true);

      vi.advanceTimersByTime(500);

      expect(overlay?.classList.contains("hide")).toBe(false);
      expect(overlay?.classList.contains("show")).toBe(false);
      expect(themeListElement?.classList.contains("show")).toBe(false);
    });
  });

  describe("selectTheme", () => {
    it.each(provideSelectThemeNonExistingThemeTestCases())(
      "should not do anything if theme: $theme can't be found",
      ({ theme }) => {
        setupDOMWithPopulatedThemeList();

        uiThemeService.selectTheme(theme);

        const themeListElement = document.querySelector(".theme-list");

        expect(themeListElement?.classList.contains("show")).toBe(false);
      }
    );

    it.each(provideSelectThemeTestCases())(
      "should select theme: $theme and return if is onLoad",
      ({ theme }) => {
        setupDOMWithPopulatedThemeList();

        const themeListVisibleInitial = document
          .querySelector(".theme-list")
          ?.classList.contains("show");

        uiThemeService.selectTheme(theme, true);

        const themeButtonElement = document.querySelector(
          `.select-theme[data-theme="${theme}"]`
        );

        const themeListVisibleFinal = document
          .querySelector(".theme-list")
          ?.classList.contains("show");

        expect(themeButtonElement?.classList.contains("active")).toBe(true);
        expect(themeListVisibleInitial).toBe(false);
        expect(themeListVisibleFinal).toBe(false);
      }
    );

    it.each(provideSelectThemeTestCases())(
      "should select theme: $theme and toggle theme list if is not onLoad",
      ({ theme }) => {
        setupDOMWithPopulatedThemeList();

        const themeListVisibleInitial = document
          .querySelector(".theme-list")
          ?.classList.contains("show");

        uiThemeService.selectTheme(theme);

        const themeButtonElement = document.querySelector(
          `.select-theme[data-theme="${theme}"]`
        );

        const themeListVisibleFinal = document
          .querySelector(".theme-list")
          ?.classList.contains("show");

        expect(themeButtonElement?.classList.contains("active")).toBe(true);
        expect(themeListVisibleInitial).toBe(false);
        expect(themeListVisibleFinal).toBe(true);
      }
    );
  });
});
