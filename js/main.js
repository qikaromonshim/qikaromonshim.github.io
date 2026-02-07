import { ctx, width, height, canvas } from './core/canvas.js';
import { Crystal } from './entities/crystal.js';

const crystal = new Crystal();
let score = 0;

canvas.addEventListener('click', e => {
  if (crystal.isClicked(e.clientX, e.clientY)) {
    score++;
    crystal.click();
  }
});

function animate() {
  ctx.clearRect(0, 0, width, height);

  crystal.update();
  crystal.draw();

  ctx.fillStyle = 'white';
  ctx.font = '20px Arial';
  ctx.fillText(`Score: ${score}`, 20, 30);

  requestAnimationFrame(animate);
}

animate();
