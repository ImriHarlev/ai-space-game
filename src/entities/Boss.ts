import type { BossData, Vector, BoundingBox } from '../types/entities';

export class Boss implements BossData {
  position: Vector;
  velocity: Vector;
  width: number = 80;
  height: number = 65;
  health: number;
  maxHealth: number;
  spawnTime: number;

  private targetY: number = 100;
  private hasReachedTarget: boolean = false;
  private phase: number = 0;
  private horizontalFrequency: number = 0.9;
  private horizontalAmplitude: number;
  private centerX: number;

  constructor(canvasWidth: number, spawnTime: number, waveNumber: number) {
    this.centerX = canvasWidth / 2;
    this.position = { x: this.centerX - this.width / 2, y: -this.height };
    this.velocity = { x: 0, y: 80 };
    this.spawnTime = spawnTime;
    this.maxHealth = 300 + waveNumber * 40;
    this.health = this.maxHealth;
    this.horizontalAmplitude = canvasWidth / 2 - this.width - 20;
  }

  update(deltaTime: number): void {
    const dt = deltaTime / 1000;

    if (!this.hasReachedTarget) {
      this.position.y += this.velocity.y * dt;
      if (this.position.y >= this.targetY) {
        this.position.y = this.targetY;
        this.hasReachedTarget = true;
      }
    } else {
      this.phase += this.horizontalFrequency * dt;
      this.position.x = this.centerX - this.width / 2 + Math.sin(this.phase) * this.horizontalAmplitude;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    const cx = this.position.x + this.width / 2;
    const cy = this.position.y + this.height / 2;
    const w = this.width;
    const h = this.height;

    ctx.save();
    ctx.translate(cx, cy);

    // Wings
    ctx.fillStyle = '#330066';
    ctx.beginPath();
    ctx.moveTo(-w * 0.4, -h * 0.1);
    ctx.lineTo(-w * 0.9, h * 0.35);
    ctx.lineTo(-w * 0.55, h * 0.45);
    ctx.lineTo(-w * 0.35, h * 0.1);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(w * 0.4, -h * 0.1);
    ctx.lineTo(w * 0.9, h * 0.35);
    ctx.lineTo(w * 0.55, h * 0.45);
    ctx.lineTo(w * 0.35, h * 0.1);
    ctx.closePath();
    ctx.fill();

    // Main hull
    ctx.fillStyle = '#5500AA';
    ctx.strokeStyle = '#BB00FF';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(0, -h * 0.5);
    ctx.lineTo(w * 0.35, -h * 0.25);
    ctx.lineTo(w * 0.48, h * 0.2);
    ctx.lineTo(w * 0.3, h * 0.5);
    ctx.lineTo(-w * 0.3, h * 0.5);
    ctx.lineTo(-w * 0.48, h * 0.2);
    ctx.lineTo(-w * 0.35, -h * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Armor plates
    ctx.strokeStyle = '#AA00EE';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-w * 0.25, -h * 0.35);
    ctx.lineTo(w * 0.25, -h * 0.35);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-w * 0.38, h * 0.05);
    ctx.lineTo(w * 0.38, h * 0.05);
    ctx.stroke();

    // Core glow
    const grd = ctx.createRadialGradient(0, -h * 0.05, 2, 0, -h * 0.05, 18);
    grd.addColorStop(0, '#FF44FF');
    grd.addColorStop(0.5, '#AA00FF');
    grd.addColorStop(1, 'rgba(100,0,200,0)');
    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(0, -h * 0.05, 18, 0, Math.PI * 2);
    ctx.fill();

    // Cannon barrel
    ctx.fillStyle = '#220044';
    ctx.fillRect(-5, h * 0.32, 10, h * 0.22);
    ctx.fillStyle = '#FF0066';
    ctx.beginPath();
    ctx.arc(0, h * 0.5 + 2, 6, 0, Math.PI * 2);
    ctx.fill();

    // Engine exhausts (bottom wings)
    ctx.fillStyle = '#FF6600';
    ctx.beginPath();
    ctx.arc(-w * 0.6, h * 0.38, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(w * 0.6, h * 0.38, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    this.drawHealthBar(ctx);
  }

  private drawHealthBar(ctx: CanvasRenderingContext2D): void {
    const barW = this.width + 24;
    const barH = 10;
    const x = this.position.x - 12;
    const y = this.position.y - 22;

    ctx.fillStyle = '#1a0000';
    ctx.fillRect(x, y, barW, barH);

    const ratio = Math.max(0, this.health / this.maxHealth);
    ctx.fillStyle = ratio > 0.5 ? '#00DD00' : ratio > 0.25 ? '#FF9900' : '#FF2200';
    ctx.fillRect(x, y, barW * ratio, barH);

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, barW, barH);

    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 9px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('BOSS', x + barW / 2, y - 3);
  }

  getBoundingBox(): BoundingBox {
    return {
      x: this.position.x,
      y: this.position.y,
      width: this.width,
      height: this.height,
    };
  }

  takeDamage(amount: number): void {
    this.health -= amount;
  }

  isAlive(): boolean {
    return this.health > 0;
  }

  isOffScreen(canvasHeight: number): boolean {
    return this.position.y > canvasHeight + 100;
  }
}
