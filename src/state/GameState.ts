/**
 * Game State Manager - Manages all game entities and game logic
 */

import { Player } from '../entities/Player';
import { Enemy } from '../entities/Enemy';
import { Bullet } from '../entities/Bullet';
import type { InputState, GameStateSnapshot, ClosestEnemy } from '../types/entities';
import { checkAABBCollision, calculateDistance, clamp } from '../physics/CollisionDetection';

export class GameState {
  private player: Player;
  private enemies: Enemy[] = [];
  private bullets: Bullet[] = [];

  private canvasWidth: number;
  private canvasHeight: number;

  private isGameRunning: boolean = true;
  private score: number = 0;

  // Spawning logic
  private lastEnemySpawnTime: number = 0;
  private enemySpawnInterval: number = 1500; // Milliseconds between spawns
  private enemySpawnCount: number = 0;
  private maxEnemies: number = 15;

  // Wave system
  private waveNumber: number = 1;
  private waveEnemyCount: number = 5;

  constructor(canvasWidth: number, canvasHeight: number) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    // Initialize player at bottom center of canvas
    this.player = new Player(canvasWidth / 2 - 15, canvasHeight - 80);
  }

  /**
   * Update game state
   */
  update(deltaTime: number, inputState: InputState): void {
    if (!this.isGameRunning) return;

    const currentTime = Date.now();

    // Update player
    this.player.update(deltaTime, {
      up: inputState.up,
      down: inputState.down,
      left: inputState.left,
      right: inputState.right,
    });

    // Clamp player position to canvas bounds
    this.player.position.x = clamp(this.player.position.x, 0, this.canvasWidth - this.player.width);
    this.player.position.y = clamp(this.player.position.y, 0, this.canvasHeight - this.player.height);

    // Handle shooting
    if (inputState.shoot && this.player.canFire(currentTime)) {
      this.spawnBullet(currentTime);
      this.player.recordShot(currentTime);
    }

    // Update bullets
    for (const bullet of this.bullets) {
      bullet.update(deltaTime);
    }

    // Update enemies
    for (const enemy of this.enemies) {
      enemy.update(deltaTime);
    }

    // Spawn enemies
    this.spawnEnemies(currentTime);

    // Collision detection: bullets vs enemies
    this.checkBulletEnemyCollisions();

    // Garbage collection: remove off-screen entities
    this.bulletGarbageCollection();
    this.enemyGarbageCollection();

    // Check if player is hit by enemies (simple collision)
    this.checkPlayerEnemyCollisions();

    // Check if game is over
    if (!this.player.isAlive()) {
      this.isGameRunning = false;
    }
  }

  /**
   * Spawn a bullet from player position
   */
  private spawnBullet(currentTime: number): void {
    const bullet = new Bullet(this.player.position.x + this.player.width / 2, this.player.position.y, currentTime);
    this.bullets.push(bullet);
  }

  /**
   * Spawn enemies at random intervals
   */
  private spawnEnemies(currentTime: number): void {
    if (this.enemies.length >= this.maxEnemies) return;
    if (currentTime - this.lastEnemySpawnTime < this.enemySpawnInterval) return;

    // Spawn multiple enemies in a wave pattern
    const numToSpawn = Math.min(3, this.waveEnemyCount - this.enemySpawnCount);
    for (let i = 0; i < numToSpawn; i++) {
      const x = Math.random() * (this.canvasWidth - 30);
      const enemy = new Enemy(x, -40, currentTime, 150 + this.waveNumber * 20);
      this.enemies.push(enemy);
      this.enemySpawnCount++;
    }

    this.lastEnemySpawnTime = currentTime;

    // Next wave
    if (this.enemySpawnCount >= this.waveEnemyCount) {
      this.waveNumber++;
      this.waveEnemyCount += 3;
      this.enemySpawnCount = 0;
      this.enemySpawnInterval = Math.max(800, this.enemySpawnInterval - 100);
    }
  }

  /**
   * Check collisions between bullets and enemies
   */
  private checkBulletEnemyCollisions(): void {
      for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];

        if (checkAABBCollision(bullet.getBoundingBox(), enemy.getBoundingBox())) {
          // Hit detected
          enemy.takeDamage(bullet.getDamage());

          // Remove bullet
          this.bullets.splice(i, 1);

          // Remove enemy if dead
          if (!enemy.isAlive()) {
            this.enemies.splice(j, 1);
            this.score += 10; // Points for killing enemy
          }

          break; // Bullet can only hit one enemy
        }
      }
    }
  }

  /**
   * Check collisions between player and enemies
   */
  private checkPlayerEnemyCollisions(): void {
    const playerBBox = this.player.getBoundingBox();

    for (const enemy of this.enemies) {
      if (checkAABBCollision(playerBBox, enemy.getBoundingBox())) {
        // Collision damage
        this.player.takeDamage(10);
        this.score += 5; // Bonus points for surviving hit
      }
    }
  }

  /**
   * Remove bullets that are off-screen
   */
  private bulletGarbageCollection(): void {
    this.bullets = this.bullets.filter((bullet) => !bullet.isOffScreen());
  }

  /**
   * Remove enemies that are off-screen or dead
   */
  private enemyGarbageCollection(): void {
    this.enemies = this.enemies.filter((enemy) => !enemy.isOffScreen(this.canvasHeight) && enemy.isAlive());
  }

  /**
   * Get the 5 closest enemies to the player
   */
  private getClosestEnemies(count: number = 5): ClosestEnemy[] {
    const distances = this.enemies.map((enemy) => ({
      x: enemy.position.x,
      y: enemy.position.y,
      distance: calculateDistance(
        this.player.position.x + this.player.width / 2,
        this.player.position.y + this.player.height / 2,
        enemy.position.x + enemy.width / 2,
        enemy.position.y + enemy.height / 2
      ),
    }));

    return distances.sort((a, b) => a.distance - b.distance).slice(0, count);
  }

  /**
   * Get game state snapshot for AI hook
   */
  getGameState(): GameStateSnapshot {
    return {
      player: {
        x: this.player.position.x + this.player.width / 2,
        y: this.player.position.y + this.player.height / 2,
        health: this.player.health,
      },
      closestEnemies: this.getClosestEnemies(5),
      bulletCount: this.bullets.length,
      isGameRunning: this.isGameRunning,
      score: this.score,
    };
  }

  /**
   * Pause/resume game
   */
  setPaused(paused: boolean): void {
    this.isGameRunning = !paused;
  }

  /**
   * Check if game is running
   */
  isRunning(): boolean {
    return this.isGameRunning;
  }

  /**
   * Getters for entities (for rendering)
   */
  getPlayer(): Player {
    return this.player;
  }

  getEnemies(): Enemy[] {
    return this.enemies;
  }

  getBullets(): Bullet[] {
    return this.bullets;
  }

  getScore(): number {
    return this.score;
  }

  /**
   * Reset game state
   */
  reset(): void {
    this.player = new Player(this.canvasWidth / 2 - 15, this.canvasHeight - 80);
    this.enemies = [];
    this.bullets = [];
    this.isGameRunning = true;
    this.score = 0;
    this.lastEnemySpawnTime = 0;
    this.waveNumber = 1;
    this.enemySpawnCount = 0;
  }
}
