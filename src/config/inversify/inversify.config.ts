import { Container } from "inversify";
import GameController from "../../lib/game/controllers/GameController";
import TYPES from "./inversify.types";
import ViewController from "../../lib/ui/controllers/ViewController";
import App from "../../lib/App";
import emitter from "../events/emitter";
import type { EventEmitter, Config } from "../../types";
import GameService from "../../lib/game/services/GameService";
import TileService from "../../lib/game/services/TileService";
import TileFactory from "../../lib/game/factories/TileFactory";
import APP_CONFIG from "../app.config";

function setupContainer(): Container {
  const container = new Container();

  container.bind<GameController>(TYPES.GameController).to(GameController);
  container.bind<ViewController>(TYPES.ViewController).to(ViewController);
  container.bind<App>(TYPES.App).to(App);
  container.bind<GameService>(TYPES.GameService).to(GameService);
  container.bind<TileService>(TYPES.TileService).to(TileService);
  container.bind<TileFactory>(TYPES.TileFactory).to(TileFactory);

  container.bind<EventEmitter>(TYPES.EventEmitter).toConstantValue(emitter);
  container.bind<Config>(TYPES.Config).toConstantValue(APP_CONFIG);

  return container;
}

const container = setupContainer();

export default container;
