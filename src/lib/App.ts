import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/inversify.types";
import type GameController from "./game/GameController";
import type ViewController from "./ui/ViewController";

@boundClass
@injectable()
class App {
  constructor(
    @inject(TYPES.GameController) private gameController: GameController,
    @inject(TYPES.ViewController) private viewController: ViewController
  ) {}

  run() {}
}

export default App;
