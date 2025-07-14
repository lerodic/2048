import "./assets/styles/main.scss";
import container from "./config/inversify/inversify.config";
import TYPES from "./config/inversify/inversify.types";
import type App from "./lib/App";

const app = container.get<App>(TYPES.App);
app.run();
