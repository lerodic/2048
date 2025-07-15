// @vitest-environment happy-dom
import "reflect-metadata";
import { describe, it, expect, vi, beforeEach } from "vitest";
import MouseInputService from "../src/lib/input/MouseInputService";
import type { AppEvents, EventEmitter } from "../src/types.d";
import mitt from "mitt";

vi.mock("mitt", () => {
  return {
    default: vi.fn(() => ({
      on: vi.fn(),
      emit: vi.fn(),
    })),
  };
});

describe("MouseInputService", () => {
  let emitter: EventEmitter;
  let service: MouseInputService;

  beforeEach(() => {
    emitter = vi.mocked(mitt<AppEvents>());
    service = new MouseInputService(emitter);
  });

  it("should emit 'gameRestarted' when clicking restart game button", () => {
    const button = document.createElement("button");
    button.classList.add("restart-game");

    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "target", { value: button });

    service.handleClick(event);

    expect(emitter.emit).toHaveBeenCalledWith("gameRestarted");
  });

  it("should emit 'themeListToggled' when clicking toggle theme list button", () => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("toggle-theme-list");

    const button = document.createElement("button");
    wrapper.appendChild(button);

    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "target", { value: button });

    document.body.appendChild(wrapper);
    service.handleClick(event);

    expect(emitter.emit).toHaveBeenCalledWith("themeListToggled");
    wrapper.remove();
  });

  it("should emit 'themeSelected' with correct theme when clicking a select theme button", () => {
    const button = document.createElement("button");
    button.classList.add("select-theme");
    button.setAttribute("data-theme", "dark");

    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "target", { value: button });

    document.body.appendChild(button);
    service.handleClick(event);

    expect(emitter.emit).toHaveBeenCalledWith("themeSelected", "dark");
    button.remove();
  });

  it("should not emit anything if the click is on an unrelated element", () => {
    const div = document.createElement("div");

    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "target", { value: div });

    document.body.appendChild(div);
    service.handleClick(event);

    expect(emitter.emit).not.toHaveBeenCalled();
    div.remove();
  });

  it("should gracefully handle an event with a null target", () => {
    const event = new MouseEvent("click", { bubbles: true });
    Object.defineProperty(event, "target", { value: null });

    service.handleClick(event);

    expect(emitter.emit).not.toHaveBeenCalled();
  });
});
