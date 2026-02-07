import { ctx, width, height, mouse } from '../core/canvas.js';

export class Crystal {
  constructor() {
    this.size = 30;
    this.state = "normal"; 
    this.explodeTimer = 0;
    this.reset();
  }

  reset() {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 1.5;
    this.vy = (Math.random() - 0.5) * 1.5;
  }

update() {
  this.x += this.vx;
  this.y += this.vy;

  const dx = this.x - mouse.x;
  const dy = this.y - mouse.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 120) {
    const a = Math.atan2(dy, dx);
    this.vx += Math.cos(a) * 0.8;
    this.vy += Math.sin(a) * 0.8;
  }

 
  this.vx = Math.max(-1.5, Math.min(1.5, this.vx));
  this.vy = Math.max(-1.5, Math.min(1.5, this.vy));

  if (this.x < 0 || this.x > width) this.vx *= -1;
  if (this.y < 0 || this.y > height) this.vy *= -1;

  if (this.state === "explode") {
  this.vx = 0;
  this.vy = 0;
}
  if (this.state === "explode") {
    this.size += 2;
    this.explodeTimer--;

    if (this.explodeTimer <= 0) {
      this.reset();
      this.size = 30;
      this.state = "normal";
    }
  }
}



  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.fillStyle = this.state === "explode" ? "orange" : "white";

  }

  isClicked(mx, my) {
  const hit = Math.hypot(this.x - mx, this.y - my) < this.size + 10;

  if (hit && this.state === "normal") {
    this.state = "explode";
    this.explodeTimer = 10;
    return true;
  }

  return false;
 }
}

