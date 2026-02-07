import { ctx, width, height, mouse } from '../core/canvas.js';

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 6;
    this.vy = (Math.random() - 0.5) * 6;
    this.life = 30;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw() {
    ctx.fillStyle = 'rgba(255,255,255,0.8)';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class Crystal {
  constructor() {
    this.baseSize = 30;
    this.size = this.baseSize;
    this.state = "move"; // move | freeze | explode
    this.timer = 0;
    this.particles = [];
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.2;
    this.vy = (Math.random() - 0.5) * 1.2;
    this.size = this.baseSize;
    this.state = "move";
    this.timer = 0;
    this.particles = [];
  }

  click() {
    if (this.state === "move") {
      this.state = "freeze";
      this.timer = 20; // durup bakma süresi
      this.vx = 0;
      this.vy = 0;
    }
  }

  update() {

    // 🧊 DURUP BÜYÜME
    if (this.state === "freeze") {
      this.size += 0.6;
      this.timer--;
      if (this.timer <= 0) {
        this.state = "explode";
        for (let i = 0; i < 20; i++) {
          this.particles.push(new Particle(this.x, this.y));
        }
      }
      return;
    }

    // 💥 PATLAMA
    if (this.state === "explode") {
      this.particles.forEach(p => p.update());
      this.particles = this.particles.filter(p => p.life > 0);
      if (this.particles.length === 0) {
        this.reset();
      }
      return;
    }

    // 🏃 NORMAL HAREKET
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

    this.vx = Math.max(-1.2, Math.min(1.2, this.vx));
    this.vy = Math.max(-1.2, Math.min(1.2, this.vy));

    if (this.x < this.size || this.x > width - this.size) this.vx *= -1;
    if (this.y < this.size || this.y > height - this.size) this.vy *= -1;
  }

  draw() {
    if (this.state !== "explode") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
    }

    this.particles.forEach(p => p.draw());
  }

  isClicked(mx, my) {
    return Math.hypot(this.x - mx, this.y - my) < this.size;
  }
}
