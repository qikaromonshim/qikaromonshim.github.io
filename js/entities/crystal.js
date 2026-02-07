import { ctx, width, height, mouse } from '../core/canvas.js';

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.life = 80; // DAHA UZUN
    this.size = 4;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.98; // YAVAŞLAMA
    this.vy *= 0.98;
    this.life--;
  }

  draw() {
    ctx.fillStyle = `rgba(255,255,255,${this.life / 80})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }
}

export class Crystal {
  constructor() {
    this.baseSize = 30;
    this.size = this.baseSize;
    this.state = "move"; // move | freeze | explode | wait
    this.timer = 0;
    this.particles = [];
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1;
    this.vy = (Math.random() - 0.5) * 1;
    this.size = this.baseSize;
    this.state = "move";
    this.timer = 0;
    this.particles = [];
  }

  click() {
    if (this.state === "move") {
      this.state = "freeze";
      this.timer = 60; // 1 SANİYE DURUR
      this.vx = 0;
      this.vy = 0;
    }
  }

  update() {

    // 🧊 DONMA + ŞİŞME
    if (this.state === "freeze") {
      this.size += 0.15;
      this.timer--;
      if (this.timer <= 0) {
        this.state = "explode";
        for (let i = 0; i < 30; i++) {
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
        this.state = "wait";
        this.timer = 40; // patlama sonrası bekleme
      }
      return;
    }

    // ⏳ ÖLÜ HAL (BOŞLUK)
    if (this.state === "wait") {
      this.timer--;
      if (this.timer <= 0) {
        this.reset();
      }
      return;
    }

    // 🏃 NORMAL KAÇMA
    this.x += this.vx;
    this.y += this.vy;

    const dx = this.x - mouse.x;
    const dy = this.y - mouse.y;
    const dist = Math.hypot(dx, dy);

    if (dist < 140) {
      const a = Math.atan2(dy, dx);
      this.vx += Math.cos(a) * 0.25;
      this.vy += Math.sin(a) * 0.25;
    }

    this.vx = Math.max(-1, Math.min(1, this.vx));
    this.vy = Math.max(-1, Math.min(1, this.vy));

    if (this.x < this.size || this.x > width - this.size) this.vx *= -1;
    if (this.y < this.size || this.y > height - this.size) this.vy *= -1;
  }

  draw() {
    if (this.state === "move" || this.state === "freeze") {
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
