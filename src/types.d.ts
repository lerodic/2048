import type CONFIG from "./config/app.config";
import type emitter from "./config/events/emitter";
import type Tile from "./lib/game/entities/Tile";

export interface Controller {
  init(): void;
}

export type AppEvents = {
  gameStarted: void;
  tileSpawned: Tile;
  initialAnimationDone: void;
};

export type EventEmitter = typeof emitter;

export type ValidCoordinate = 0 | 1 | 2 | 3;

export interface Position {
  x: ValidCoordinate;
  y: ValidCoordinate;
}

export type Config = typeof CONFIG;
