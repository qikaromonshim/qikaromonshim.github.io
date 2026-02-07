import { ctx, width, height, mouse } from '../core/canvas.js';

export class Crystal {
  constructor() {
    this.size = 30;
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 4;
    this.vy = (Math.random() - 0.5) * 4;
  }

update() {
  this.x += this.vx;
  this.y += this.vy;

  const dx = this.x - mouse.x;
  const dy = this.y - mouse.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 120) {
    const a = Math.atan2(dy, dx);
    this.vx += Math.cos(a) * 0.3;
    this.vy += Math.sin(a) * 0.3;
  }

  // hız limiti (çok önemli)
  this.vx = Math.max(-3, Math.min(3, this.vx));
  this.vy = Math.max(-3, Math.min(3, this.vy));

  if (this.x < 0 || this.x > width) this.vx *= -1;
  if (this.y < 0 || this.y > height) this.vy *= -1;
}


  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  }

  isClicked(mx, my) {
    return Math.hypot(this.x - mx, this.y - my) < this.size + 10;
  }
}

