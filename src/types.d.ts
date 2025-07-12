import type emitter from "./config/events/emitter";

export interface Controller {
  init(): void;
}

export type AppEvents = {};

export type EventEmitter = typeof emitter;
