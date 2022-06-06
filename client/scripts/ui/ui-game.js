import { ctx, canvas } from './canvas';

function rotLevel(l) {
  if (l < 5) {
    return `Fresh - ${l} / 30`;
  } else if (l < 15) {
    return `Sour - ${l} / 30`;
  } else if (l < 30) {
    return `Putrid - ${l} / 30`;
  } else {
    return `Rotten!!! - ${l} / 30`;
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

  if (gameEngine.state.gameOver) {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height/4-50, canvas.width, 100);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#f00';
    ctx.font = '60px arial';
    ctx.fillText(`GAME OVER - Too much rot!`, canvas.width/2, canvas.height/4);
  }
};

export default {
  render,
};