/**
 * Player Entity - Represents the player spaceship
 */

import type { Vector, BoundingBox } from '../types/entities';

export class Player {
  position: Vector;
  velocity: Vector;
  width: number = 30;
  height: number = 40;
  health: number = 100;
  fireRate: number = 200; // Milliseconds between shots
  lastShotTime: number = 0;

  private maxSpeed: number = 400; // pixels per second
  private acceleration: number = 1500; // pixels per second²

  constructor(x: number, y: number) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
  }

  /**
   * Update player position and velocity
   */
  update(deltaTime: number, input: { up: boolean; down: boolean; left: boolean; right: boolean }): void {
    // Handle input and acceleration
    let targetVelX = 0;
    let targetVelY = 0;

    if (input.up) targetVelY = -this.maxSpeed;
    if (input.down) targetVelY = this.maxSpeed;
    if (input.left) targetVelX = -this.maxSpeed;
    if (input.right) targetVelX = this.maxSpeed;

    // Smoothly accelerate towards target velocity
    const dtSeconds = deltaTime / 1000;
    this.velocity.x += (targetVelX - this.velocity.x) * Math.min(1, this.acceleration * dtSeconds / this.maxSpeed);
    this.velocity.y += (targetVelY - this.velocity.y) * Math.min(1, this.acceleration * dtSeconds / this.maxSpeed);

    // Update position
    this.position.x += this.velocity.x * dtSeconds;
    this.position.y += this.velocity.y * dtSeconds;
  }

  /**
   * Draw player spaceship
   */
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.translate(this.position.x + this.width / 2, this.position.y + this.height / 2);

    // Draw spaceship body (triangle pointing up)
    ctx.fillStyle = '#00FF00';
    ctx.beginPath();
    ctx.moveTo(0, -this.height / 2); // Top point
    ctx.lineTo(-this.width / 2, this.height / 2); // Bottom left
    ctx.lineTo(this.width / 2, this.height / 2); // Bottom right
    ctx.closePath();
    ctx.fill();

    // Draw cockpit (small circle)
    ctx.fillStyle = '#FFFF00';
    ctx.beginPath();
    ctx.arc(0, -this.height / 4, 4, 0, Math.PI * 2);
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
   * Check if player can fire (based on fire rate)
   */
  canFire(currentTime: number): boolean {
    return currentTime - this.lastShotTime > this.fireRate;
  }

  /**
   * Update last shot time
   */
  recordShot(currentTime: number): void {
    this.lastShotTime = currentTime;
  }

  /**
   * Take damage
   */
  takeDamage(amount: number): void {
    this.health -= amount;
  }

  /**
   * Check if player is alive
   */
  isAlive(): boolean {
    return this.health > 0;
  }
}
