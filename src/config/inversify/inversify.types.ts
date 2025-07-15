const TYPES = {
  GameController: Symbol.for("GameController"),
  ViewController: Symbol.for("ViewController"),
  App: Symbol.for("App"),
  EventEmitter: Symbol.for("EventEmitter"),
  GameService: Symbol.for("GameService"),
  TileService: Symbol.for("TileService"),
  TileFactory: Symbol.for("TileFactory"),
  Config: Symbol.for("Config"),
  UIGameService: Symbol.for("UIGameService"),
  HTMLElementLocator: Symbol.for("HTMLElementLocator"),
  InputController: Symbol.for("InputController"),
  TouchInputService: Symbol.for("TouchInputService"),
  KeyboardInputService: Symbol.for("KeyboardInputService"),
  UIScoreService: Symbol.for("UIScoreService"),
  ScoreService: Symbol.for("ScoreService"),
  UIThemeService: Symbol.for("UIThemeService"),
  MouseInputService: Symbol.for("MouseInputService"),
};

export default TYPES;
