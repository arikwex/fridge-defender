import { ctx, canvas } from './canvas';

let lastRender = Date.now();

function render(gameEngine) {
  let dT = (Date.now() - lastRender) / 1000;
  if (dT > 0.3) { dT = 0.3; }
  lastRender = Date.now();

  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // render player
  gameEngine.state.player.render(dT);
};

export default {
  render,
};