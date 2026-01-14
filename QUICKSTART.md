# 🚀 Quick Start Guide - Space Shooter Game

## ⚡ 60 Second Setup

```bash
cd c:\Users\ImriHarlev\Programing\Personal\Space-game\space-game
pnpm install    # Already done
pnpm run dev    # Start dev server
```

Open `http://localhost:5173` in your browser. Game should appear immediately!

## 🎮 How to Play

1. **Move your green spaceship** with **Arrow Keys** (or WASD)
2. **Shoot red enemies** with **Spacebar**
3. **Survive waves** of increasingly difficult enemies
4. **Get the high score!**

## 📊 Game Basics

| Item | Details |
|------|---------|
| **Player** | Green triangle, starts at bottom |
| **Enemies** | Red triangles, spawn at top, move down |
| **Bullets** | Yellow glowing rectangles, move up |
| **Health** | Shown in HUD top-left |
| **Score** | Earned by defeating enemies |

## 🤖 AI Integration (Advanced)

Open browser console (F12) and try these commands:

### Get Current Game State
```javascript
const state = window.getGameState();
console.log(state);
// Output:
// {
//   player: { x: 512, y: 850, health: 100 },
//   closestEnemies: [
//     { x: 450, y: 200, distance: 650 },
//     { x: 530, y: 280, distance: 580 },
//     ...
//   ],
//   bulletCount: 3,
//   isGameRunning: true,
//   score: 120
// }
```

### Control Game with AI
```javascript
// Move right and shoot
window.setGameInput({
  right: true,
  shoot: true
});

// Stop all input
window.setGameInput({
  up: false,
  down: false,
  left: false,
  right: false,
  shoot: false
});
```

### Pause/Resume
```javascript
window.pauseGame(true);   // Pause
window.pauseGame(false);  // Resume
```

### Reset Game
```javascript
window.resetGame();
```

## 📝 Simple AI Example

Paste this in browser console to run a simple auto-shooter:

```javascript
let lastShoot = 0;

function simpleAI() {
  const state = window.getGameState();
  
  if (!state.isGameRunning) {
    window.resetGame();
  }
  
  // Auto-shoot every 200ms
  const now = Date.now();
  const shoot = (now - lastShoot) > 200;
  if (shoot) lastShoot = now;
  
  // Move towards closest enemy
  let moveLeft = false, moveRight = false;
  
  if (state.closestEnemies.length > 0) {
    const enemy = state.closestEnemies[0];
    if (enemy.x < state.player.x - 50) {
      moveLeft = true;
    } else if (enemy.x > state.player.x + 50) {
      moveRight = true;
    }
  }
  
  window.setGameInput({
    left: moveLeft,
    right: moveRight,
    shoot: shoot
  });
  
  requestAnimationFrame(simpleAI);
}

simpleAI();
```

## 📁 File Structure

```
src/
├── types/entities.ts          ← All game interfaces
├── input/InputHandler.ts      ← Keyboard input
├── entities/                  ← Player, Enemy, Bullet classes
├── physics/CollisionDetection ← AABB collision
├── state/GameState.ts         ← Game logic & state
├── renderer/Renderer.ts       ← Canvas drawing
├── engine/Engine.ts           ← Main game loop
└── main.ts                    ← Initialization
```

## 🏗️ Architecture Overview

```
RequestAnimationFrame Loop
        ↓
   Engine.gameLoop()
        ↓
   GameState.update() ← InputHandler
        ├─ Spawn enemies
        ├─ Update all entities
        ├─ Collision detection
        └─ Garbage collection
        ↓
   Renderer.render()
        ├─ Clear canvas
        ├─ Draw entities
        └─ Draw HUD
```

## ⚙️ Configuration

Edit game parameters in `src/state/GameState.ts`:

```typescript
private enemySpawnInterval: number = 1500;    // Less = faster spawning
private maxEnemies: number = 15;              // Max on screen
private waveEnemyCount: number = 5;           // Starting wave size
```

Or in `src/entities/`:

```typescript
// Player.ts
private maxSpeed: number = 400;               // Movement speed
fireRate: number = 200;                       // Shooting speed (lower = faster)

// Enemy.ts
private speed: number = 150;                  // Enemy speed (increases per wave)

// Bullet.ts
private damage: number = 20;                  // Damage per hit
```

## 🔍 Debugging

### View Frame Rate
Add to console:
```javascript
let frameCount = 0;
let lastTime = Date.now();

function countFrames() {
  frameCount++;
  const now = Date.now();
  if (now - lastTime > 1000) {
    console.log(`FPS: ${frameCount}`);
    frameCount = 0;
    lastTime = now;
  }
  requestAnimationFrame(countFrames);
}

countFrames();
```

### Log Game State Each Frame
```javascript
function debugState() {
  console.log(window.getGameState());
  requestAnimationFrame(debugState);
}
debugState();
```

### Access Engine Directly
```javascript
const engine = window.gameEngine;
// engine.start()
// engine.stop()
// engine.reset()
// engine.setPaused(boolean)
```

## 📦 Build Commands

```bash
pnpm run dev       # Development server (live reload)
pnpm run build     # Production build (dist/)
pnpm run preview   # Preview production build locally
```

## 🎯 Game Tips

1. **Stay centered** - Easier to dodge enemies from middle
2. **Clear waves** - Each wave gets progressively harder
3. **Use space** - Constant fire is better than careful aiming
4. **Watch edges** - Enemies can appear anywhere at top

## 🐛 Common Issues

### Game doesn't start?
- Check browser console for errors (F12)
- Refresh page
- Try `pnpm run dev` again

### AI isn't working?
- Make sure you're calling `window.setGameInput()` not `setInput()`
- Check browser console for errors
- Use `window.getGameState()` to verify game is running

### Poor performance?
- Close other browser tabs
- Reduce `maxEnemies` in GameState.ts
- Check if AI loop is running too fast (add delays)

## 📚 Learn More

- **README.md** - Full feature documentation
- **ARCHITECTURE.md** - Detailed technical design
- **src/types/entities.ts** - All TypeScript interfaces
- **Browser Console** - Real-time game state inspection

## 🎓 AI Development Ideas

1. **Reinforcement Learning**: Train agent to maximize score
2. **Genetic Algorithm**: Evolve behavior parameters
3. **Behavior Trees**: Pattern-based decision making
4. **Neural Network**: Deep Q-learning agent
5. **Monte Carlo Search**: Optimal move planning
6. **Simple Heuristics**: Rule-based AI (easiest)

## 🚀 Next Steps

1. Run the game: `pnpm run dev`
2. Play a few rounds manually
3. Try the AI example above in console
4. Modify AI behavior
5. Create your own agent!

---

**Tip**: The game is designed to be AI-friendly. You can:
- Query full game state at any time
- Set input programmatically
- Pause/resume at will
- Reset and retry

Perfect for ML/AI experimentation! 🤖
