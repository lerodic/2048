import { boundClass } from "autobind-decorator";
import { inject, injectable } from "inversify";
import TYPES from "../../../config/inversify/inversify.types";
import type { EventEmitter } from "../../../types";

@boundClass
@injectable()
class ScoreService {
  private currentScore: number = 0;
  private highScore: number = 0;

  constructor(@inject(TYPES.EventEmitter) private emitter: EventEmitter) {}

  loadSavedHighScore() {
    const savedScore = localStorage.getItem("highScore");
    if (!savedScore) return;

    this.updateHighScore(+savedScore);
  }

  private updateHighScore(newHighScore: number) {
    this.highScore = newHighScore;
    this.persistHighScore();

    this.emitter.emit("highScoreUpdated", this.highScore);
  }

  updateScore(increment: number) {
    if (increment <= 0) return;

    this.currentScore += increment;
    this.emitter.emit("scoreUpdated", this.currentScore);

    if (!this.isNewHighScore()) return;

    this.updateHighScore(this.currentScore);
  }

  private isNewHighScore(): boolean {
    console.log(this.currentScore);
    console.log(this.highScore);

    return this.currentScore > this.highScore;
  }

  private persistHighScore() {
    localStorage.setItem("highScore", this.highScore.toString());
  }
}

export default ScoreService;
