import bus from '../bus.js';
import Player from '../components/player.js';
import Enemy from '../components/enemy.js';
import { canvas } from '../ui/canvas.js';

const GameEngine = () => {
  const state = {
    player: new Player(0, 0),
    enemies: [],
    killCounter: 0,
    spawnTimer: 11111,
    gameOver: false,
  };

  function update(dT) {
    if (state.gameOver) {
      return;
    }
    state.spawnTimer += dT;
    state.player.update(dT);

    const removeList = [];
    for (const e of state.enemies) {
      e.update(dT, this);
      if (e.deathTimer > 2) {
        removeList.push(e);
      }
    }
    if (removeList.length > 0) {
      state.enemies = state.enemies.filter((e) => !removeList.includes(e));
    }

    if (state.spawnTimer > 0.5) {//Math.max(3.0 - state.killCounter / 10, 0.7)) {
      state.spawnTimer = 0;
      let maxDif = Math.min(7, state.killCounter * 0.2 + 0.5);
      state.enemies.push(new Enemy(canvas.width * (Math.random() - 0.5), -canvas.height/2 - 50, parseInt(Math.random() * maxDif)));
    }

    if (state.enemies.length >= 30) {
      state.gameOver = true;
      bus.emit('game-over');
    }
  }

  function liveEnemies() {
    let h = 0;
    for (const e of state.enemies) {
      if (e.hp > 0) { h += 1; }
    }
    return h;
  }

  function onPunch(evt) {
    for (const e of state.enemies) {
      e.hitCheck(evt);
    }
  }

  function onEnemyKilled(evt) {
    state.killCounter += 1;
    state.player.chargeUp(5);
  }

  // Game events
  bus.on('punch', onPunch);
  bus.on('killed', onEnemyKilled);

  return {
    state,
    update,
    liveEnemies,
  };
};

export default GameEngine;