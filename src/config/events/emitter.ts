import mitt from "mitt";
import type { AppEvents } from "../../types";

const emitter = mitt<AppEvents>();

export default emitter;
