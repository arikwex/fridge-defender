import { ctx, canvas } from './canvas';


function render(dT, gameEngine) {
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