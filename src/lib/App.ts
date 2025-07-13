import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../config/inversify/inversify.types";
import type { Controller } from "../types";

@boundClass
@injectable()
class App {
  constructor(
    @inject(TYPES.GameController) private gameController: Controller,
    @inject(TYPES.ViewController) private viewController: Controller,
    @inject(TYPES.InputController) private inputController: Controller
  ) {}

  run() {
    [this.gameController, this.viewController, this.inputController].forEach(
      (controller) => {
        controller.init();
      }
    );
  }
}

export default App;
