/**
 * Renderer - Handles all canvas drawing logic
 */

import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';

export class Renderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvasElement: HTMLCanvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext('2d')!;
    if (!this.ctx) {
      throw new Error('Failed to get 2D context from canvas');
    }
  }

  /**
   * Clear the canvas
   */
  clear(): void {
    this.ctx.fillStyle = '#000033'; // Dark blue background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Optional: Draw a starfield background
    this.drawStars();
  }

  /**
   * Draw a simple starfield background
   */
  private drawStars(): void {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    // Use a seeded random for consistent stars
    const seed = 12345;
    let random = seed;
    const numStars = 100;

    for (let i = 0; i < numStars; i++) {
      // Simple pseudo-random number generator
      random = (random * 9301 + 49297) % 233280;
      const x = (random / 233280) * this.canvas.width;
      random = (random * 9301 + 49297) % 233280;
      const y = (random / 233280) * this.canvas.height;
      random = (random * 9301 + 49297) % 233280;
      const size = (random / 233280) * 1.5;

      this.ctx.fillRect(x, y, size, size);
    }
  }

  /**
   * Draw player
   */
  drawPlayer(player: Player): void {
    player.draw(this.ctx);
  }

  /**
   * Draw all enemies
   */
  drawEnemies(enemies: Enemy[]): void {
    for (const enemy of enemies) {
      enemy.draw(this.ctx);
    }
  }

  /**
   * Draw all bullets
   */
  drawBullets(bullets: Bullet[]): void {
    for (const bullet of bullets) {
      bullet.draw(this.ctx);
    }
  }

  /**
   * Draw game HUD (health, score, bullet count)
   */
  drawHUD(health: number, score: number, bulletCount: number): void {
    this.ctx.fillStyle = '#FFFFFF';
    this.ctx.font = '16px Arial';
    this.ctx.textAlign = 'left';

    // Health
    this.ctx.fillText(`Health: ${Math.max(0, Math.floor(health))}`, 10, 30);

    // Score
    this.ctx.fillText(`Score: ${Math.floor(score)}`, 10, 60);

    // Bullets
    this.ctx.fillText(`Bullets: ${bulletCount}`, 10, 90);
  }

  /**
   * Draw game over message
   */
  drawGameOver(score: number): void {
    // Semi-transparent overlay
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Game Over text
    this.ctx.fillStyle = '#FF0000';
    this.ctx.font = 'bold 60px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2 - 40);

    // Score
    this.ctx.fillStyle = '#FFFF00';
    this.ctx.font = '30px Arial';
    this.ctx.fillText(`Final Score: ${Math.floor(score)}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
  }

  /**
   * Get canvas dimensions
   */
  getCanvasWidth(): number {
    return this.canvas.width;
  }

  getCanvasHeight(): number {
    return this.canvas.height;
  }

  /**
   * Resize canvas
   */
  resizeCanvas(width: number, height: number): void {
    this.canvas.width = width;
    this.canvas.height = height;
  }
}
