import container from "../config/inversify/inversify.config";
import TYPES from "../config/inversify/inversify.types";
import type App from "./App";

class AppFactory {
  static create(): App {
    return container.get<App>(TYPES.App);
  }
}

export default AppFactory;
