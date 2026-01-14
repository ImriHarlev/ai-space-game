# Space Shooter - 2D Canvas Game

A modular, TypeScript-based 2D Space Shooter game built with Vite and HTML5 Canvas. The game features keyboard controls, enemy spawning waves, collision detection, and an AI-ready game state hook.

## 🎮 Features

- **Modular Architecture**: Clean separation of concerns with dedicated modules for engine, physics, rendering, and game state
- **Collision Detection**: AABB (Axis-Aligned Bounding Box) collision detection between bullets and enemies
- **Wave System**: Enemies spawn in waves that increase in difficulty
- **Garbage Collection**: Automatic cleanup of off-screen bullets and enemies
- **AI-Ready Hooks**: External agents can control the game via `window.getGameState()` and `window.setGameInput()`
- **Responsive Canvas**: Game canvas adapts to window size
- **Visual Effects**: Starfield background, glowing bullets, color-coded entities

## 📁 Project Structure

```
src/
├── types/
│   └── entities.ts          # All TypeScript interfaces and type definitions
├── input/
│   └── InputHandler.ts      # Keyboard input management and state tracking
├── entities/
│   ├── Player.ts            # Player spaceship class
│   ├── Enemy.ts             # Enemy spaceship class
│   └── Bullet.ts            # Bullet projectile class
├── physics/
│   └── CollisionDetection.ts # AABB collision and utility functions
├── state/
│   └── GameState.ts         # Central game state manager
├── renderer/
│   └── Renderer.ts          # Canvas rendering logic
├── engine/
│   └── Engine.ts            # Game loop and requestAnimationFrame management
├── main.ts                  # Entry point and initialization
└── style.scss               # Game styling
```

## 🎯 Game Controls

| Control | Action |
|---------|--------|
| **↑ Arrow Up** | Move spaceship up |
| **↓ Arrow Down** | Move spaceship down |
| **← Arrow Left** | Move spaceship left |
| **→ Arrow Right** | Move spaceship right |
| **Spacebar** | Fire bullets |

Alternative WASD controls also work for movement.

## 🏗️ Architecture Overview

### Engine (`src/engine/Engine.ts`)
- Manages the main game loop using `requestAnimationFrame`
- Coordinates updates between GameState, InputHandler, and Renderer
- Provides control methods for pause/resume and external input

### GameState (`src/state/GameState.ts`)
- Central manager for all game entities (Player, Enemies, Bullets)
- Handles game logic: spawning, collisions, garbage collection, scoring
- Maintains wave system and difficulty progression
- Provides `getGameState()` snapshot for AI agents

### Entities
- **Player** (`src/entities/Player.ts`): Spaceship controlled by player/AI
  - Movement: Arrow keys or programmatic input
  - Shooting: Spacebar with fire rate control
  - Health system

- **Enemy** (`src/entities/Enemy.ts`): Hostile spaceships
  - Spawn at random positions at top of screen
  - Move downward at increasing speeds per wave
  - Destroyed when shot 3 times (20 HP, 20 damage per bullet)

- **Bullet** (`src/entities/Bullet.ts`): Player projectiles
  - Travel upward from player position
  - Deal 20 damage on collision
  - Remove themselves when off-screen

### Physics (`src/physics/CollisionDetection.ts`)
- **checkAABBCollision()**: Detects overlapping rectangular areas
- **calculateDistance()**: Measures distance between points for nearest enemy detection
- **clamp()**: Constrains values within bounds (used for player movement boundaries)

### Renderer (`src/renderer/Renderer.ts`)
- Draws game entities (player, enemies, bullets)
- Renders HUD with health, score, and bullet count
- Displays starfield background
- Shows game over screen

### InputHandler (`src/input/InputHandler.ts`)
- Tracks keyboard state for all movement and action keys
- Supports both arrow keys and WASD
- Can be controlled by AI via `setInputState()` method

## 🎲 Game Mechanics

### Spawning
- Enemies spawn in waves at the top of the screen
- Initial wave: 5 enemies
- Each subsequent wave increases by 3 enemies
- Spawn interval decreases over time (minimum 800ms)
- Maximum 15 enemies on screen at once

### Scoring
- +10 points per enemy destroyed
- +5 bonus points per collision (for surviving)

### Difficulty
- Wave 1: 5 enemies at 150 px/s
- Wave 2: 8 enemies at 170 px/s
- Wave 3: 11 enemies at 190 px/s
- And so on...

### Collision System
All collision detection uses AABB (Axis-Aligned Bounding Box):
```
if (box1.x < box2.x + box2.width &&
    box1.x + box1.width > box2.x &&
    box1.y < box2.y + box2.height &&
    box1.y + box1.height > box2.y) {
  // Collision detected
}
```

## 🤖 AI-Ready API

The game exposes a public API for external agents to control and query game state:

### Getting Game State
```typescript
const state = window.getGameState();

// Returns:
{
  player: {
    x: number;      // Player center X position
    y: number;      // Player center Y position
    health: number; // Current health (0-100)
  };
  closestEnemies: [
    { x: number; y: number; distance: number }, // Top 5 closest enemies
    // ...
  ];
  bulletCount: number;        // Number of active bullets
  isGameRunning: boolean;     // Game state (running vs game over)
  score: number;              // Current score
}
```

### Setting Input
```typescript
// Control game via external agent
window.setGameInput({
  up: boolean,
  down: boolean,
  left: boolean,
  right: boolean,
  shoot: boolean
});
```

### Game Control
```typescript
// Pause/resume the game
window.pauseGame(true);  // Pause
window.pauseGame(false); // Resume

// Reset game to initial state
window.resetGame();

// Direct access to engine
const engine = window.gameEngine;
```

### Example AI Agent
```typescript
// Simple AI that shoots at enemies
function updateAI() {
  const state = window.getGameState();
  
  if (state.closestEnemies.length > 0) {
    const enemy = state.closestEnemies[0];
    
    // Move towards enemy
    if (enemy.x < state.player.x) {
      window.setGameInput({ left: true });
    } else if (enemy.x > state.player.x) {
      window.setGameInput({ right: true });
    }
    
    // Always shoot
    window.setGameInput({ shoot: true });
  }
  
  requestAnimationFrame(updateAI);
}
```

## 🚀 Installation & Running

### Development
```bash
pnpm install
pnpm run dev
```

Game will be available at `http://localhost:5173` (or similar)

### Production Build
```bash
pnpm run build
pnpm run preview
```

Output is in the `dist/` directory.

## 📊 Type System

All data structures are fully typed using TypeScript interfaces:

```typescript
// Entity types
interface Vector { x: number; y: number; }
interface BoundingBox { x: number; y: number; width: number; height: number; }
interface Entity { 
  position: Vector; 
  velocity: Vector; 
  update(deltaTime: number): void; 
  draw(ctx: CanvasRenderingContext2D): void; 
}

// Game state
interface GameStateSnapshot {
  player: { x: number; y: number; health: number };
  closestEnemies: ClosestEnemy[];
  bulletCount: number;
  isGameRunning: boolean;
  score: number;
}
```

## 🔧 Configuration

Game parameters can be adjusted in `src/state/GameState.ts`:

```typescript
private enemySpawnInterval: number = 1500;    // Milliseconds between spawns
private maxEnemies: number = 15;              // Max enemies on screen
private waveEnemyCount: number = 5;           // Starting enemies per wave

// In Player.ts
private maxSpeed: number = 400;               // Player speed (px/s)
private acceleration: number = 1500;          // Player acceleration (px/s²)
fireRate: number = 200;                       // Milliseconds between shots

// In Enemy.ts
private speed: number = 150;                  // Base enemy speed (px/s)

// In Bullet.ts
private speed: number = 600;                  // Bullet speed (px/s)
private damage: number = 20;                  // Damage per bullet
```

## 🎨 Visual Design

- **Player**: Green triangle pointing up with yellow cockpit
- **Enemies**: Red inverted triangles with red energy core
- **Bullets**: Yellow glowing rectangles
- **Background**: Dark blue with white starfield
- **Canvas Border**: Green glowing border

## 📦 Technologies Used

- **TypeScript**: Type-safe game code
- **Vite**: Fast build tool and dev server
- **HTML5 Canvas**: Rendering API
- **Vanilla JavaScript**: No external game libraries

## 🐛 Known Limitations

- Game ends when player health reaches 0 (no continue/lives)
- No pause menu (but game can be paused via `window.pauseGame()`)
- Simple starfield (pseudo-random, not animated)
- No sound effects or music
- Single-threaded (no Web Workers for physics)

## 🔮 Future Enhancements

- Power-ups (health, rapid fire, shields)
- Multiple weapon types
- Boss enemies
- Sound effects and background music
- Mobile touch controls
- Difficulty settings
- High score persistence
- Particle effects for explosions
- Physics-based movement
- Multiple levels/maps

## 📝 Notes for AI Development

The game state is designed to be consumed by AI agents:

1. **Steppable Loop**: Each frame is independent; the game can pause/resume at any point
2. **Deterministic**: Same input produces same results (good for testing)
3. **Observable**: Full game state available at any time via `getGameState()`
4. **Controllable**: Input can be set by external agents via `setGameInput()`
5. **State-based**: No complex event systems, just simple state queries

This design makes it ideal for:
- Reinforcement learning (RL) agents
- Behavior tree AI systems
- Monte Carlo tree search algorithms
- Human player input and testing

---

**Created**: January 2026  
**Version**: 1.0.0  
**License**: MIT
