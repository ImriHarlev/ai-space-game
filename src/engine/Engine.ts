/**
 * Game Engine - Manages the requestAnimationFrame loop and game loop
 */

import { GameState } from '../state/GameState';
import { InputHandler } from '../input/InputHandler';
import { Renderer } from '../renderer/Renderer';
import type { GameStateSnapshot } from '../types/entities';

export class Engine {
  private gameState: GameState;
  private inputHandler: InputHandler;
  private renderer: Renderer;

  private isRunning: boolean = false;
  private lastFrameTime: number = 0;
  private animationFrameId: number | null = null;

  constructor(canvasElement: HTMLCanvasElement) {
    this.gameState = new GameState(canvasElement.width, canvasElement.height);
    this.inputHandler = new InputHandler();
    this.renderer = new Renderer(canvasElement);
  }

  /**
   * Start the game loop
   */
  start(): void {
    if (this.isRunning) return;

    this.isRunning = true;
    this.lastFrameTime = Date.now();
    this.gameLoop();
  }

  /**
   * Stop the game loop
   */
  stop(): void {
    this.isRunning = false;
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main game loop
   */
  private gameLoop = (): void => {
    if (!this.isRunning) return;

    const currentTime = Date.now();
    const deltaTime = currentTime - this.lastFrameTime;
    this.lastFrameTime = currentTime;

    // Update game state
    this.gameState.update(deltaTime, this.inputHandler.getInputState());

    // Render
    this.render();

    // Continue loop
    this.animationFrameId = requestAnimationFrame(this.gameLoop);
  };

  /**
   * Render the game
   */
  private render(): void {
    const player = this.gameState.getPlayer();
    const enemies = this.gameState.getEnemies();
    const bullets = this.gameState.getBullets();
    const score = this.gameState.getScore();

    // Clear canvas
    this.renderer.clear();

    // Draw game entities
    this.renderer.drawPlayer(player);
    this.renderer.drawEnemies(enemies);
    this.renderer.drawBullets(bullets);

    // Draw HUD
    this.renderer.drawHUD(player.health, score, bullets.length);

    // Draw game over if not running
    if (!this.gameState.isRunning()) {
      this.renderer.drawGameOver(score);
    }
  }

  /**
   * Get current game state snapshot (for AI hook)
   */
  getGameState(): GameStateSnapshot {
    return this.gameState.getGameState();
  }

  /**
   * Pause/resume the game
   */
  setPaused(paused: boolean): void {
    this.gameState.setPaused(paused);
  }

  /**
   * Set input state programmatically (for AI control)
   */
  setInputState(input: Partial<import('../types/entities').InputState>): void {
    this.inputHandler.setInputState(input);
  }

  /**
   * Reset the game
   */
  reset(): void {
    this.gameState.reset();
    this.lastFrameTime = Date.now();
  }

  /**
   * Get input handler for direct control
   */
  getInputHandler(): InputHandler {
    return this.inputHandler;
  }

  /**
   * Resize canvas
   */
  resizeCanvas(width: number, height: number): void {
    this.renderer.resizeCanvas(width, height);
  }
}
