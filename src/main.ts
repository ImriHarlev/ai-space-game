import './style.scss';
import { Engine } from './engine/Engine';
import type { GameStateSnapshot } from './types/entities';

// Initialize canvas
const appDiv = document.querySelector<HTMLDivElement>('#app');
if (!appDiv) {
  throw new Error('Could not find #app element');
}

// Create canvas element
const canvas = document.createElement('canvas');
canvas.id = 'gameCanvas';
canvas.width = window.innerWidth * 0.95;
canvas.height = window.innerHeight * 0.95;
appDiv.appendChild(canvas);

// Initialize game engine
const engine = new Engine(canvas);
engine.start();

// Handle window resize
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth * 0.95;
  canvas.height = window.innerHeight * 0.95;
  engine.resizeCanvas(canvas.width, canvas.height);
});

// Expose engine and game state for external agents
declare global {
  interface Window {
    gameEngine: Engine;
    getGameState: () => GameStateSnapshot;
    setGameInput: (input: Partial<import('./types/entities').InputState>) => void;
    pauseGame: (paused: boolean) => void;
    resetGame: () => void;
  }
}

window.gameEngine = engine;
window.getGameState = () => engine.getGameState();
window.setGameInput = (input) => engine.setInputState(input);
window.pauseGame = (paused) => engine.setPaused(paused);
window.resetGame = () => engine.reset();
