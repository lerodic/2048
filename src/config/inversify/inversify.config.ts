import { Container } from "inversify";
import GameController from "../../lib/game/GameController";
import TYPES from "./inversify.types";
import ViewController from "../../lib/ui/ViewController";
import App from "../../lib/App";
import emitter from "../events/emitter";
import type { EventEmitter } from "../../types";

function setupContainer(): Container {
  const container = new Container();

  container.bind<GameController>(TYPES.GameController).to(GameController);
  container.bind<ViewController>(TYPES.ViewController).to(ViewController);
  container.bind<App>(TYPES.App).to(App);

  container.bind<EventEmitter>(TYPES.EventEmitter).toConstantValue(emitter);

  return container;
}

const container = setupContainer();

export default container;
