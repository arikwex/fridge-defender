import { ctx, canvas } from './canvas';

const bgElements = [
  '🥛', '🧀', '🍕', '🧆', '🥓', '🥑', '🥩', '🥪',
];
const bgElements2 = [
  '🥫', '🍲', '🥡', '🦐', '🍆', '🥬', '🍣', '🍅',
];

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

  // Background
  ctx.fillStyle = "#ddd";
  ctx.fillRect(-canvas.width/2, -190, canvas.width, 20);
  ctx.fillRect(-canvas.width/2, -390, canvas.width, 20);
  ctx.font = '40px Jaldi';
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  let j = 0;
  for (let i = -canvas.width/2; i < canvas.width/2; i += 80) {
    if (Math.sin(i * 3) + Math.sin(i * 2) * 0.5 > 0.5) { continue; }
    j += 3;
    ctx.fillText(bgElements[(j) % bgElements.length], i, -200);
  }
  for (let i = -canvas.width/2; i < canvas.width/2; i += 80) {
    if (Math.cos(i * 2 + 5) + Math.sin(i * 3 + 2) * 0.5 > 0.5) { continue; }
    j += 3;
    ctx.fillText(bgElements2[(j) % bgElements2.length], i, -400);
  }

  // render enemies
  for (const e of gameEngine.state.enemies) {
    e.render(dT);
  }

  // render player
  gameEngine.state.player.render(dT);

  ctx.restore();

  // nukeflash
  if (gameEngine.state.nuke > 0) {
    ctx.fillStyle = `rgba(255,255,190,${gameEngine.state.nuke})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

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
  let useIt = '';
  if (gameEngine.state.player.charge >= 100) {
    useIt = 'Press [X] to nuke';
  }
  ctx.fillText(`${gameEngine.state.player.charge}% ${useIt}`, 60, canvas.height - 150);

  if (gameEngine.state.gameOver) {
    ctx.fillStyle = '#333';
    ctx.fillRect(0, canvas.height/4-50, canvas.width, 100);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#fdd';
    ctx.font = '50px Jaldi';
    ctx.fillText(`GAME OVER - Too much rot!`, canvas.width/2, canvas.height/4+10);
  }
};

export default {
  render,
};