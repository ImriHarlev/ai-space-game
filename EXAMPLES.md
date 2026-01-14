# Developer Examples - Space Shooter Game

## Example 1: Simple Keyboard-Controlled Player

The default game uses keyboard input. Here's how it works:

```typescript
// From src/input/InputHandler.ts
const inputHandler = new InputHandler();

// Each frame, get current input state
const input = inputHandler.getInputState();
// Returns: { up: false, down: false, left: true, right: false, shoot: true }

// Update player based on input
player.update(deltaTime, input);
```

## Example 2: Basic AI - Always Move Right and Shoot

```javascript
// Run in browser console
function basicAI() {
  window.setGameInput({
    right: true,
    shoot: true
  });
  requestAnimationFrame(basicAI);
}

basicAI();
```

## Example 3: Chase Nearest Enemy AI

```javascript
function chaseAI() {
  const state = window.getGameState();
  
  if (!state.isGameRunning) {
    window.resetGame();
    return;
  }
  
  let moveLeft = false, moveRight = false, moveUp = false, moveDown = false;
  let shoot = false;
  
  if (state.closestEnemies.length > 0) {
    const enemy = state.closestEnemies[0];
    const playerX = state.player.x;
    const playerY = state.player.y;
    
    // Move towards enemy horizontally
    if (enemy.x < playerX - 20) {
      moveLeft = true;
    } else if (enemy.x > playerX + 20) {
      moveRight = true;
    }
    
    // Move towards enemy vertically
    if (enemy.y < playerY - 50) {
      moveUp = true;
    } else if (enemy.y > playerY - 200) {
      moveDown = true;
    }
    
    // Always shoot at enemies
    shoot = true;
  }
  
  window.setGameInput({
    left: moveLeft,
    right: moveRight,
    up: moveUp,
    down: moveDown,
    shoot: shoot
  });
  
  requestAnimationFrame(chaseAI);
}

chaseAI();
```

## Example 4: Smart Dodging AI

```javascript
function smartDodgeAI() {
  const state = window.getGameState();
  
  if (!state.isGameRunning) {
    window.resetGame();
    return;
  }
  
  let moveLeft = false, moveRight = false;
  let shoot = false;
  
  const playerX = state.player.x;
  
  // Find enemies directly above (dangerous)
  const dangerousEnemies = state.closestEnemies.filter(e => 
    Math.abs(e.x - playerX) < 100 && e.y < 500
  );
  
  if (dangerousEnemies.length > 0) {
    // Dodge by moving away from nearest dangerous enemy
    const danger = dangerousEnemies[0];
    if (danger.x < playerX) {
      moveRight = true; // Dodge right
    } else {
      moveLeft = true;  // Dodge left
    }
  } else if (state.closestEnemies.length > 0) {
    // No immediate danger, chase enemies
    const target = state.closestEnemies[0];
    if (target.x < playerX) {
      moveLeft = true;
    } else {
      moveRight = true;
    }
  }
  
  // Always shoot
  shoot = true;
  
  window.setGameInput({
    left: moveLeft,
    right: moveRight,
    shoot: shoot
  });
  
  requestAnimationFrame(smartDodgeAI);
}

smartDodgeAI();
```

## Example 5: Rage Quit AI (Pauses on Low Health)

```javascript
let isPaused = false;

function cautiousAI() {
  const state = window.getGameState();
  
  if (!state.isGameRunning) {
    console.log(`Game Over! Score: ${state.score}`);
    window.resetGame();
    isPaused = false;
    return;
  }
  
  // Pause if health is low
  if (state.player.health < 30 && !isPaused) {
    console.log("DANGER! Pausing...");
    window.pauseGame(true);
    isPaused = true;
    
    // Resume after 2 seconds
    setTimeout(() => {
      window.pauseGame(false);
      isPaused = false;
    }, 2000);
  }
  
  let moveLeft = false, moveRight = false;
  
  if (state.closestEnemies.length > 0) {
    const enemy = state.closestEnemies[0];
    if (enemy.x < state.player.x - 30) {
      moveLeft = true;
    } else if (enemy.x > state.player.x + 30) {
      moveRight = true;
    }
  }
  
  window.setGameInput({
    left: moveLeft,
    right: moveRight,
    shoot: true
  });
  
  requestAnimationFrame(cautiousAI);
}

cautiousAI();
```

## Example 6: Analytics & Performance Monitoring

```javascript
const analytics = {
  startTime: Date.now(),
  framesProcessed: 0,
  totalDamage: 0,
  lastScore: 0,
  enemiesKilled: 0,
  startAnalytics() {
    this.monitorLoop();
  },
  monitorLoop() {
    const state = window.getGameState();
    
    this.framesProcessed++;
    
    // Track score changes
    const scoreGain = state.score - this.lastScore;
    if (scoreGain > 0) {
      this.enemiesKilled += scoreGain / 10;
      this.lastScore = state.score;
    }
    
    // Log stats every 5 seconds
    if (this.framesProcessed % 300 === 0) {
      const elapsed = (Date.now() - this.startTime) / 1000;
      const fps = (this.framesProcessed / elapsed).toFixed(1);
      console.log({
        fps: fps,
        score: state.score,
        enemiesKilled: this.enemiesKilled,
        bulletCount: state.bulletCount,
        playerHealth: state.playerHealth,
        closestEnemy: state.closestEnemies[0]
      });
    }
    
    if (state.isGameRunning) {
      requestAnimationFrame(() => this.monitorLoop());
    }
  }
};

analytics.startAnalytics();
```

## Example 7: Q-Learning Framework (RL Preparation)

```javascript
class QLearningAgent {
  constructor() {
    this.qTable = new Map(); // state -> actions -> value
    this.learningRate = 0.1;
    this.discountFactor = 0.95;
    this.epsilon = 0.1; // Exploration rate
  }
  
  discretizeState(state) {
    // Convert continuous state to discrete buckets
    const playerX = Math.floor(state.player.x / 100);
    const playerY = Math.floor(state.player.y / 100);
    const enemyX = state.closestEnemies[0] 
      ? Math.floor(state.closestEnemies[0].x / 100) 
      : 0;
    const enemyY = state.closestEnemies[0] 
      ? Math.floor(state.closestEnemies[0].y / 100) 
      : 0;
    
    return `${playerX},${playerY},${enemyX},${enemyY}`;
  }
  
  chooseAction(state) {
    const discreteState = this.discretizeState(state);
    
    // Epsilon-greedy strategy
    if (Math.random() < this.epsilon) {
      // Random exploration
      return this.randomAction();
    }
    
    // Exploit best known action
    if (!this.qTable.has(discreteState)) {
      this.qTable.set(discreteState, {
        left: 0, right: 0, shoot: 0, nothing: 0
      });
    }
    
    const actions = this.qTable.get(discreteState);
    return Object.keys(actions).reduce((a, b) => 
      actions[a] > actions[b] ? a : b
    );
  }
  
  randomAction() {
    const actions = ['left', 'right', 'shoot', 'nothing'];
    return actions[Math.floor(Math.random() * actions.length)];
  }
  
  update(oldState, action, reward, newState) {
    const oldDiscrete = this.discretizeState(oldState);
    const newDiscrete = this.discretizeState(newState);
    
    // Initialize Q-values if needed
    if (!this.qTable.has(oldDiscrete)) {
      this.qTable.set(oldDiscrete, {
        left: 0, right: 0, shoot: 0, nothing: 0
      });
    }
    if (!this.qTable.has(newDiscrete)) {
      this.qTable.set(newDiscrete, {
        left: 0, right: 0, shoot: 0, nothing: 0
      });
    }
    
    // Q-learning update
    const oldQ = this.qTable.get(oldDiscrete)[action];
    const maxNewQ = Math.max(...Object.values(this.qTable.get(newDiscrete)));
    const newQ = oldQ + this.learningRate * (reward + this.discountFactor * maxNewQ - oldQ);
    
    this.qTable.get(oldDiscrete)[action] = newQ;
  }
  
  run() {
    let lastScore = 0;
    const agent = this;
    
    function train() {
      const state = window.getGameState();
      
      if (!state.isGameRunning) {
        window.resetGame();
        lastScore = 0;
        return;
      }
      
      // Choose action
      const action = agent.chooseAction(state);
      const reward = (state.score - lastScore) / 10;
      lastScore = state.score;
      
      // Convert action to input
      const input = {
        left: action === 'left',
        right: action === 'right',
        shoot: action === 'shoot',
        up: false,
        down: false
      };
      
      // Execute action
      window.setGameInput(input);
      
      // Get new state and update Q-values
      const newState = window.getGameState();
      agent.update(state, action, reward, newState);
      
      requestAnimationFrame(train);
    }
    
    train();
  }
}

// Use it:
const agent = new QLearningAgent();
agent.run();
```

## Example 8: Network Request Integration (Multiplayer Score)

```javascript
async function submitScore() {
  const state = window.getGameState();
  
  try {
    const response = await fetch('https://your-server.com/scores', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        score: state.score,
        playerName: 'AI Agent v1',
        timestamp: new Date().toISOString(),
        gameState: state
      })
    });
    
    const result = await response.json();
    console.log('Score submitted:', result);
  } catch (error) {
    console.error('Failed to submit score:', error);
  }
}

// Call when game ends
function gameWithScoreSubmission() {
  const state = window.getGameState();
  
  if (!state.isGameRunning && state.score > 0) {
    submitScore();
    window.resetGame();
  }
  
  window.setGameInput({ shoot: true });
  requestAnimationFrame(gameWithScoreSubmission);
}

gameWithScoreSubmission();
```

## Example 9: Adding Custom Game Logic

You can extend the game by modifying source files:

```typescript
// In src/state/GameState.ts, add a custom power-up system

interface PowerUp {
  position: Vector;
  type: 'health' | 'rapidFire' | 'shield';
  active: boolean;
}

// Add to GameState class
private powerUps: PowerUp[] = [];

// In update method
private updatePowerUps(): void {
  for (const powerUp of this.powerUps) {
    if (checkAABBCollision(powerUp, this.player.getBoundingBox())) {
      this.applyPowerUp(powerUp);
    }
  }
}

private applyPowerUp(powerUp: PowerUp): void {
  switch (powerUp.type) {
    case 'health':
      this.player.health = Math.min(100, this.player.health + 25);
      break;
    case 'rapidFire':
      this.player.fireRate = 100; // Faster shooting
      break;
    case 'shield':
      // Implement shield logic
      break;
  }
}
```

## Example 10: Performance Profiling

```javascript
class PerformanceMonitor {
  constructor() {
    this.metrics = {
      updateTime: [],
      renderTime: [],
      frameTime: []
    };
  }
  
  profileFrame(callback) {
    const frameStart = performance.now();
    
    const updateStart = performance.now();
    callback();
    const updateEnd = performance.now();
    
    const renderStart = performance.now();
    // (rendering happens in engine)
    const renderEnd = performance.now();
    
    const frameEnd = performance.now();
    
    this.metrics.updateTime.push(updateEnd - updateStart);
    this.metrics.frameTime.push(frameEnd - frameStart);
    
    if (this.metrics.updateTime.length === 60) {
      this.printStats();
    }
  }
  
  printStats() {
    const avg = (arr) => arr.reduce((a,b) => a+b) / arr.length;
    const max = (arr) => Math.max(...arr);
    
    console.log({
      avgUpdateTime: avg(this.metrics.updateTime).toFixed(2) + 'ms',
      maxUpdateTime: max(this.metrics.updateTime).toFixed(2) + 'ms',
      avgFrameTime: avg(this.metrics.frameTime).toFixed(2) + 'ms',
      fps: (1000 / avg(this.metrics.frameTime)).toFixed(1)
    });
    
    this.metrics.updateTime = [];
    this.metrics.frameTime = [];
  }
}
```

---

These examples show how to:
1. Create custom AI behaviors
2. Integrate with external systems
3. Implement learning algorithms
4. Monitor performance
5. Add game features

All examples use the public API exposed by `window` object!
