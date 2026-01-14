# Space Shooter Game - File Structure & Summary

## Final Project Structure

```
space-game/
├── src/
│   ├── types/
│   │   └── entities.ts                    # All TypeScript interfaces (85 lines)
│   ├── input/
│   │   └── InputHandler.ts                # Keyboard input management (102 lines)
│   ├── entities/
│   │   ├── Player.ts                      # Player spaceship (116 lines)
│   │   ├── Enemy.ts                       # Enemy spaceship (75 lines)
│   │   └── Bullet.ts                      # Bullet projectile (77 lines)
│   ├── physics/
│   │   └── CollisionDetection.ts          # AABB collision & utilities (24 lines)
│   ├── state/
│   │   └── GameState.ts                   # Game state manager (254 lines)
│   ├── renderer/
│   │   └── Renderer.ts                    # Canvas rendering (131 lines)
│   ├── engine/
│   │   └── Engine.ts                      # Game loop & engine (108 lines)
│   ├── main.ts                            # Entry point (36 lines)
│   └── style.scss                         # Game styling (39 lines)
├── index.html                             # HTML template
├── package.json                           # Dependencies
├── tsconfig.json                          # TypeScript config
├── pnpm-lock.yaml                         # Dependency lock file
├── README.md                              # Full documentation
├── ARCHITECTURE.md                        # This file
└── dist/                                  # Build output (generated)
```

## Total Lines of Code: ~1,050 lines of TypeScript

## Module Breakdown

### 1. Types Module (`src/types/entities.ts`) - 85 lines
Defines all interfaces:
- `Vector`: 2D position
- `BoundingBox`: Collision rectangles
- `Entity`: Base entity interface
- `PlayerData`, `EnemyData`, `BulletData`: Specific entity types
- `InputState`: Keyboard state
- `GameStateSnapshot`: AI query result
- `ClosestEnemy`: Enemy proximity data

### 2. Input Handler (`src/input/InputHandler.ts`) - 102 lines
Responsibilities:
- Listen to keyboard events (arrows + WASD)
- Track input state
- Support programmatic input (for AI)
- Distinguish between arrow and WASD keys

### 3. Player Entity (`src/entities/Player.ts`) - 116 lines
Responsibilities:
- Store position, velocity, health
- Update position with smooth acceleration
- Draw as green triangle
- Track fire rate and last shot time
- Clamp movement within screen bounds
- Maintain health system

### 4. Enemy Entity (`src/entities/Enemy.ts`) - 75 lines
Responsibilities:
- Store position and velocity
- Move downward at constant speed
- Draw as red inverted triangle
- Track health (3 hits to kill)
- Detect off-screen state for garbage collection

### 5. Bullet Entity (`src/entities/Bullet.ts`) - 77 lines
Responsibilities:
- Store position and velocity
- Move upward at high speed
- Draw as glowing yellow rectangle
- Track damage value (20 HP)
- Detect off-screen state
- Remember spawn time

### 6. Collision Detection (`src/physics/CollisionDetection.ts`) - 24 lines
Functions:
- `checkAABBCollision()`: AABB rectangle overlap
- `calculateDistance()`: Euclidean distance
- `clamp()`: Value constraint utility

### 7. Game State (`src/state/GameState.ts`) - 254 lines
Responsibilities:
- Manage player, enemies, bullets arrays
- Update all entities each frame
- Handle spawn logic (waves)
- Execute collision detection
- Garbage collect off-screen entities
- Calculate and return AI state snapshot
- Track score and game status
- Support pause/reset

### 8. Renderer (`src/renderer/Renderer.ts`) - 131 lines
Responsibilities:
- Clear canvas with dark background
- Draw starfield (pseudo-random)
- Draw player, enemies, bullets
- Render HUD (health, score, bullet count)
- Show game over screen
- Handle canvas resizing

### 9. Engine (`src/engine/Engine.ts`) - 108 lines
Responsibilities:
- Manage requestAnimationFrame loop
- Coordinate GameState update → Render cycle
- Calculate delta time
- Provide pause/reset controls
- Support external input injection
- Expose getGameState() for AI

### 10. Main Entry Point (`src/main.ts`) - 36 lines
Responsibilities:
- Create canvas element
- Initialize Engine
- Attach to DOM
- Expose global API for AI agents
- Handle window resize events

### 11. Styles (`src/style.scss`) - 39 lines
- Dark space theme
- Green glowing canvas border
- Proper viewport sizing
- No scroll overflow

## Key Design Patterns

### 1. **Entity Pattern**
```
Entity (interface)
├── Player (class)
├── Enemy (class)
└── Bullet (class)
```
Each entity has `update(deltaTime)` and `draw(ctx)` methods for clean frame loop.

### 2. **State Manager Pattern**
GameState holds all entities and orchestrates:
- Updates → Collisions → Garbage Collection → Queries

### 3. **Renderer Pattern**
Separation of physics from rendering:
- GameState manages position/health
- Renderer draws visual representation
- No game logic in drawing code

### 4. **Input Handler Pattern**
Abstract keyboard input:
- Tracks boolean state per key
- Can be controlled by human or AI
- No tight coupling to entities

### 5. **Engine Pattern**
requestAnimationFrame loop:
- Consistent frame timing
- Delta time calculation
- Smooth 60 FPS gameplay

## Data Flow

```
Input Events → InputHandler
                    ↓
             InputState (object)
                    ↓
Engine.gameLoop() every frame:
  GameState.update(deltaTime, inputState)
    ├─ Player.update(input)
    ├─ Enemies.update(deltaTime) ×N
    ├─ Bullets.update(deltaTime) ×M
    ├─ checkBulletEnemyCollisions()
    ├─ checkPlayerEnemyCollisions()
    ├─ spawnEnemies()
    ├─ bulletGarbageCollection()
    └─ enemyGarbageCollection()
         ↓
  Renderer.render():
    ├─ clear()
    ├─ drawPlayer(player)
    ├─ drawEnemies(enemies)
    ├─ drawBullets(bullets)
    └─ drawHUD(health, score)
         ↓
  RequestAnimationFrame
```

## Game Loop Timing

```
Frame Time = 16.67ms (60 FPS)

Each Frame:
1. Calculate deltaTime (current - last)
2. Update game state (all entities + logic)
3. Render scene
4. Schedule next frame
```

## Coordinate System

- **Origin**: Top-left (0, 0)
- **X-axis**: Left (0) → Right (canvasWidth)
- **Y-axis**: Top (0) → Bottom (canvasHeight)
- **Player spawn**: Bottom-center
- **Enemy spawn**: Top, random X

## Collision Rectangle Sizes

| Entity | Width | Height |
|--------|-------|--------|
| Player | 30px | 40px |
| Enemy | 25px | 25px |
| Bullet | 5px | 15px |

## Game Variables & Constants

### Player
- Max Speed: 400 px/s
- Acceleration: 1500 px/s²
- Fire Rate: 200ms (5 shots/sec)
- Health: 100 HP
- Size: 30×40 px

### Enemy
- Speed: 150 px/s (increases per wave)
- Health: 20 HP (3 bullets to kill)
- Size: 25×25 px
- Spawn Interval: 1500ms initial (decreases)
- Max Simultaneous: 15

### Bullet
- Speed: 600 px/s
- Damage: 20 HP
- Size: 5×15 px

### Waves
- Wave 1: 5 enemies
- Each wave: +3 more enemies
- Speed increase: +20 px/s per wave
- Spawn interval: -100ms per wave (min 800ms)

## Memory Management

### Garbage Collection Triggers
1. **Bullets**: Remove when y < -50 (above screen)
2. **Enemies**: Remove when y > canvasHeight + 50 (below screen) OR health ≤ 0

### Array Updates
- Use `splice()` to remove by index
- Use `filter()` for batch collection
- Reverse iteration to avoid index issues

## Performance Considerations

1. **requestAnimationFrame**: Synchronized with display refresh
2. **Delta Time**: Smooth movement regardless of frame rate
3. **Array Iteration**: Reverse loop for safe removal
4. **Collision Detection**: Early exit on first bullet hit
5. **No DOM Updates**: Pure Canvas rendering

## AI Integration Points

### Query API
```typescript
window.getGameState() → GameStateSnapshot
```
- Player position & health
- 5 closest enemies (with distance)
- Active bullet count
- Running status
- Score

### Control API
```typescript
window.setGameInput(partial<InputState>)
window.pauseGame(boolean)
window.resetGame()
window.gameEngine
```

### Steppable Design
- No hidden state
- Query at any time
- Input applied next frame
- Deterministic physics
- Pause-safe

## Testing Recommendations

1. **Unit Tests**: Collision detection, distance calculation
2. **Integration Tests**: GameState with mock entities
3. **Visual Tests**: Renderer with different canvas sizes
4. **AI Testing**: Query-control loop with custom agent

Example AI test:
```typescript
const initialState = window.getGameState();
window.setGameInput({ right: true });
// Wait one frame
const nextState = window.getGameState();
assert(nextState.player.x > initialState.player.x);
```

## Browser Compatibility

- **Canvas Support**: All modern browsers (Chrome, Firefox, Safari, Edge)
- **TypeScript Target**: ES2022
- **Vite Support**: All modern browsers (no IE support)
- **Input Events**: Standard KeyboardEvent API
- **Canvas API**: Standard 2D context

## Build Output

Production build size:
- CSS: ~1.28 KB (gzip: 0.65 KB)
- JS: ~11.35 KB (gzip: 3.33 KB)
- HTML: 0.42 KB
- **Total**: ~13 KB (gzip: ~4 KB)

---

This modular architecture ensures:
✅ Clean separation of concerns  
✅ Easy testing and debugging  
✅ Extensibility for new features  
✅ AI-agent compatibility  
✅ Type safety with TypeScript  
✅ No external game library dependencies  
