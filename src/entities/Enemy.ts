/**
 * Enemy Entity - Represents enemy spaceships
 */

import type { EnemyData, Vector, BoundingBox } from '../types/entities';

export class Enemy implements EnemyData {
  position: Vector;
  velocity: Vector;
  width: number = 25;
  height: number = 25;
  health: number = 20;
  spawnTime: number;

  private speed: number = 150; // pixels per second

  constructor(x: number, y: number, spawnTime: number, speed?: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: this.speed };
    this.spawnTime = spawnTime;
    if (speed) this.speed = speed;
  }

  /**
   * Update enemy position
   */
  update(deltaTime: number): void {
    const dtSeconds = deltaTime / 1000;
    this.position.x += this.velocity.x * dtSeconds;
    this.position.y += this.velocity.y * dtSeconds;
  }

  /**
   * Draw enemy spaceship
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);

    // Draw enemy spaceship (inverted triangle pointing down)
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.moveTo(0, this.height / 2); // Bottom point
    ctx.lineTo(-this.width / 2, -this.height / 2); // Top left
    ctx.lineTo(this.width / 2, -this.height / 2); // Top right
    ctx.closePath();
    ctx.fill();

    // Draw energy core (small circle)
    ctx.fillStyle = '#FF6666';
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  /**
   * Get bounding box for collision detection
   */
  getBoundingBox(): BoundingBox {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this.health -= amount;
  }

  /**
   * Check if enemy is alive
   */
  isAlive(): boolean {
    return this.health > 0;
  }

  /**
   * Check if enemy is off-screen (for garbage collection)
   */
  isOffScreen(canvasHeight: number): boolean {
    return this.position.y > canvasHeight + 50;
  }
}
