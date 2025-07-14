import type CONFIG from "./config/app.config";
import type emitter from "./config/events/emitter";
import type Tile from "./lib/game/entities/Tile";
import type KeyboardInputService from "./lib/input/KeyboardInputService";

export interface Controller {
  init(): void;
}

export type Direction = "Up" | "Down" | "Left" | "Right";

export interface ZIndexUpdatedEvent {
  tile: Tile;
  zIndex: number;
}

export interface TilesMergedEvent {
  tile: Tile;
  mergedInto: Tile;
  direction: Direction;
  distance: TileTravelDistance;
}

export interface TileMovedEvent {
  tile: Tile;
  direction: Direction;
  distance: TileTravelDistance;
}

export type AppEvents = {
  gameStarted: void;
  tileSpawned: Tile;
  initialAnimationDone: void;
  inputRegistered: Direction;
  inputEnabled: void;
  inputDisabled: void;
  gameOver: void;
  zIndexUpdated: ZIndexUpdatedEvent;
  tilesMerged: TilesMergedEvent;
  tileMoved: TileMovedEvent;
};

export type EventEmitter = typeof emitter;

export type ValidCoordinate = 0 | 1 | 2 | 3;

export interface Position {
  x: ValidCoordinate;
  y: ValidCoordinate;
}

export type Config = typeof CONFIG;

export type ValidInputKey =
  (typeof KeyboardInputService.VALID_INPUT_KEYS)[number];

export interface TouchPosition {
  x: number | undefined;
  y: number | undefined;
}

export type TileTravelDistance = 1 | 2 | 3;
