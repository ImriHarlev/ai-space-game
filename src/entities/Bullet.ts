/**
 * Bullet Entity - Represents projectiles fired by the player
 */

import type { BulletData, Vector, BoundingBox } from '../types/entities';

export class Bullet implements BulletData {
  position: Vector;
  velocity: Vector;
  width: number = 5;
  height: number = 15;
  spawnTime: number;

  private speed: number = 600; // pixels per second
  private damage: number = 20; // Damage per bullet

  constructor(x: number, y: number, spawnTime: number) {
    // Center bullet on player position
    this.position = { x: x - this.width / 2, y };
    this.velocity = { x: 0, y: -this.speed };
    this.spawnTime = spawnTime;
  }

  /**
   * Update bullet position
   */
  update(deltaTime: number): void {
    const dtSeconds = deltaTime / 1000;
    this.position.x += this.velocity.x * dtSeconds;
    this.position.y += this.velocity.y * dtSeconds;
  }

  /**
   * Draw bullet
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = '#FFFF00';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);

    // Add glow effect
    ctx.strokeStyle = '#FFFF00';
    ctx.lineWidth = 1;
    ctx.globalAlpha = 0.5;
    ctx.strokeRect(this.position.x - 2, this.position.y - 2, this.width + 4, this.height + 4);
    ctx.globalAlpha = 1;
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
   * Get damage value
   */
  getDamage(): number {
    return this.damage;
  }

  /**
   * Check if bullet is off-screen (for garbage collection)
   */
  isOffScreen(): boolean {
    return this.position.y < -50;
  }
}
