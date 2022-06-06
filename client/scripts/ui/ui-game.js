import { ctx, canvas } from './canvas';


function render(dT, gameEngine) {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // camera placement
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // render player
  gameEngine.state.player.render(dT);

  ctx.restore();
};

export default {
  render,
};