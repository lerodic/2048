import { boundClass } from "autobind-decorator";
import { injectable } from "inversify";
import type { Controller } from "../../types";

@boundClass
@injectable()
class GameController implements Controller {
  init() {}
}

export default GameController;
