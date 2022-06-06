import { ctx, canvas } from './canvas';

function rotLevel(l) {
  if (l < 5) {
    return 'Fresh';
  } else if (l < 10) {
    return 'Sour';
  } else if (l < 15) {
    return 'Putrid';
  } else {
    return 'Rotten';
  }
}

function rotColor(l) {
  if (l < 5) {
    return '#272';
  } else if (l < 10) {
    return '#773';
  } else if (l < 15) {
    return '#a74';
  } else {
    return '#e33';
  }
}

function render(dT, gameEngine) {
  ctx.fillStyle = '#eee';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // camera placement
  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);

  // Ground
  ctx.fillStyle = "#aaa";
  ctx.fillRect(-canvas.width/2, 0, canvas.width, canvas.height/2);

  // render player
  gameEngine.state.player.render(dT);

  // render enemies
  for (const e of gameEngine.state.enemies) {
    e.render(dT);
  }

  ctx.restore();

  // UI ELEMENTS
  ctx.fillStyle = '#111';

  ctx.textBaseline = 'middle';
  ctx.font = '40px Jaldi';
  ctx.textAlign = 'center';
  ctx.fillText(`💀`, 30, canvas.height - 30);
  ctx.textAlign = 'left';
  ctx.fillText(`${gameEngine.state.killCounter}`, 60, canvas.height - 30);

  const liveEnemies = gameEngine.liveEnemies();
  ctx.fillStyle = rotColor(liveEnemies);
  ctx.textAlign = 'center';
  ctx.fillText(`🗑️`, 30, canvas.height - 90);
  ctx.textAlign = 'left';
  ctx.fillText(`${rotLevel(liveEnemies)}`, 60, canvas.height - 90);

  ctx.fillStyle = '#111';
  ctx.textAlign = 'center';
  ctx.fillText(`🔋`, 30, canvas.height - 150);
  ctx.textAlign = 'left';
  ctx.fillText(`${gameEngine.state.player.charge}%`, 60, canvas.height - 150);
};

export default {
  render,
};