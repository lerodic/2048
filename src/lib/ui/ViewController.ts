import { boundClass } from "autobind-decorator";
import { injectable } from "inversify";
import type { Controller } from "../../types";

@boundClass
@injectable()
class ViewController implements Controller {
  init() {}
}

export default ViewController;
