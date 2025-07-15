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
import UIGameService from "../../lib/ui/services/UIGameService";
import HTMLElementLocator from "../../lib/ui/services/HTMLElementLocator";
import InputController from "../../lib/input/InputController";
import KeyboardInputService from "../../lib/input/KeyboardInputService";
import TouchInputService from "../../lib/input/TouchInputService";
import UIScoreService from "../../lib/ui/services/UIScoreService";
import ScoreService from "../../lib/game/services/ScoreService";
import UIThemeService from "../../lib/ui/services/UIThemeService";
import MouseInputService from "../../lib/input/MouseInputService";
import UIBannerService from "../../lib/ui/services/UIBannerService";

function setupContainer(): Container {
  const container = new Container();

  container.bind<GameController>(TYPES.GameController).to(GameController);
  container.bind<ViewController>(TYPES.ViewController).to(ViewController);
  container.bind<App>(TYPES.App).to(App);
  container.bind<GameService>(TYPES.GameService).to(GameService);
  container.bind<TileService>(TYPES.TileService).to(TileService);
  container.bind<TileFactory>(TYPES.TileFactory).to(TileFactory);
  container.bind<UIGameService>(TYPES.UIGameService).to(UIGameService);
  container
    .bind<HTMLElementLocator>(TYPES.HTMLElementLocator)
    .to(HTMLElementLocator);
  container.bind<InputController>(TYPES.InputController).to(InputController);
  container
    .bind<KeyboardInputService>(TYPES.KeyboardInputService)
    .to(KeyboardInputService);
  container
    .bind<TouchInputService>(TYPES.TouchInputService)
    .to(TouchInputService);
  container.bind<UIScoreService>(TYPES.UIScoreService).to(UIScoreService);
  container.bind<ScoreService>(TYPES.ScoreService).to(ScoreService);
  container.bind<UIThemeService>(TYPES.UIThemeService).to(UIThemeService);
  container
    .bind<MouseInputService>(TYPES.MouseInputService)
    .to(MouseInputService);
  container.bind<UIBannerService>(TYPES.UIBannerService).to(UIBannerService);

  container.bind<EventEmitter>(TYPES.EventEmitter).toConstantValue(emitter);
  container.bind<Config>(TYPES.Config).toConstantValue(APP_CONFIG);

  return container;
}

const container = setupContainer();

export default container;
