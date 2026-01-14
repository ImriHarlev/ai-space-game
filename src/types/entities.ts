/**
 * Type definitions and interfaces for the Space Shooter game
 */

/**
 * Represents a 2D vector with x and y coordinates
 */
export interface Vector {
  x: number;
  y: number;
}

/**
 * Represents a bounding box for collision detection
 */
export interface BoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Base interface for game entities (Player, Enemy, Bullet)
 */
export interface Entity {
  position: Vector;
  velocity: Vector;
  width: number;
  height: number;

  /**
   * Update entity state (position, velocity, etc.)
   * @param deltaTime - Time since last frame in milliseconds
   */
  update(deltaTime: number): void;

  /**
   * Render entity to canvas
   * @param ctx - Canvas 2D rendering context
   */
  draw(ctx: CanvasRenderingContext2D): void;

  /**
   * Get the bounding box for collision detection
   */
  getBoundingBox(): BoundingBox;
}

/**
 * Represents the player spaceship
 */
export interface PlayerData extends Entity {
  health: number;
  fireRate: number; // Milliseconds between shots
  lastShotTime: number; // Timestamp of last shot
}

/**
 * Represents an enemy spaceship
 */
export interface EnemyData extends Entity {
  health: number;
  spawnTime: number; // Time when enemy was spawned
}

/**
 * Represents a bullet projectile
 */
export interface BulletData extends Entity {
  spawnTime: number; // Time when bullet was fired
}

/**
 * Closest enemy information for AI hook
 */
export interface ClosestEnemy {
  x: number;
  y: number;
  distance: number;
}

/**
 * Main game state object returned by getGameState()
 */
export interface GameStateSnapshot {
  player: {
    x: number;
    y: number;
    health: number;
  };
  closestEnemies: ClosestEnemy[]; // 5 closest enemies
  bulletCount: number;
  isGameRunning: boolean;
  score: number;
}

/**
 * Input state tracking
 */
export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  shoot: boolean;
}
