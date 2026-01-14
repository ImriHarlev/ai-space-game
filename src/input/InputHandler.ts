/**
 * Input Handler - Manages keyboard input and tracks input state
 */

import type { InputState } from '../types/entities';

export class InputHandler {
  private inputState: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    shoot: false,
  };

  constructor() {
    this.setupEventListeners();
  }

  /**
   * Set up keyboard event listeners
   */
  private setupEventListeners(): void {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));
  }

  /**
   * Handle keydown events
   */
  private handleKeyDown(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'arrowup':
      case 'w':
        this.inputState.up = true;
        event.preventDefault();
        break;
      case 'arrowdown':
      case 's':
        this.inputState.down = true;
        event.preventDefault();
        break;
      case 'arrowleft':
      case 'a':
        this.inputState.left = true;
        event.preventDefault();
        break;
      case 'arrowright':
      case 'd':
        this.inputState.right = true;
        event.preventDefault();
        break;
      case ' ':
        this.inputState.shoot = true;
        event.preventDefault();
        break;
    }
  }

  /**
   * Handle keyup events
   */
  private handleKeyUp(event: KeyboardEvent): void {
    const key = event.key.toLowerCase();

    switch (key) {
      case 'arrowup':
      case 'w':
        this.inputState.up = false;
        event.preventDefault();
        break;
      case 'arrowdown':
      case 's':
        this.inputState.down = false;
        event.preventDefault();
        break;
      case 'arrowleft':
      case 'a':
        this.inputState.left = false;
        event.preventDefault();
        break;
      case 'arrowright':
      case 'd':
        this.inputState.right = false;
        event.preventDefault();
        break;
      case ' ':
        this.inputState.shoot = false;
        event.preventDefault();
        break;
    }
  }

  /**
   * Get current input state
   */
  getInputState(): Readonly<InputState> {
    return { ...this.inputState };
  }

  /**
   * Set input state programmatically (for AI control)
   */
  setInputState(input: Partial<InputState>): void {
    this.inputState = { ...this.inputState, ...input };
  }

  /**
   * Reset all input states
   */
  reset(): void {
    this.inputState = {
      up: false,
      down: false,
      left: false,
      right: false,
      shoot: false,
    };
  }
}
