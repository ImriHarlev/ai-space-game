# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm run dev      # dev server at http://localhost:5173
pnpm run build    # tsc + vite build → dist/
pnpm run preview  # preview prod build at http://localhost:4173
```

No test runner configured.

## Architecture

Vanilla TypeScript 2D Canvas game — no game engine, no external game libraries. Vite + SCSS.

**Data flow:**
```
InputHandler (keyboard state) → Engine.gameLoop() [requestAnimationFrame]
                                     → GameState.update(deltaTime, inputState)
                                           → entity updates, spawning, AABB collision, GC
                                     → Renderer.render()
```

**Module responsibilities:**

| Module | File | Role |
|--------|------|------|
| Types | `src/types/entities.ts` | All shared interfaces — add new entity types here first |
| Engine | `src/engine/Engine.ts` | rAF loop, delta-time, pause/reset |
| GameState | `src/state/GameState.ts` | All game logic — entities, waves, collisions, scoring |
| Renderer | `src/renderer/Renderer.ts` | Canvas drawing only, no logic |
| InputHandler | `src/input/InputHandler.ts` | Keyboard state + programmatic input injection |
| Player/Enemy/Bullet | `src/entities/` | Each entity owns its own update + draw |
| CollisionDetection | `src/physics/CollisionDetection.ts` | AABB collision, distance, clamp |

**Key invariant:** GameState is pure logic; Renderer is pure drawing. Never mix them.

## Entity system

All entities implement the `Entity` interface (`update(dt, input)` + `draw(ctx)`). To add a new entity type:
1. Define its data interface in `src/types/entities.ts`
2. Create class in `src/entities/` implementing `Entity`
3. Add array to `GameState`, update spawning/collision/GC logic there
4. Add draw call to `Renderer`

## AI control API

Exposed on `window` for external agents or testing:

```typescript
window.getGameState(): GameStateSnapshot   // player pos/health, closest enemies, score
window.setGameInput(Partial<InputState>): void  // inject input programmatically
window.pauseGame(paused: boolean): void
window.resetGame(): void
```

`InputState`: `{ up, down, left, right, shoot }` — all booleans.

## Game constants (in source, not config files)

- Player: 100 HP, max speed 400 px/s, fire rate 200ms
- Bullets: 600 px/s, 20 damage
- Enemies: 20 HP, wave starts at 5 enemies (+3/wave), speed starts at 80 px/s (+20/wave)
- Scoring: +10 per kill, +5 per survived collision
