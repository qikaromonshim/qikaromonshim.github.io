const canvas = document.getElementById('bgCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

window.addEventListener('resize', () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

const mouse = { x: 0, y: 0 };

window.addEventListener('mousemove', e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

export { canvas, ctx, width, height, mouse };

